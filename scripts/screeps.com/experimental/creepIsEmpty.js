function creepIsEmpty(creep) {
  return creep.store.getUsedCapacity() === 0 && !creep.memory.changedActivity;
}

module.exports = { creepIsEmpty };
