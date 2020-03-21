function findExtensionsWithFreeSpace(creep) {
  return creep.room.find(FIND_MY_STRUCTURES, {
    filter: structure => structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0
  });
}

module.exports = { findExtensionsWithFreeSpace };
