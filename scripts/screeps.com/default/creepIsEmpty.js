function creepIsEmpty(creep) {
  return creep.store.getUsedCapacity() === 0;
}

module.exports = { creepIsEmpty };
