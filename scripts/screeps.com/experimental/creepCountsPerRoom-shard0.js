const defaultCounts = {
  defender: 0,
  heavyHarvester: 0,
  carrier: 0,
  attacker: 0,
  builder: 0,
  repairer: 0,
  upgrader: 0,
  remoteHarvester: 0,
  remoteCarrier: 0,
  claimer: 0,
};

const creepCountsPerRoom = {
  E5S31: defaultCounts,
  E9S32: defaultCounts,
};

module.exports = { creepCountsPerRoom };
