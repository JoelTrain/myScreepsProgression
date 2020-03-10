const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');

function activityMoveToRallyPoint(creep) {
  const rallyTarget = Game.flags[creep.memory.rallyPoint];
  if (rallyTarget) {
      if (creep.pos.inRangeTo(rallyTarget, 5)) {
        changeActivity(creep, creep.memory.whenEmpty);
        return;
      }
    moveIgnore(creep, rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }
  else {
      creep.memory.rallyPoint = 'DefenseRallyPoint';
  }
}

module.exports = { activityMoveToRallyPoint };
