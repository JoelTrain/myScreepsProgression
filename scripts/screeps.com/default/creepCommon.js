function creepIsEmpty(creep) {
  return creep.store.getUsedCapacity() === 0;
}

function creepHasSpace(creep) {
  return creep.store.getFreeCapacity() > 0;
}

function creepIsFull(creep) {
  return creep.store.getFreeCapacity() === 0;
}

function clearTarget(creep) {
  delete creep.memory.targetId;
}

function bodyCost(body) {
  return body.reduce(function (cost, part) {
    return cost + BODYPART_COST[part];
  }, 0);
}

module.exports = {
  creepIsEmpty,
  creepHasSpace,
  creepIsFull,
  clearTarget,
  bodyCost,
};
