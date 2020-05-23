function findStructuresWithFreeSpace(room, structure_type) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === structure_type && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return structures;
}

module.exports = { findStructuresWithFreeSpace };
