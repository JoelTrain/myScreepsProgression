const { harvestLocations } = require('./harvestLocations');
const { getHubRooms } = require('./getHubRooms');
const { spawnType } = require('./spawnType');

const remoteHarvesterType = {
  body: [MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK],
  memory: {
    role: 'remoteHarvester',
    activity: 'move to position',
    whenFull: 'harvest in place',
    whenEmpty: 'harvest in place',
    whenArrive: 'harvest in place',
    targetPos: {
      roomName: undefined,
      x: undefined,
      y: undefined,
    },
  },
};

const remoteCarrierType = {
  body: new Array(50).fill(MOVE, 0, 25).fill(CARRY, 25),
  memory: {
    role: 'remoteCarrier',
    activity: 'return to pickup',
    whenFull: 'return to dropoff',
    whenEmpty: 'return to pickup',
    whenArrive: 'pickup',
    targetPos: {
      roomName: undefined,
      x: undefined,
      y: undefined,
    },
    dropoffPos: {
      roomName: undefined,
      x: undefined,
      y: undefined,
    },
    pickupPos: {
      roomName: undefined,
      x: undefined,
      y: undefined,
    },
  },
};

function arePositionsEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName;
}

global.arePositionsEqual = arePositionsEqual;

function reservePosByCreep(pos, creep) {
  // stamp the creep name on the position to reserve it
  pos.creepWorkingSite = creep.name;
}

function reservePosByCarrierCreep(pos, creep) {
  // stamp the creep name on the position to reserve it
  pos.creepsCarryingSite.push(creep.name);
}

function getAllRemoteCarriers() {
  const remoteCarriers = [];

  for (const creep of Object.values(Game.creeps)) {
    if (creep.memory.role === 'remoteCarrier')
      remoteCarriers.push(creep);
  }

  return remoteCarriers;
}

function getAllRemoteHarvesters() {
  const remoteHarvesters = [];

  for (const creep of Object.values(Game.creeps)) {
    if (creep.memory.role === 'remoteHarvester')
      remoteHarvesters.push(creep);
  }

  return remoteHarvesters;
}

function getWorkingRemoteHarvestersFromList(remoteHarvesters) {
  return remoteHarvesters.filter((creep) => creep.memory.targetPos !== undefined);
}

function spawnRemoteHarvesterInRoomForPos(room, pos) {
  // should be spawning next tick and needs to be assigned

  const type = { ...remoteHarvesterType };
  type.memory = { ...remoteHarvesterType.memory };
  type.memory.targetPos = pos;

  const spawns = room.find(FIND_MY_SPAWNS);
  for (const spawner of spawns) {
    if (!spawner.spawning && room.energyAvailable >= bodyCost(type.body)) {
      console.log(`trying to spawn remote harvester for ${pos.roomName}, ${pos.x},${pos.y}`);
      spawnType(spawner, type);
      return true;
    }
  }

  return false;
}

function spawnRemoteCarrierInRoomForPos(room, pos) {
  // should be spawning next tick and needs to be assigned

  const type = { ...remoteCarrierType };
  type.memory = { ...remoteCarrierType.memory };
  type.memory.targetPos = pos;
  type.memory.pickupPos = pos;
  type.memory.dropoffPos = room.controller.pos;

  const spawns = room.find(FIND_MY_SPAWNS);
  for (const spawner of spawns) {
    if (!spawner.spawning && room.energyAvailable >= bodyCost(type.body)) {
      console.log(`trying to spawn remote carrier for ${pos.roomName}, ${pos.x},${pos.y}`);
      spawnType(spawner, type);
      return true;
    }
  }

  return false;
}

function assignRemoteHarvesters() {
  const hubRooms = getHubRooms();
  if (hubRooms.length === 0)
    return;

  const remoteCarriers = getAllRemoteCarriers();
  const remoteHarvesters = getAllRemoteHarvesters();
  const workingHarvesters = getWorkingRemoteHarvestersFromList(remoteHarvesters);

  for (const hubRoomName of hubRooms) {
    const roomPositions = harvestLocations[hubRoomName];
    if (roomPositions === undefined || roomPositions.length === 0)
      continue;

    let spawning = false;
    for (const roomPos of roomPositions) {
      if (spawning)
        break;

      if (!Game.map.getRoomStatus(roomPos.roomName).status == 'normal')
        continue;

      const creepWorkingAtPos = workingHarvesters.find((creep) => {
        let travelTime = 0;

        if (creep && creep.memory.arrivalTicksToLive)
          travelTime = 1500 - creep.memory.arrivalTicksToLive;

        return (creep.spawning || creep.ticksToLive > travelTime) && arePositionsEqual(creep.memory.targetPos, roomPos);

      });

      if (creepWorkingAtPos)
        reservePosByCreep(roomPos, creepWorkingAtPos);
      else
        spawning = spawnRemoteHarvesterInRoomForPos(Game.rooms[hubRoomName], roomPos);

      if (spawning)
        break;

      const creepsCarryingFromSite = remoteCarriers.reduce((acc, creep) => {
        if (arePositionsEqual(creep.memory.pickupPos, roomPos))
          return acc + 1;
        else
          return acc;
      }, 0);

      let numCarriers = Game.map.getRoomLinearDistance(hubRoomName, roomPos.roomName) * 1;
      if (creepWorkingAtPos && creepWorkingAtPos.pos.isNearTo(new RoomPosition(roomPos.x, roomPos.y, roomPos.roomName))) {
        if (creepWorkingAtPos.pos.findInRange(FIND_DEPOSITS, 1).length)
          numCarriers = 1;
      }

      console.log('remote carrier', hubRoomName, '->', roomPos.roomName, creepsCarryingFromSite, '/', numCarriers);
      if (creepsCarryingFromSite < numCarriers) {
        spawning = spawnRemoteCarrierInRoomForPos(Game.rooms[hubRoomName], roomPos);
        break;
      }
    }
  }
}

module.exports = { assignRemoteHarvesters };
