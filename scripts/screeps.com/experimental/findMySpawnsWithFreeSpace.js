function findMySpawnsWithFreeSpace(room) {
  const spawns = room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return spawns;
}

module.exports = { findMySpawnsWithFreeSpace };
