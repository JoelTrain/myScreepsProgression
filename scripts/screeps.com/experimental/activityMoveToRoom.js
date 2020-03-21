const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');
const { isAlly } = require('./isAlly');

function activityMoveToRoom(creep) {
  if (creep.getActiveBodyparts(HEAL)) {
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
  const rallyTarget = creep.memory.targetPos;
  if (rallyTarget) {
    const { roomName, x, y } = rallyTarget;
    const roomPosition = new RoomPosition(x, y, roomName);
    if (creep.pos.roomName === roomName) {
      if (creep.memory.whenArrive)
        changeActivity(creep, creep.memory.whenArrive);
      else
        changeActivity(creep, creep.memory.whenEmpty);
      return;
    }
    moveIgnore(creep, { pos: roomPosition }, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
  }
  else {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }
}

module.exports = { activityMoveToRoom };
