const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { clearTarget } = require('./clearTarget');
const { changeActivity } = require('./changeActivity');

function activityBuilding(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  if (creep.room.find(FIND_MY_CREEPS, { filter: foundCreep => foundCreep.memory.role === 'carrier' }).length === 0) {
    console.log(creep.name);
    changeActivity(creep, 'transfer');
    return;
  }

  let target = Game.getObjectById(creep.memory.targetId);
  if (target) {
    if (!(target instanceof ConstructionSite))
      target = undefined;

    if (target && target.hits === target.hitsMax)
      target = undefined;
  }
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES, {
      filter: (structure) => {
        return structure.structureType == STRUCTURE_EXTENSION;
      }
    });
  }
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  }
  if (!target) {
    changeActivity(creep, 'repair');
    return;
  }

  creep.memory.targetId = target.id;

  if (creep.pos.inRangeTo(target, 3)) {
    const buildResult = creep.build(target);
    if (buildResult !== OK) {
      clearTarget(creep);
      changeActivity(creep, 'repair');
    }
    return;
  }

  moveIgnore(creep, target);
  return;
}

module.exports = { activityBuilding };
