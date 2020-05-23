const { findExtensionsWithFreeSpace } = require('./findExtensionsWithFreeSpace');
const { findTerminalWithLessThan15kEnergy } = require('./findTerminalWithLessThan15kEnergy');
const { findMySpawnsWithFreeSpace } = require('./findMySpawnsWithFreeSpace');
const { findStorageWithFreeSpace } = require('./findStorageWithFreeSpace');
const { findTowersWithFreeSpace } = require('./findTowersWithFreeSpace');

function findTransferTargets(creep) {
  let targets = [];
  targets.push(...findTowersWithFreeSpace(creep.room));
  targets.push(...findExtensionsWithFreeSpace(creep.room));
  targets.push(...findMySpawnsWithFreeSpace(creep.room));
  targets.push(...findTerminalWithLessThan15kEnergy(creep.room));
  // causes problem with pickup and immediatly transfer back
  //targets.push(...findStorageWithFreeSpace(creep));

  return targets;
}

module.exports = { findTransferTargets };
