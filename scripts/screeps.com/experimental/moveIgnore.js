function moveIgnore(creep, target, opts) {
  if (creep.spawning)
    return;

  if (!target)
    return;

  if (opts === undefined)
    opts = {};
  if (opts.visualizePathStyle === undefined)
    opts.visualizePathStyle = {};
  if (opts.maxOps === undefined)
    opts.maxOps = 1000;
  opts.ignoreCreeps = true;
  const moveResult = creep.moveTo(target, opts);

  let failedToMove = false;
  if (!failedToMove)
    failedToMove = moveResult === ERR_NO_PATH;

  if (!failedToMove) {
    if (creep.memory._move) {
      let targetX;
      let targetY;
      if (target instanceof RoomPosition) {
        targetX = target.x;
        targetY = target.y;
      }
      else {
        targetX = target.pos.x;
        targetY = target.pos.y;
      }

      if (targetX === creep.memory._move.dest.x && targetY === creep.memory._move.dest.y) {
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
    opts.ignoreCreeps = false;
    return creep.moveTo(target, { maxOps: 1000, ignoreCreeps: false, reusePath: 15, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

module.exports = { moveIgnore };
