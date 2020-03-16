const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');

function activityMoveToRallyPoint(creep) {
  const rallyTarget = Game.flags[creep.memory.rallyPoint];
  if (rallyTarget) {
    if (creep.pos.inRangeTo(rallyTarget, 5)) {
      if (creep.memory.rallyPoint2) {
        const nextStep = Game.flags[creep.memory.rallyPoint2];
        if (nextStep) {
          creep.memory.targetPos = nextStep.pos;
          changeActivity(creep, 'move to position');
        }
      }
      else {
        changeActivity(creep, creep.memory.whenEmpty);
        return;
      }
    }
    moveIgnore(creep, rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }
  else {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }
}

module.exports = { activityMoveToRallyPoint };
