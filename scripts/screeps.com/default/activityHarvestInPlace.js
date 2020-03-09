const { moveIgnore } = require('./moveIgnore');

function activityHarvestInPlace(creep) {
  if (creep === null)
    console.trace();
  const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
  if (structuresAtMyPos[0] instanceof StructureContainer && structuresAtMyPos[0].store.getFreeCapacity() > 0) {
    const harvestTarget = creep.pos.findInRange(FIND_SOURCES, 1)[0];
    if (harvestTarget) {
      creep.harvest(harvestTarget);
      return;
    }
  }

  const spot = creep.pos.findClosestByRange(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_CONTAINER && object.pos.lookFor(LOOK_CREEPS).length === 0;
    }
  });

  if (spot) {
    moveIgnore(creep, spot);
    return;
  }
  const source = creep.pos.findClosestByPath(FIND_SOURCES);
  if (creep.pos.inRangeTo(source, 1)) {
    creep.harvest(source);
    return;
  }
  moveIgnore(creep, source, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
}

module.exports = { activityHarvestInPlace };
