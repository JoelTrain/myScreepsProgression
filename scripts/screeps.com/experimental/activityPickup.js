const profiler = require('screeps-profiler');

const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');
const { pickRandomFromList } = require('./pickRandomFromList');

function activityPickup(creep) {

  const start = Game.cpu.getUsed();
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
    return;
  }


  let end = Game.cpu.getUsed();
  if (end - start > 0.2)
    console.log(creep.name, Game.time, 'pickup slow in -2', creep.room.name, end - start);
  //console.log(creep.name, Game.time, 'pickup in -2', creep.room.name, end - start);


  let targets = [];

  let roomHasStorage = creep.room.find(FIND_MY_STRUCTURES, {
    filter: structur => structur.structureType === STRUCTURE_STORAGE && structur.store.getFreeCapacity()
  }).length > 0;

  roomHasStorage |= creep.room.find(FIND_HOSTILE_STRUCTURES, {
    filter: structur => structur.structureType === STRUCTURE_STORAGE && structur.store.getFreeCapacity()
  }).length > 0;


  end = Game.cpu.getUsed();
  if (end - start > 0.2)
    console.log(creep.name, Game.time, 'pickup slow in -1', creep.room.name, end - start);
  //console.log(creep.name, Game.time, 'pickup in -1', creep.room.name, end - start);


  targets.push(...creep.room.find(FIND_DROPPED_RESOURCES, {
    filter: object => {
      const isEnergy = object.resourceType === RESOURCE_ENERGY;

      if (!isEnergy)
        if (roomHasStorage)
          return true;
        else
          return false;

      return object.amount >= creep.store.getFreeCapacity();
    },
  }));

  end = Game.cpu.getUsed();
  if (end - start > 0.2)
    console.log(creep.name, Game.time, 'pickup slow in 0', creep.room.name, end - start);
  //console.log(creep.name, Game.time, 'pickup in 0', creep.room.name, end - start);


  targets.push(...creep.room.find(FIND_STRUCTURES, {
    filter: object => object.structureType === STRUCTURE_CONTAINER && object.store.getUsedCapacity() >= creep.store.getFreeCapacity()
  }));

  end = Game.cpu.getUsed();
  if (end - start > 0.2)
    console.log(creep.name, Game.time, 'pickup slow in 1', creep.room.name, end - start);
  //console.log(creep.name, Game.time, 'pickup in 1', creep.room.name, end - start);

  targets.push(...creep.room.find(FIND_TOMBSTONES, { filter: object => object.store.getUsedCapacity() > 0 }));

  targets.push(...creep.room.find(FIND_RUINS, { filter: object => object.store.getUsedCapacity() > 0 }));

  if (!targets.length)
    if (creep.body.some((part) => part.type === WORK && part.hits > 0)) {
      changeActivity(creep, 'harvest');
      return;
    }

  if (!targets.length)
    targets = creep.room.find(FIND_DROPPED_RESOURCES);

  if (!targets.length)
    targets.push(...creep.room.find(FIND_STRUCTURES, {
      filter: object => object.structureType === STRUCTURE_STORAGE && object.store.getUsedCapacity(RESOURCE_ENERGY)
    }));

  if (!targets.length)
    targets.push(...creep.room.find(FIND_STRUCTURES, { filter: object => object.structureType === STRUCTURE_CONTAINER }));

  const target = creep.pos.findClosestByRange(targets, { ignoreCreeps: true, });
  if (!target) {
    const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
    if (structuresAtMyPos.length) {
      const randomDirection = pickRandomFromList([TOP, TOP_LEFT, TOP_RIGHT, LEFT, RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT]);
      creep.move(randomDirection);
    }
    return;
  }

  if (creep.pos.inRangeTo(target, 1)) {
    creep.pickup(target);
    if (target.amount !== undefined && target.amount >= creep.store.getFreeCapacity(target.resourceType)) {
      changeActivity(creep, creep.memory.whenFull);

      const end = Game.cpu.getUsed();
      if (end - start > 0.2)
        console.log(creep.name, Game.time, 'pickup slow in 2', targets.length, creep.room.name, end - start);
      //console.log(creep.name, 'pickup', end - start);
      return;
    }

    if (target.structureType || target.deathTime || target.destroyTime) {
      const stored_resources = _.filter(Object.keys(target.store), resource => target.store[resource] > 0);
      creep.withdraw(target, stored_resources[0]);

      if (target.store[stored_resources[0]] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
        changeActivity(creep, creep.memory.whenFull);

        const end = Game.cpu.getUsed();
        if (end - start > 0.2)
          console.log(creep.name, Game.time, 'pickup slow in 3', targets.length, creep.room.name, end - start);
        //console.log(creep.name, 'pickup', end - start);
        return;
      }
    }
  }

  moveIgnore(creep, target);

  // const end = Game.cpu.getUsed();
  // console.log(creep.name, 'pickup', end - start);
}

// Be sure to reassign the function, we can't alter functions that are passed.
activityPickup = profiler.registerFN(activityPickup);

module.exports = { activityPickup };
