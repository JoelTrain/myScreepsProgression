const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');
const { isAlly } = require('./isAlly');

function activityMoveToTarget(creep) {
  if (creep.getActiveBodyparts(HEAL)) {
    creep.heal(creep);

    let healingAnAlly = false;
    const friendly = creep.pos.findClosestByRange(FIND_CREEPS, {
      filter: function (object) {
        return isAlly(object) && object.hits < object.hitsMax;
      }
    });
    if (friendly) {
      if (creep.pos.isNearTo(friendly)) {
        creep.heal(friendly);
        healingAnAlly = true;
      }
      else if (creep.pos.inRangeTo(friendly, 3)) {
        creep.rangedHeal(friendly);
        healingAnAlly = true;
      }
    }
  }
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
