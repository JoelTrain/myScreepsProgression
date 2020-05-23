function findStructuresWithFreeSpace(room, structure_types, onlyMine = true) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: function (object) {
      if (onlyMine && !object.my)
        return false;

      const { structureType, store } = object;
      return structure_types.includes(structureType) && store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return structures;
}

module.exports = { findStructuresWithFreeSpace };
