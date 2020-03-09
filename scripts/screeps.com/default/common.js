const { moveIgnore } = require('./moveIgnore');
const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { activityPickup } = require('activityPickup');
const { activityHarvestInPlace } = require('activityHarvestInPlace');
const { pickRandomFromList } = require('./pickRandomFromList');

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

function changeActivityToRandomPickFromList(creep, activityList) {
  changeActivity(creep, pickRandomFromList(activityList));
}

function creepIsEmpty(creep) {
  return creep.store.getUsedCapacity() === 0;
}

function creepHasSpace(creep) {
  return creep.store.getFreeCapacity() > 0;
}

function clearTarget(creep) {
  delete creep.memory.targetId;
}

function bodyCost(body) {
  return body.reduce(function (cost, part) {
    return cost + BODYPART_COST[part];
  }, 0);
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
  activityPickup,
  activityHarvestInPlace,
};
