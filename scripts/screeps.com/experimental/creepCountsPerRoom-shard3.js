const defaultCounts = {
  defender: 0,
  heavyHarvester: 2,
  carrier: 2,
  attacker: 0,
  builder: 1,
  repairer: 1,
  upgrader: 2,
  remoteHarvester: 0,
  remoteCarrier: 0,
};

const creepCountsPerRoom = {
  E5S31: defaultCounts,
  E9S32: defaultCounts,
};

module.exports = { creepCountsPerRoom };
