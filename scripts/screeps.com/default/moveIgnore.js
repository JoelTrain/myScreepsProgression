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

  const lastPos = creep.memory.lastPos;
  const lastFatigue = creep.memory.lastFatigue;
  if (lastPos !== undefined && lastFatigue !== undefined) {
    const { x, y } = creep.memory.lastPos;
    if (x === creep.pos.x && y === creep.pos.y && creep.memory.lastFatigue === creep.fatigue && creep.fatigue === 0) {
      //console.log(`${creep.name} is not moving since ${creep.pos}`);
      creep.say('stuck!');
      failedToMove = true;
    }
  }
  creep.memory.lastPos = creep.pos;
  creep.memory.lastFatigue = creep.fatigue;

  if (failedToMove) {
    delete creep.memory._move;
    opts.ignoreCreeps = false;
    return creep.moveTo(target, { ignoreCreeps: false, reusePath: 15, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

module.exports = { moveIgnore };
