const defaultCounts = {
  heavyHarvester: 2,
  builder: 3,
  repairer: 1,
  carrier: 2,
  upgrader: 4,
};

const creepCountsPerRoom = {
  E5S31: defaultCounts,
  E9S32: defaultCounts,
};

module.exports = { creepCountsPerRoom };
