const { creepTypesPerRoom } = require('./creepTypesPerRoom');
const { creepCountsPerRoom } = require('./creepCountsPerRoom');
const { spawnType } = require('./spawnType');
const { bodyCost } = require('./bodyCost');

// This is the role spawn file.

const attackingCreepCount = _.reduce(Game.creeps, (accum, creep) => {
  if (creep.memory.rallyPoint === 'AttackMove')
    return accum + 1;
  else
    return accum;
}, 0);

function roomControllerNeedsClaim(room) {
  if (!room.controller || room.controller.my || Object.values(Game.creeps).find(creep => creep.memory.targetPos && creep.ticksToLive > 100 && arePositionsEqual(creep.memory.targetPos, room.controller.pos)))
    return false;

  if (room.controller.reservation && room.controller.reservation.owner === 'ComradeJoecool' && room.controller.reservation.ticksToEnd > 2000)
    return false;

  return true;
}

function runSpawn(spawner) {
  spawner.memory.saving = false;

  const creepsInRoom = spawner.room.find(FIND_MY_CREEPS);
  for (const creep of creepsInRoom) {
    if (creep.pos.inRangeTo(spawner, 1)) {
      if (creep.ticksToLive === 1495 && (creep.memory.role === 'defender' || creep.memory.role === 'attacker'))
        spawner.recycleCreep(creep);
      // else if (creep.ticksToLive < 1400)
      //   spawner.renewCreep(creep);
    }
  }

  if (spawner.spawning)
    return;

  const currentEnergy = spawner.room.energyAvailable;

  if (currentEnergy < 200)
    return;

  const creepQuotasForRoom = { ...creepCountsPerRoom(spawner.room.name) };

  const numSources = spawner.room.find(FIND_SOURCES).length;
  const extractors = spawner.room.find(FIND_STRUCTURES, {
    filter: structure => structure.structureType === STRUCTURE_EXTRACTOR
  });
  let numExtractors = extractors.length;
  for (const extractor of extractors) {
    const minerals = extractor.pos.lookFor(LOOK_MINERALS);
    if (!minerals || !minerals[0].mineralAmount)
      numExtractors--;
  }
  creepQuotasForRoom.heavyHarvester = numSources + numExtractors;
  creepQuotasForRoom.carrier = numSources + numExtractors;

  const enemiesInRoomCount = spawner.room.find(FIND_HOSTILE_CREEPS, {
    filter: function (object) {
      return object.getActiveBodyparts(HEAL) + object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
    }
  }).length;

  if (enemiesInRoomCount)
    creepQuotasForRoom.defender = enemiesInRoomCount;

  let creepTypesForThisRoom = creepTypesPerRoom(spawner.room.name);
  if (!creepTypesForThisRoom)
    creepTypesForThisRoom = creepTypes;


  const typeVals = Object.values(creepTypesForThisRoom);
  if (typeVals.length < 1)
    return;

  const countsForThisRoom = { total: 0 };
  for (const typeKey of Object.keys(creepTypesForThisRoom)) {
    countsForThisRoom[typeKey] = 0;
  }


  if (Game.time % 17 === 0) {
    for (const room of Object.values(Game.rooms)) {
      let roomControllerNeedsClaimy = roomControllerNeedsClaim(room);
      if (roomControllerNeedsClaimy && Game.map.getRoomLinearDistance(room.controller.pos.roomName, spawner.room.name, true) < 4) {
        console.log('Claim is low on', room.name, room.controller.reservation ? room.controller.reservation.ticksToEnd : 'unreserved');
        creepTypesForThisRoom.claimer.memory.targetPos = room.controller.pos;
        creepQuotasForRoom.claimer = 1;
        break;
      }
    }
  } //@TODO refactor how claims are determined and do it once rather than per spawn

  let targetPos;
  targetPos = undefined;
  for (const room of Object.values(Game.rooms)) {

    if (room.controller && (!room.controller.my || (room.controller.reservation && room.controller.reservation.username !== 'ComradeJoecool'))) {
      if (room.find(FIND_MY_CREEPS, { filter: creep => creep.memory.role === 'remoteHarvester' || creep.memory.role === 'claimer' }).length === 0)
        continue;
    }

    let targets = [];
    targets.push(...room.find(FIND_HOSTILE_CREEPS));
    targets.push(...room.find(FIND_HOSTILE_STRUCTURES, { filter: (object) => object.structureType !== STRUCTURE_CONTROLLER }));


    if (targets.length > 0 && room.controller && Game.map.getRoomLinearDistance(room.controller.pos.roomName, spawner.room.name, true) < 4) {
      console.log('Hostiles spotted in', room.name, targets, targets[0].name, targets[0].owner.username, targets[0].structureType);
      targetPos = { x, y, roomPosition } = room.controller.pos;
      break;
    }
  }

  Memory.hostilesAt = targetPos;

  if (targetPos) {
    let attackerCount = 0;
    for (const creep of Object.values(Game.creeps))
      if (creep.memory.role === 'attacker' || creep.memory.role === 'defender') {
        creep.memory.targetPos = targetPos;
        attackerCount++;
      }

    if (creepTypesForThisRoom.attacker && attackerCount < 8) {
      creepQuotasForRoom.attacker = 2;
      // creepTypesForThisRoom.attacker.memory.rallyPoint = undefined;
      creepTypesForThisRoom.attacker.memory.targetPos = targetPos;
      console.log('die');
    }
  }

  let storedEnergy = 0;


  const storages = spawner.room.find(FIND_MY_STRUCTURES, {
    filter: struc => struc.structureType === STRUCTURE_STORAGE
  });

  for (const storageStructure of storages) {
    storedEnergy += storageStructure.store[RESOURCE_ENERGY];
  }


  let constructionSitesCount = spawner.room.find(FIND_CONSTRUCTION_SITES).length;

  if (constructionSitesCount > 0) {
    if (storedEnergy > 2000)
      creepQuotasForRoom.builder = Math.min(Math.max(Math.floor(constructionSitesCount / 4), 2), 4);
    else
      creepQuotasForRoom.builder = 1;
  }

  if (storedEnergy > 4000) {
    creepQuotasForRoom.upgrader = 2;
    if (spawner.room.controller.level === 8)
      creepQuotasForRoom.upgrader = 1;
  }

  for (const creep of spawner.room.find(FIND_MY_CREEPS)) {
    countsForThisRoom[creep.memory.role]++;
    countsForThisRoom.total++;
  }
  const roomMax = spawner.room.energyCapacityAvailable;

  for (const [role, count] of Object.entries(creepQuotasForRoom)) {
    if (countsForThisRoom[role] >= count)
      continue;
    const typeToBuild = creepTypesForThisRoom[role];
    if (!typeToBuild)
      continue;
    const costOfBody = bodyCost(typeToBuild.body);
    if (costOfBody > roomMax) {
      console.log(`Trying to save for ${typeToBuild.memory.role}, but bodyCost: ${costOfBody} is more than roomMax: ${roomMax} in ${spawner.room.name}.`);
      if(countsForThisRoom['basic'] < 5) {
        spawnType(spawner, creepTypesForThisRoom.basic);
        return;
      }
      continue;
    }
    if (costOfBody > currentEnergy) {
      spawner.memory.saving = true;
      break;
    }
    const roomSpawners = spawner.room.find(FIND_STRUCTURES, { filter: struc => struc.structureType === STRUCTURE_SPAWN && struc.id !== spawner.id });

    if (roomSpawners.some(spawn => spawn.spawning && spawn.spawning.name.includes(role))) {
      console.log(`${spawner.name} will not spawn a ${role} because one is already in progress from the other spawn.`);
      continue;
    }
    spawnType(spawner, typeToBuild);
    return;
  }

  if (countsForThisRoom.total < 5 && currentEnergy >= bodyCost(creepTypesForThisRoom.basic.body)) {
    // Game.notify(`Uh oh we are making basic creeps at ${currentTimeString()} in ${spawner.room.name}`, 120);
    // console.log('Sending Email!');
    spawner.memory.saving = false;
    spawnType(spawner, creepTypesForThisRoom.basic);
  }
}

module.exports = { runSpawn };
