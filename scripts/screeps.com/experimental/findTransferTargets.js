const { findExtensionsWithFreeSpace } = require('./findExtensionsWithFreeSpace');
const { findMySpawnsWithFreeSpace } = require('./findMySpawnsWithFreeSpace');
const { findStorageWithFreeSpace } = require('./findStorageWithFreeSpace');
const { findTowersWithFreeSpace } = require('./findTowersWithFreeSpace');

function findTransferTargets(creep) {
  let targets = [];
  if (!targets.length)
    targets = findTowersWithFreeSpace(creep);
  if (!targets.length)
    targets = findExtensionsWithFreeSpace(creep);
  targets.push(...findMySpawnsWithFreeSpace(creep));
  if (!targets.length)
    targets = findStorageWithFreeSpace(creep);

  return targets;
}

module.exports = { findTransferTargets };
