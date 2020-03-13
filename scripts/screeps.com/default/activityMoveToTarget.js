const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');

function activityMoveToTarget(creep) {
  const rallyTarget = creep.memory.targetPos;
  if (rallyTarget) {
    if (creep.pos.inRangeTo(rallyTarget, 1)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }
    moveIgnore(creep, { pos: rallyTarget }, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }
  else {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }
}

module.exports = { activityMoveToTarget };
