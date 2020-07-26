const profiler = require('screeps-profiler');

const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');
const { isAlly } = require('./isAlly');

let activityMoveToTarget = function (creep) {
  if (creep.getActiveBodyparts(HEAL)) {
    creep.heal(creep);

    const friendlies = creep.room.findInRange(FIND_CREEPS, 3, {
      filter: object => isAlly(object) && object.hits < object.hitsMax
    });
    const friendly = creep.pos.findClosestByRange(friendlies);
    if (friendly) {
      if (creep.pos.isNearTo(friendly))
        creep.heal(friendly);
      else {
        creep.rangedHeal(friendly);
      }
    }
  }
  // const start = Game.cpu.getUsed();
  let rallyTarget = creep.memory.targetPos;
  if (rallyTarget) {
    const { x, y, roomName } = rallyTarget;
    rallyTarget = new RoomPosition(x, y, roomName);
    if (creep.pos.inRangeTo(rallyTarget, 1)) {
      if (creep.room.name !== rallyTarget.roomName)
        throw Error('in range to lies');
      if (creep.memory.whenArrive)
        changeActivity(creep, creep.memory.whenArrive);
      else
        changeActivity(creep, creep.memory.whenEmpty);
      return;
    }
    const style = creep.room.name === rallyTarget.roomName ? {} : { stroke: 'yellow' };
    moveIgnore(creep, rallyTarget, { visualizePathStyle: style });

    // const end = Game.cpu.getUsed();
    // console.log(creep.name, end - start);
  }
  else {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }
};

// Be sure to reassign the function, we can't alter functions that are passed.
activityMoveToTarget = profiler.registerFN(activityMoveToTarget);

module.exports = { activityMoveToTarget };
