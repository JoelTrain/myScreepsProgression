const profiler = require('screeps-profiler');

function creepOnEdge(creep) {
  const { x, y } = creep.pos;

  return x === 0 || x === 49 || y === 0 || y === 49;
}

function moveIgnore(creep, target, opts) {
  if (creep.spawning)
    return;

  if (!target)
    return;

  let targetPos;
  if (target instanceof RoomPosition)
    targetPos = target;
  else if (target.pos && target.pos instanceof RoomPosition)
    targetPos = target.pos;
  else
    throw Error('passed bad position');

  if (opts === undefined)
    opts = {};
  if (opts.visualizePathStyle === undefined)
    opts.visualizePathStyle = {};
  if (opts.maxOps === undefined)
    opts.maxOps = 1000;
  opts.ignoreCreeps = true;
  opts.maxRooms = 1;

  if (creepOnEdge(creep)) {
    delete creep.memory._move;
    //console.log(creep.name, 'on edge', creep.room.name);
    creep.moveTo(25, 25);
    return;
  }

  if (creep.room.name !== targetPos.roomName) {
    delete opts.maxRoom;
    const exit = creep.room.findExitTo(targetPos.roomName);
    if (exit > 0) {
      const exitPos = creep.pos.findClosestByRange(exit);
      if (exitPos)
        targetPos = exitPos;
    }
    else
      console.log('ERROR: pathfind', creep.name, creep.pos.roomName, targetPos.roomName, exit);
  }

  let failedToMove = false;
  let moveResult;
  moveResult = creep.moveTo(targetPos, opts);
  failedToMove = moveResult === ERR_NO_PATH;

  if (!failedToMove) {
    if (creep.memory._move) {
      if (targetPos.x === creep.memory._move.dest.x && targetPos.y === creep.memory._move.dest.y) {
        const lastPos = creep.memory.lastPos;
        const lastFatigue = creep.memory.lastFatigue;
        if (lastPos !== undefined && lastFatigue !== undefined) {
          const { x, y } = lastPos;
          if (x === creep.pos.x && y === creep.pos.y && creep.memory.lastFatigue === creep.fatigue && creep.fatigue === 0) {
            failedToMove = true;
          }
        }
      }
    }
  }
  creep.memory.lastPos = { x, y, roomName } = creep.pos;
  creep.memory.lastFatigue = creep.fatigue;

  if (failedToMove) {
    //console.log(`${creep.name} is not moving since ${creep.pos}`);
    //creep.say('stuck!');
    delete creep.memory._move;
    return creep.moveTo(targetPos, { maxOps: 1000, ignoreCreeps: false, reusePath: 15, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

// Be sure to reassign the function, we can't alter functions that are passed.
moveIgnore = profiler.registerFN(moveIgnore);

module.exports = { moveIgnore };
