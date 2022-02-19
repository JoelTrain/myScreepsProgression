const defaultCounts = {
  defender: 0,
  harvester: 0,
  heavyHarvester: 2,
  carrier: 4,
  attacker: 0,
  builder: 0,
  repairer: 1,
  upgrader: 1,
  remoteHarvester: 0,
  remoteCarrier: 0,
  claimer: 0,
};

const roomCounts = {
  E12S42: defaultCounts,
};

function creepCountsPerRoom(roomName) {
  let counts = roomCounts[roomName];

  // no counts defined for this room. Using shard default.
  if(counts === undefined){
    return defaultCounts;
  }
};

module.exports = { creepCountsPerRoom };
