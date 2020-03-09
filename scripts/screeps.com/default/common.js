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

function moveIgnore(creep, target, opts) {
  if (opts === undefined)
    opts = {};
  if (opts.visualizePathStyle === undefined)
    opts.visualizePathStyle = {};
  opts.ignoreCreeps = true;
  const moveResult = creep.moveTo(target, opts);

  let failedToMove = false;
  if (!failedToMove)
    failedToMove = moveResult === ERR_NO_PATH;
  console.log(moveResult);

  const lastPos = creep.memory.lastPos;
  if (lastPos) {
    if (JSON.stringify(creep.memory.lastPos) === JSON.stringify(creep.pos) && creep.fatigue === 0) {
      console.log(`${creep.name} is not moving since ${creep.pos}`);
      failedToMove = true;
    }
    else {
      console.log(JSON.stringify(creep.memory.lastPos), JSON.stringify(creep.pos));
    }
  }
  creep.memory.lastPos = creep.pos;

  if (failedToMove) {
    opts.ignoreCreeps = false;
    console.log(creep.name, target);
    return creep.moveTo(target);
  }
  return moveResult;
}

module.exports = {
  pickRandomFromList,
  findTransferTargets,
  moveIgnore,
};
