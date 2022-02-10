const defaultCounts = {
  defender: 0,
  harvester: 2,
  heavyHarvester: 2,
  carrier: 3,
  attacker: 0,
  builder: 1,
  repairer: 1,
  upgrader: 1,
  remoteHarvester: 0,
  remoteCarrier: 0,
  claimer: 0,
};

const creepCountsPerRoom = {
  E5S31: defaultCounts,
  E9S32: defaultCounts,
  E12S42: defaultCounts,
};

module.exports = { creepCountsPerRoom };
