const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityPickup(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
    return;
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
    if (creep.body.some((part) => part.type === WORK && part.hits > 0)) {
      changeActivity(creep, 'harvest');
      return;
    }
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: function (object) {
        return object.structureType === STRUCTURE_CONTAINER;
      },
      ignoreCreeps: true,
    });
  }

  if (!target)
    return;

  if (creep.pos.inRangeTo(target, 1)) {
    creep.pickup(target);
    if (target instanceof Resource && target.amount > creep.store.getFreeCapacity()) {
      changeActivity(creep, creep.memory.whenFull);
      return;
    }

    if (target instanceof Structure || target instanceof Tombstone || target instanceof Ruin) {
      const stored_resources = _.filter(Object.keys(target.store), resource => target.store[resource] > 0)
      creep.withdraw(target, stored_resources[0]);

      if (stored_resources[0] >= creep.store.getFreeCapacity()) {
        changeActivity(creep, creep.memory.whenFull);
        return;
      }
    }
  }

  moveIgnore(creep, target);
}

module.exports = { activityPickup };
