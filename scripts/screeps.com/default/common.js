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
  if (opts.visualizePathStyle === undefined)
    opts.visualizePathStyle = {};
  opts.ignoreCreeps = true;
  const moveResult = creep.moveTo(target, opts);
  if (moveResult === ERR_NO_PATH) {
    opts.ignoreCreeps = false;
    creep.moveTo(target, opts);
  }
}

module.exports = {
  pickRandomFromList,
  findTransferTargets,
  moveIgnore,
};
