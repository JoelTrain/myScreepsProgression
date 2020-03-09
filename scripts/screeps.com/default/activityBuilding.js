const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { clearTarget } = require('./clearTarget');
const { changeActivity } = require('./changeActivity');

function activityBuilding(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  let target = Game.getObjectById(creep.memory.targetId);
  if (!target) {
    target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  }
  if (!target) {
    clearTarget(creep);
    changeActivity(creep, 'upgrading controller');
    return;
  }

  creep.memory.targetId = target.id;

  if (creep.pos.inRangeTo(target, 3)) {
    const buildResult = creep.build(target);
    if (buildResult !== OK) {
      changeActivity(creep, 'upgrading controller');
    }
    return;
  }

  moveIgnore(creep, target);
  return;
}

module.exports = { activityBuilding };
