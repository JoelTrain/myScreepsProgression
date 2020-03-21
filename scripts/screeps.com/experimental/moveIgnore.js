function moveIgnore(creep, target, opts) {
  if (creep.spawning)
    return;

  if (!target)
    return;

  let targetPos;
  if (target instanceof RoomPosition)
    targetPos = target;
  else if (target.pos)
    targetPos = target.pos;
  else if (target.x !== undefined && target.y !== undefined && target.roomName !== undefined) {
    targetPos = new RoomPosition(target.x, target.y, target.roomName);
  }

  if (opts === undefined)
    opts = {};
  if (opts.visualizePathStyle === undefined)
    opts.visualizePathStyle = {};
  if (opts.maxOps === undefined)
    opts.maxOps = 1000;
  opts.ignoreCreeps = true;

  if (creep.room.name !== targetPos.roomName) {
    const exit = Game.map.findExit(creep.room.name, targetPos.roomName);
    if (exit >= 0) {
      const exitPos = creep.pos.findClosestByRange(exit);
      if (exitPos)
        targetPos = exitPos;
    }
    else
      console.log('ERROR: pathfind', creep.name, creep.pos.roomName, targetPos.roomName, exit);
  }

  let moveResult = creep.moveTo(targetPos, { noPathFinding: true, reusePath: 15, visualizePathStyle: { stroke: 'orange' } });
  if (moveResult === ERR_NOT_FOUND)
    moveResult = creep.moveTo(targetPos, opts);

  let failedToMove = false;
  if (!failedToMove)
    failedToMove = moveResult === ERR_NO_PATH;

  if (!failedToMove) {
    if (creep.memory._move) {
      if (targetPos.x === creep.memory._move.dest.x && targetPos.y === creep.memory._move.dest.y) {
        const lastPos = creep.memory.lastPos;
        const lastFatigue = creep.memory.lastFatigue;
        if (lastPos !== undefined && lastFatigue !== undefined) {
          const { x, y } = creep.memory.lastPos;
          if (x === creep.pos.x && y === creep.pos.y && creep.memory.lastFatigue === creep.fatigue && creep.fatigue === 0) {
            failedToMove = true;
          }
        }
      }
    }
  }
  creep.memory.lastPos = creep.pos;
  creep.memory.lastFatigue = creep.fatigue;

  if (failedToMove) {
    //console.log(`${creep.name} is not moving since ${creep.pos}`);
    //creep.say('stuck!');
    delete creep.memory._move;
    return creep.moveTo(targetPos, { maxOps: 1000, ignoreCreeps: false, reusePath: 15, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

module.exports = { moveIgnore };
