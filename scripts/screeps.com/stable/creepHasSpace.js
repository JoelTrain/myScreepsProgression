function creepHasSpace(creep) {
  return creep.store.getFreeCapacity() > 0;
}

module.exports = { creepHasSpace };
