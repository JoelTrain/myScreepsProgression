const { findExtensionsWithFreeSpace } = require('./findExtensionsWithFreeSpace');
const { findMySpawnsWithFreeSpace } = require('./findMySpawnsWithFreeSpace');
const { findStorageWithFreeSpace } = require('./findStorageWithFreeSpace');
const { findTowersWithFreeSpace } = require('./findTowersWithFreeSpace');

function findTransferTargets(creep) {
  let targets = [];
  targets.push(...findTowersWithFreeSpace(creep));
  targets.push(...findExtensionsWithFreeSpace(creep));
  targets.push(...findMySpawnsWithFreeSpace(creep));
  // causes problem with pickup and immediatly transfer back
  //targets.push(...findStorageWithFreeSpace(creep));

  return targets;
}

module.exports = { findTransferTargets };
