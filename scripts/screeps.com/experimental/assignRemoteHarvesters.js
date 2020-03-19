const { harvestLocations } = require('./harvestLocations');
const { getHubRooms } = require('./getHubRooms');
const { spawnType } = require('./spawnType');

const remoteHarvesterType = {
  body: [MOVE, MOVE, MOVE, MOVE, MOVE, WORK, WORK, WORK, WORK, WORK],
  memory: {
    role: 'remoteHarvester',
    activity: 'move to position',
    whenFull: 'harvest in place',
    whenEmpty: 'harvest in place',
    targetPos: {
      roomName: undefined,
      x: undefined,
      y: undefined,
    },
  },
};

function arePositionsEqual(pos1, pos2) {
  return pos1.x === pos2.x && pos1.y === pos2.y && pos1.roomName === pos2.roomName;
}

function reservePosByCreep(pos, creep) {
  // stamp the creep name on the position to reserve it
  pos.creepWorkingSite = creep.name;
}

function updatePositionReservations() {
  // update each position and reserve it if it is being worked
}

function findUnassignedHarvestLocations() {
  // we need to spawn a remote harvester for each of these and assign them
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

function getIdleRemoteHarvestersFromList(remoteHarvesters) {
  return remoteHarvesters.filter((creep) => creep.memory.targetPos === undefined);
}

function findUnassignedRemoteHarvestersInUnownedRoom() {
  // suicide or return to nearest owned room
}

function findUnassignedRemoteHarvestersInRoom() {
  // maybe dont need this, just need a way to find out when a remote harvester is spawning
}

function spawnRemoteHarvesterInRoomForPos(room, pos) {
  // should be spawning next tick and needs to be assigned
  console.log(`trying to spawn remote harvester for ${pos.roomName}, ${pos.x},${pos.y}`);

  const type = { ...remoteHarvesterType };
  type.memory.targetPos = pos;

  const spawns = room.find(FIND_MY_SPAWNS);
  for (const spawner of spawns) {
    if (!spawner.spawning && room.energyAvailable >= bodyCost(type.body)) {
      spawnType(spawner, type);
      break;
    }
  }
}

function assignRemoteHarvesterToLocation() {
  // harvester should start moving to location and the location should be reserved
}

function assignRemoteHarvesters() {
  const hubRooms = getHubRooms();
  if (hubRooms.length === 0)
    return;

  const remoteHarvesters = getAllRemoteHarvesters();
  const workingHarvesters = getWorkingRemoteHarvestersFromList(remoteHarvesters);

  for (const roomName of hubRooms) {
    const roomPositions = harvestLocations[roomName];
    if (roomPositions === undefined || roomPositions.length === 0)
      continue;

    let spawning = false;
    for (const roomPos of roomPositions) {
      const creepWorkingAtPos = workingHarvesters.find((creep) => arePositionsEqual(creep.memory.targetPos, roomPos));
      if (creepWorkingAtPos)
        reservePosByCreep(roomPos, creepWorkingAtPos);
      else if (!spawning) {
        spawning = true;
        spawnRemoteHarvesterInRoomForPos(Game.rooms[roomName], roomPos);
      }
    }

  }
}

module.exports = { assignRemoteHarvesters };
