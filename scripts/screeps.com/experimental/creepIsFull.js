function creepIsFull(creep) {
  return creep.store.getFreeCapacity() === 0 && !creep.memory.changedActivity;
}

module.exports = { creepIsFull };
