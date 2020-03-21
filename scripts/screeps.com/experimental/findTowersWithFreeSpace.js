function findTowersWithFreeSpace(creep) {
  return creep.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_TOWER && structure.store.getFreeCapacity() > 0 });
}

module.exports = { findTowersWithFreeSpace };
