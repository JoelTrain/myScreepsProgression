function creepHasResources(creep) {
  // transfer all resources
  for (const resourceType in creep.store) {
    if (resourceType === RESOURCE_ENERGY)
      continue;
    if (creep.store[resourceType] > 0)
      return true;
  }
  return false;
}

module.exports = { creepHasResources };
