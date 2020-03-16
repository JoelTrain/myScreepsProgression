function creepIsFull(creep) {
  return creep.store.getFreeCapacity() === 0;
}

module.exports = { creepIsFull };
