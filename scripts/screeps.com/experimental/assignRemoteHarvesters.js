const { harvestLocations } = require('./harvestLocations');
const { getHubRooms } = require('./getHubRooms');

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

function spawnRemoteHarvesterForPos(pos) {
  // should be spawning next tick and needs to be assigned
  console.log(`trying to spawn remote harvester for ${pos.roomName}, ${pos.x},${pos.y}`);
}

function assignRemoteHarvesterToLocation() {
  // harvester should start moving to location and the location should be reserved
}

function assignRemoteHarvesters() {
  const hubRooms = getHubRooms();
  if (hubRooms.length === 0)
    return;

  const remoteHarvesters = getAllRemoteHarvesters();
  if (remoteHarvesters.length == 0)
    return;

  const workingHarvesters = getWorkingRemoteHarvestersFromList(remoteHarvesters);

  for (const roomName of hubRooms) {
    if (!harvestLocations.roomName)
      continue;

    const roomPositions = harvestLocations[roomName];
    if (roomPositions.length === 0)
      continue;

    let spawning = false;
    for (const roomPos of roomPositions) {
      const creepWorkingAtPos = workingHarvesters.find((creep) => creep.memory.targetPos.isEqualTo(roomPos));
      if (creepWorkingTheRoom)
        reservePosByCreep(roomPos, creep);
      else {
        spawning = true;
        spawnRemoteHarvesterForPos(roomPos);
      }
    }

  }
}

module.exports = { assignRemoteHarvesters };
