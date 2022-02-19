const { moveIgnore } = require('./moveIgnore');
const { changeActivity } = require('./changeActivity');
const { isAlly } = require('./isAlly');

function posOnEdge(pos){
  const { x, y } = pos;

  return x === 0 || x === 49 || y === 0 || y === 49;
}

function creepOnEdge(creep) {
  return posOnEdge(creep.pos)
}

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
    let safeX = x;
    let safeY = y;
    if(safeX === 0)
      safeX = 1;
    if(safeX === 49)
      safeX = 48;
    if(safeY === 0)
      safeY = 1;
    if(safeY === 49)
      safeY = 48;
    rallyTarget = new RoomPosition(safeX, safeY, roomName);
    if (creep.pos.roomName === roomName && !creepOnEdge(creep)) {
      // creep.move(25, 25);
      console.log(creep.name, 'has arrived at destination room', creep.room.name);
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
