const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');

function activityMoveToRallyPoint(creep) {
  const rallyTarget = Game.flags[creep.memory.rallyPoint];
  if (rallyTarget) {
    moveIgnore(creep, rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }
  if (creep.pos.inRangeTo(rallyTarget, 5)) {
    changeActivity(creep, creep.memory.whenEmpty);
  }
}

module.exports = { activityMoveToRallyPoint };
