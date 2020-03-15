const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityPickup(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
  }

  let target;

  if (!target) {
    let targets = creep.room.find(FIND_DROPPED_RESOURCES);
    target = creep.pos.findClosestByPath(targets, {
      filter: function (object) {
        const isEnergy = object.resourceType === RESOURCE_ENERGY;

        if (!isEnergy)
          return true;

        return object.amount >= 500;
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: function (object) {
        return object.structureType === STRUCTURE_CONTAINER && object.store.getUsedCapacity() >= creep.store.getFreeCapacity();
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
      filter: function (object) {
        return object.store.getUsedCapacity() > 0;
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_RUINS, {
      filter: function (object) {
        return object.store.getUsedCapacity() > 0;
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    if (creep.body.some((part) => part.type === WORK && part.hits > 0))
      changeActivity(creep, 'harvest')
    else
      changeActivity(creep, 'move to rally point');
    return;
  }

  moveIgnore(creep, target);
  let result;
  result = creep.pickup(target);
  if (result === OK)
    changeActivity(creep, creep.memory.whenFull);

  result = creep.withdraw(target, RESOURCE_ENERGY);
  if (result === OK)
    changeActivity(creep, creep.memory.whenFull);
}

module.exports = { activityPickup };
