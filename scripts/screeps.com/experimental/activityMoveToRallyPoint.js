const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');
const { isAlly } = require('./isAlly');

function activityMoveToRallyPoint(creep) {
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
  const rallyTarget = Game.flags[creep.memory.rallyPoint];
  if (rallyTarget) {
    if (creep.pos.inRangeTo(rallyTarget, 0)) {
      if (creep.memory.rallyPoint2) {
        creep.memory.rallyPoint = creep.memory.rallyPoint2;
      }
      else {
        changeActivity(creep, creep.memory.whenEmpty);
        return;
      }
    }
    moveIgnore(creep, rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }



  if (!rallyTarget) {
    changeActivity(creep, creep.memory.whenEmpty);
  }
}

module.exports = { activityMoveToRallyPoint };
