//const profiler = require('screeps-profiler');

function posOnEdge(pos){
  const { x, y } = pos;

  return x === 0 || x === 49 || y === 0 || y === 49;
}

function creepOnEdge(creep) {
  return posOnEdge(creep.pos)
}

function getMoveDir(creep){
  const { x, y } = creep.pos;

  if(x == 0)
    return RIGHT;
  if(x == 49)
    return LEFT;
  if(y == 0)
    return BOTTOM;
  if(y == 49)
    return TOP;

  return TOP_LEFT;
}

function edgeCost(roomName, costMatrix) {
  const costs = costMatrix.clone();
  for(let i = 0; i < 50; i++){
    costs.set(i, 0, 10);
    costs.set(i, 1, 5);
    costs.set(i, 48, 5);
    costs.set(i, 49, 10);
    costs.set(0, i, 10);
    costs.set(1, i, 5);
    costs.set(48, i, 5);
    costs.set(49, i, 10);
  }

  return costs;
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
    opts.maxOps = 800;
  if (opts.ignoreCreeps === undefined)
    opts.ignoreCreeps = true;
  if (opts.reusePath === undefined)
    opts.reusePath = 20;
  if (opts.costCallback === undefined)
    opts.costCallback = edgeCost;

  const originalMaxRooms = opts.maxRooms;
  if (opts.maxRooms === undefined)
    opts.maxRooms = 1;

  if (creepOnEdge(creep)) {
    delete creep.memory._move;
    console.log(creep.name, 'on edge', creep.room.name);
    creep.move(getMoveDir(creep));
    // creep.moveTo(25, 25, { costCallback: edgeCost });
    return;
  }

  if (creep.room.name !== targetPos.roomName) {
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
    // creep.say('stuck!');
    let maxRoomsy = 16;
    if (originalMaxRooms !== undefined)
      maxRoomsy = originalMaxRooms;

    delete creep.memory._move;
    return creep.moveTo(targetPos, { maxOps: 1000, maxRooms: maxRoomsy, ignoreCreeps: false, reusePath: 30, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

// Be sure to reassign the function, we can't alter functions that are passed.
//moveIgnore = profiler.registerFN(moveIgnore);

module.exports = { moveIgnore };
