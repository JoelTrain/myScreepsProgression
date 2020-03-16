const { findExtensionsWithFreeSpace } = require('./findExtensionsWithFreeSpace');
const { findMySpawnsWithFreeSpace } = require('./findMySpawnsWithFreeSpace');
const { findStorageWithFreeSpace } = require('./findStorageWithFreeSpace');

function findTransferTargets(creep) {
  let targets = [];
  if (!targets.length)
    targets = findExtensionsWithFreeSpace(creep);
  if (!targets.length)
    targets = findMySpawnsWithFreeSpace(creep);
  if (!targets.length)
    targets = findStorageWithFreeSpace(creep);

  return targets;
}

module.exports = { findTransferTargets };
