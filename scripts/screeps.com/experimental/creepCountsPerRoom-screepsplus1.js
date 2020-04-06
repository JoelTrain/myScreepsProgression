const defaultCounts = {
  defender: 0,
  heavyHarvester: 0,
  carrier: 0,
  attacker: 0,
  builder: 0,
  repairer: 1,
  upgrader: 0,
  remoteHarvester: 0,
  remoteCarrier: 0,
  claimer: 0,
};

const creepCountsPerRoom = {
  E3S1: defaultCounts,
};

module.exports = { creepCountsPerRoom };
