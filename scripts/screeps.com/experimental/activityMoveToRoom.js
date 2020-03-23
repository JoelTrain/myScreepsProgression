const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');
const { isAlly } = require('./isAlly');

function activityMoveToRoom(creep) {
  if (creep.getActiveBodyparts(HEAL)) {
    if (creep.hits < creep.hitsMax)
      creep.heal(creep);

    const friendly = creep.pos.findClosestByRange(FIND_CREEPS, {
      filter: function (object) {
        return isAlly(object) && object.hits < object.hitsMax;
      }
    });
    if (friendly) {
      if (creep.pos.isNearTo(friendly)) {
        creep.heal(friendly);
      }
      else if (creep.pos.inRangeTo(friendly, 3)) {
        creep.rangedHeal(friendly);
      }
    }
  }
  let rallyTarget = creep.memory.targetPos;
  if (rallyTarget) {
    const { x, y, roomName } = rallyTarget;
    rallyTarget = new RoomPosition(x, y, roomName);
    if (creep.pos.roomName === roomName) {
      //creep.move(25, 25);
      //console.log(creep.name, 'has arrived at destination room', creep.room.name);
      if (creep.memory.whenArrive)
        changeActivity(creep, creep.memory.whenArrive);
      else
        changeActivity(creep, creep.memory.whenEmpty);
      return;
    }
    moveIgnore(creep, rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }
  else {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }
}

module.exports = { activityMoveToRoom };
