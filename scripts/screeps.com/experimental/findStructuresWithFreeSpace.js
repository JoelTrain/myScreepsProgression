function findStructuresWithFreeSpace(room, structure_type, onlyMine = true) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: function (object) {
      if (onlyMine && !object.my)
        return false;
      return object.structureType === structure_type && object.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return structures;
}

module.exports = { findStructuresWithFreeSpace };
