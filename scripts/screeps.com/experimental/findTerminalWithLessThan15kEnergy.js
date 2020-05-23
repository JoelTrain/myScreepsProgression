function findTerminalWithLessThan15kEnergy(room) {
  const structures = room.find(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_TERMINAL && object.store.getUsedCapacity(RESOURCE_ENERGY) < 15000;
    }
  });
  return structures;
}

module.exports = { findTerminalWithLessThan15kEnergy };
