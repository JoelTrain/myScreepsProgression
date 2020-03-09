function moveIgnore(creep, target, opts) {
  if (creep.spawning)
    return;

  if (opts === undefined)
    opts = {};
  if (opts.visualizePathStyle === undefined)
    opts.visualizePathStyle = {};
  opts.ignoreCreeps = true;
  const moveResult = creep.moveTo(target, opts);

  let failedToMove = false;
  if (!failedToMove)
    failedToMove = moveResult === ERR_NO_PATH;

  if (!failedToMove) {
    if (creep.memory._move) {
      if (target.pos.x === creep.memory._move.dest.x && target.pos.y === creep.memory._move.dest.y) {
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
    return creep.moveTo(target, { ignoreCreeps: false, reusePath: 15, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

module.exports = { moveIgnore };
