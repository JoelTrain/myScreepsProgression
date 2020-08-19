//const profiler = require('screeps-profiler');

const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');
const { pickRandomFromList } = require('./pickRandomFromList');

function activityPickup(creep) {

  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
    return;
  }

  let targets = [];

  let roomHasStorage = creep.room.find(FIND_MY_STRUCTURES, {
    filter: structur => structur.structureType === STRUCTURE_STORAGE && structur.store.getFreeCapacity()
  }).length > 0;


  targets.push(...creep.room.find(FIND_DROPPED_RESOURCES, {
    filter: object => {
      const isEnergy = object.resourceType === RESOURCE_ENERGY;

      if (!isEnergy)
        if (roomHasStorage)
          return true;
        else
          return false;

      return object.amount >= creep.store.getFreeCapacity() / 2;
    },
  }));

  targets.push(...creep.room.find(FIND_STRUCTURES, {
    filter: object => object.structureType === STRUCTURE_CONTAINER && object.store.getUsedCapacity() >= creep.store.getFreeCapacity()
  }));

  targets.push(...creep.room.find(FIND_STRUCTURES, {
    filter: object => object.structureType === STRUCTURE_TERMINAL
      && object.store.getUsedCapacity() >= creep.store.getFreeCapacity()
      && (object.store.getUsedCapacity(RESOURCE_OXYGEN) / object.store.getCapacity()) > 0.9
  }));

  targets.push(...creep.room.find(FIND_TOMBSTONES, { filter: object => object.store.getUsedCapacity() > 0 }));

  targets.push(...creep.room.find(FIND_RUINS, { filter: object => object.store.getUsedCapacity() > 0 }));

  targets.push(...creep.room.find(FIND_STRUCTURES, {
    filter: object => object.structureType === STRUCTURE_LINK
      && object.room.memory.accumulatorId == object.id
      && object.store.getUsedCapacity(RESOURCE_ENERGY) > 0
  }));

  if (!targets.length)
    if (creep.body.some((part) => part.type === WORK && part.hits > 0)) {
      changeActivity(creep, 'harvest');
      return;
    }

  if (!targets.length)
    targets = creep.room.find(FIND_DROPPED_RESOURCES);

  if (!targets.length)
    targets.push(...creep.room.find(FIND_STRUCTURES, {
      filter: object => object.structureType === STRUCTURE_STORAGE && object.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity()
    }));

  if (!targets.length)
    targets.push(...creep.room.find(FIND_STRUCTURES, {
      filter: object => object.structureType === STRUCTURE_TERMINAL && object.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity()
    }));

  if (!targets.length)
    targets.push(...creep.room.find(FIND_MY_CREEPS, {
      filter: object => object.memory.role === 'heavyHarvester'
    }));

  const target = creep.pos.findClosestByRange(targets, { ignoreCreeps: true, });
  if (!target) {
    const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
    if (structuresAtMyPos.length) {
      const randomDirection = pickRandomFromList([TOP, TOP_LEFT, TOP_RIGHT, LEFT, RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT]);
      creep.move(randomDirection);
    }
    else if (creep.memory.dropoffPos) {
      console.log(creep.name, 'has nothing to do, returning to dropoff');
      changeActivity(creep, 'return to dropoff');
      return;
    }
    return;
  }

  if (creep.pos.inRangeTo(target, 1)) {
    if (target.amount) {
      if (target.amount >= creep.store.getFreeCapacity(target.resourceType))
        changeActivity(creep, creep.memory.whenFull);
      creep.pickup(target);
      return;
    }

    if (target instanceof Structure || target instanceof Tombstone || target instanceof Ruin) {
      const stored_resources = _.filter(Object.keys(target.store), resource => target.store[resource] > 0);

      if (target.store[stored_resources[0]] >= creep.store.getFreeCapacity(RESOURCE_ENERGY))
        changeActivity(creep, creep.memory.whenFull);

      creep.withdraw(target, stored_resources[0]);
      return;
    }
  }

  moveIgnore(creep, target, { maxRooms: 1 });
}

// Be sure to reassign the function, we can't alter functions that are passed.
//activityPickup = profiler.registerFN(activityPickup);

module.exports = { activityPickup };
