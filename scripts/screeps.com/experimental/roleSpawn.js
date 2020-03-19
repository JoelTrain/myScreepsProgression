const { creepTypesPerRoom } = require('./creepTypesPerRoom');
const { creepCountsPerRoom } = require('./creepCountsPerRoom');
const { spawnType } = require('./spawnType');
const { bodyCost } = require('./bodyCost');

const attackingCreepCount = _.reduce(Game.creeps, (accum, creep) => {
  if (creep.memory.rallyPoint === 'AttackMove')
    return accum + 1;
  else
    return accum;
}, 0);

function runSpawn(spawner) {
  const creepsInRoom = spawner.room.find(FIND_MY_CREEPS);
  for (const creep of creepsInRoom) {
    if (creep.pos.inRangeTo(spawner, 1)) {
      if (creep.ticksToLive === 1495 && (creep.memory.role === 'defender' || creep.memory.role === 'attacker'))
        spawner.recycleCreep(creep);
      else if (creep.ticksToLive < 1400)
        spawner.renewCreep(creep);
    }
  }

  if (spawner.spawning)
    return;

  const currentEnergy = spawner.room.energyAvailable;

  if (currentEnergy < 200)
    return;

  let creepCountsForThisRoom;
  if (creepCountsPerRoom[spawner.room.name])
    creepCountsForThisRoom = { ...creepCountsPerRoom[spawner.room.name] };
  else
    creepCountsForThisRoom = { ...creepCountsPerRoom.default };

  const numSources = spawner.room.find(FIND_SOURCES).length;
  creepCountsForThisRoom.heavyHarvester = numSources;

  const enemiesInRoomCount = spawner.room.find(FIND_HOSTILE_CREEPS, {
    filter: function (object) {
      return object.getActiveBodyparts(HEAL) + object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
    }
  }).length;

  if (enemiesInRoomCount)
    creepCountsForThisRoom.defender = enemiesInRoomCount;

  const attackMoveFlag = Game.flags['AttackMove'];
  console.log(attackingCreepCount);
  if (attackMoveFlag && attackingCreepCount < 10 && Game.map.getRoomLinearDistance(attackMoveFlag.pos.roomName, spawner.room.name, true) < 10)
    creepCountsForThisRoom.attacker = 2;

  let creepTypesForThisRoom = creepTypesPerRoom[spawner.room.name];
  if (!creepTypesForThisRoom)
    creepTypesForThisRoom = creepTypes;

  const typeVals = Object.values(creepTypesForThisRoom);
  if (typeVals.length < 1)
    return;

  const countsForThisRoom = { total: 0 };
  for (const typeKey of Object.keys(creepTypesForThisRoom)) {
    countsForThisRoom[typeKey] = 0;
  }

  for (const creep of spawner.room.find(FIND_MY_CREEPS)) {
    countsForThisRoom[creep.memory.role]++;
    countsForThisRoom.total++;
  }
  const roomMax = spawner.room.energyCapacityAvailable;

  for (const [role, count] of Object.entries(creepCountsForThisRoom)) {
    if (countsForThisRoom[role] >= count)
      continue;
    const typeToBuild = creepTypesForThisRoom[role];
    const costOfBody = bodyCost(typeToBuild.body);
    if (costOfBody > roomMax && countsForThisRoom['basic'] < 10)
      spawnType(spawner, creepTypesForThisRoom.basic);
    if (costOfBody > currentEnergy)
      break;
    spawnType(spawner, typeToBuild);
    return;
  }

  if (countsForThisRoom.total < 5 && currentEnergy >= bodyCost(creepTypesForThisRoom.basic.body)) {
    Game.notify(`Uh oh we are making basic creeps at ${currentTimeString()} in ${spawner.room.name}`, 120);
    console.log('Sending Email!');
    spawnType(spawner, creepTypesForThisRoom.basic);
  }
}

module.exports = { runSpawn };
