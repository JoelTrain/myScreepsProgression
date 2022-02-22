const { moveIgnore } = require('./moveIgnore');

function countHeavyHarvestersAlreadyBy(me, source) {
  let nearby = 0;
  for (const creep of source.room.find(FIND_MY_CREEPS)) {
    if (creep.memory.role !== 'heavyHarvester')
      continue;
    if (me.name === creep.name)
      continue;
    if (creep.pos.isNearTo(source))
      nearby++;
  }
  //console.log(source, nearby);
  return nearby;
}

function activityHarvestInPlace(creep) {
  if (creep === null) {
    console.trace();
    return;
  }
  const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
  if (structuresAtMyPos[0] && structuresAtMyPos[0].structureType === STRUCTURE_CONTAINER && structuresAtMyPos[0].store.getFreeCapacity(RESOURCE_ENERGY) > 0) {
    let harvestTarget = creep.pos.findInRange(FIND_SOURCES, 1)[0];
    if (!harvestTarget)
      harvestTarget = creep.pos.findInRange(FIND_DEPOSITS, 1)[0];
    if (!harvestTarget)
      harvestTarget = creep.pos.findInRange(FIND_MINERALS, 1, { filter: min => min.pos.lookFor(LOOK_STRUCTURES).length && min.mineralAmount > 0 })[0];
    if (harvestTarget) {
      if (!creep.memory.arrivalTicksToLive)
        creep.memory.arrivalTicksToLive = creep.ticksToLive;
      creep.harvest(harvestTarget);
      return;
    }
  }

  const containers = creep.room.find(FIND_STRUCTURES, { filter: object => object.structureType === STRUCTURE_CONTAINER });
  // console.log('total containers', containers.length);

  const containersWithoutCreepsOnTop = [];
  for(let container of containers ) {
    if(container.pos.lookFor(LOOK_CREEPS).length === 0)
      containersWithoutCreepsOnTop.push(container);
  }
  // console.log('creepless containers', containersWithoutCreepsOnTop.length);

  const freeContainersByActiveSources = [];
  for(let container of containersWithoutCreepsOnTop ) {
    if(container.pos.findInRange(FIND_SOURCES_ACTIVE, 1).length > 0)
    freeContainersByActiveSources.push(container);
  }

  const containersWithSpaceByActiveSources = [];
  for(let container of freeContainersByActiveSources ) {
    if(container.store.getFreeCapacity(RESOURCE_ENERGY) > 0)
    containersWithSpaceByActiveSources.push(container);
  }

  // console.log(creep.room.name, ':total/creepless/creepless-source-adj/csa-space', containers.length, containersWithoutCreepsOnTop.length, freeContainersByActiveSources.length, containersWithSpaceByActiveSources.length);
      // && object.store.getFreeCapacity() > 0
        // || object.pos.findInRange(FIND_DEPOSITS, 1).length
        // || object.pos.findInRange(FIND_MINERALS, 1, { filter: min => min.mineralAmount > 0 && min.pos.lookFor(LOOK_STRUCTURES).length }))});

  if (containersWithSpaceByActiveSources.length) {
    moveIgnore(creep, creep.pos.findClosestByRange(containersWithSpaceByActiveSources, { ignoreCreeps: true }));
    return;
  }

  let sourcesAndDeposits = creep.room.find(FIND_SOURCES, {
    filter: object => countHeavyHarvestersAlreadyBy(creep, object) < 1
  });
  sourcesAndDeposits.push(...creep.room.find(FIND_DEPOSITS));

  let source = creep.pos.findClosestByRange(sourcesAndDeposits);
  if (source) {
    if (creep.pos.inRangeTo(source, 1)) {
      if (!creep.memory.arrivalTicksToLive)
        creep.memory.arrivalTicksToLive = creep.ticksToLive;

      if (!source.depositType || creep.pos.findInRange(FIND_MY_CREEPS, 5, { filter: theCreep => theCreep.memory.role === 'remoteCarrier' }).length > 0)
        creep.harvest(source);
      return;
    }
  }

  if (!source)
    return;

  moveIgnore(creep, source, { reusePath: 15, visualizePathStyle: { stroke: 'yellow' } });
}

module.exports = { activityHarvestInPlace };
