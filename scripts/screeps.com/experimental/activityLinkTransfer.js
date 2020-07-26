function activityLinkTransfer(link) {
  if (link.cooldown > 0)
    return;

  const accumulatorId = link.room.memory.accumulatorId;

  if (accumulatorId === undefined)
    return;

  const targetLink = Game.getObjectById(accumulatorId);
  if (targetLink === undefined)
    return;

  if (!(targetLink instanceof StructureLink))
    return;

  if (targetLink.store.getFreeCapacity(RESOURCE_ENERGY) < link.store[RESOURCE_ENERGY])
    return;

  link.transferEnergy(targetLink);
}

module.exports = { activityLinkTransfer };
