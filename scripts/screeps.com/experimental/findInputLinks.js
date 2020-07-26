function findInputLinks(room) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_LINK
        && object.store.getFreeCapacity(RESOURCE_ENERGY) > 200
        && object.room.memory.accumulatorId != object.id;
    }
  });
  return structures;
}

module.exports = { findInputLinks };
