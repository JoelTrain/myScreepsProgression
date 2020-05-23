function findStorageWithFreeSpace(room) {
  const storage = room.find(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_STORAGE && object.store.getFreeCapacity() > 0;
    }
  });
  return storage;
}

module.exports = { findStorageWithFreeSpace };
