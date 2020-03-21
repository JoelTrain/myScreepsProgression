const { moveIgnore } = require('./moveIgnore');

function countHeavyHarvestersAlreadyBy(source) {
  let nearby = 0;
  for (const creep of source.room.find(FIND_MY_CREEPS)) {
    if (creep.memory.role !== 'heavyHarvester')
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
  if (structuresAtMyPos[0] instanceof StructureContainer && structuresAtMyPos[0].store.getFreeCapacity() > 0) {
    let harvestTarget = creep.pos.findInRange(FIND_SOURCES, 1)[0];
    if (!harvestTarget)
      harvestTarget = creep.pos.findInRange(FIND_DEPOSITS, 1)[0];
    if (!harvestTarget)
      harvestTarget = creep.pos.findInRange(FIND_MINERALS, 1)[0];
    if (harvestTarget) {
      if (!creep.memory.arrivalTicksToLive)
        creep.memory.arrivalTicksToLive = creep.ticksToLive;
      creep.harvest(harvestTarget);
      return;
    }
  }

  const spot = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_CONTAINER && object.pos.lookFor(LOOK_CREEPS).length === 0 && object.store.getFreeCapacity() > 200;
    }
  });

  if (spot) {
    moveIgnore(creep, spot);
    return;
  }

  let source = creep.pos.findClosestByRange(FIND_SOURCES);
  if (source) {
    if (creep.pos.inRangeTo(source, 1)) {
      if (!creep.memory.arrivalTicksToLive)
        creep.memory.arrivalTicksToLive = creep.ticksToLive;
      creep.harvest(source);
      return;
    }
  }

  source = creep.pos.findClosestByPath(FIND_SOURCES, {
    filter: function (object) {
      return countHeavyHarvestersAlreadyBy(object) < 1;
    }
  });
  if (!source)
    return;
  if (creep.pos.inRangeTo(source, 1)) {
    if (!creep.memory.arrivalTicksToLive)
      creep.memory.arrivalTicksToLive = creep.ticksToLive;
    creep.harvest(source);
    return;
  }
  moveIgnore(creep, source, { reusePath: 15, visualizePathStyle: { stroke: 'yellow' } });
}

module.exports = { activityHarvestInPlace };
