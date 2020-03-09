function pickRandomFromList(list) {
  if (!list.length) {
    throw Error(`Cannot pick at random from ${List}`);
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

function findExtensionsWithFreeSpace(creep) {
  const extensions = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return extensions;
}

function findMySpawnsWithFreeSpace(creep) {
  const spawns = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return spawns;
}

function findStorageWithFreeSpace(creep) {
  const storage = creep.room.find(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_STORAGE && object.store.getFreeCapacity() > creep.store.getUsedCapacity();
    }
  });
  return storage;
}

function findTransferTargets(creep) {
  let targets = [];
  if (!targets.length)
    targets = findExtensionsWithFreeSpace(creep);
  if (!targets.length)
    targets = findMySpawnsWithFreeSpace(creep);
  if (!targets.length)
    targets = findStorageWithFreeSpace(creep);

  return targets;
}

function activitySetup(creep) {
  if (creep.memory.activity === undefined)
    creep.memory.activity = creep.memory.whenEmpty;
  if (creep.memory.whenEmpty === undefined)
    creep.memory.whenEmpty = 'pickup';
  if (creep.memory.whenFull === undefined)
    creep.memory.whenFull = 'upgrading controller';
}

let callOuts = true;
function changeActivity(creep, newActivity) {
  if (creep.memory.activity === newActivity)
    return;

  if (callOuts)
    creep.say(newActivity);

  creep.memory.activity = newActivity;
}

function changeActivityToRandomPickFromList(creep, activityList) {
  changeActivity(creep, pickRandomFromList(activityList));
}

function creepIsEmpty(creep) {
  return creep.store.getUsedCapacity() === 0;
}

function creepHasSpace(creep) {
  return creep.store.getFreeCapacity() > 0;
}

function creepIsFull(creep) {
  return creep.store.getFreeCapacity() === 0;
}

function clearTarget(creep) {
  delete creep.memory.targetId;
}

function bodyCost(body) {
  return body.reduce(function (cost, part) {
    return cost + BODYPART_COST[part];
  }, 0);
}

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
    if (x === creep.pos.x && y === creep.pos.y && creep.fatigue === 0) {
      console.log(`${creep.name} is not moving since ${creep.pos}`);
      failedToMove = true;
    }
  }
  creep.memory.lastPos = creep.pos;
  creep.memory.lastFatigue = creep.fatigue;

  if (failedToMove) {
    opts.ignoreCreeps = false;
    console.log(creep.name, target);
    return creep.moveTo(target, { ignoreCreeps: false, reusePath: 0, visualizePathStyle: { stroke: 'orange' } });
  }
  return moveResult;
}

module.exports = {
  pickRandomFromList,
  findTransferTargets,
  moveIgnore,
  creepIsEmpty,
  creepHasSpace,
  creepIsFull,
  clearTarget,
  bodyCost,
  activitySetup,
  changeActivity,
  changeActivityToRandomPickFromList,
};
