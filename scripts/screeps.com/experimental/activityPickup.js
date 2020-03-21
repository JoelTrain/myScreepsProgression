const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityPickup(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
    return;
  }

  let target;
  let targets = [];

  if (!target) {
    const roomHasStorage = creep.room.find(FIND_STRUCTURES, {
        filter: (structur) => structur instanceof StructureStorage && structur.store.getFreeCapacity()
    }).length > 0;
    
    targets.push(...creep.room.find(FIND_DROPPED_RESOURCES, {
      filter: function (object) {
        const isEnergy = object.resourceType === RESOURCE_ENERGY;

        if (!isEnergy)
        if(roomHasStorage)
          return true;
        else
          return false;

        return object.amount >= creep.store.getFreeCapacity();
      },}));
  }

    targets.push(...creep.room.find(FIND_STRUCTURES, {
      filter: (object) => {
        return object.structureType === STRUCTURE_CONTAINER && object.store.getUsedCapacity() >= creep.store.getFreeCapacity();
      }
    }));

    targets.push(...creep.room.find(FIND_TOMBSTONES, {
      filter: function (object) {
        return object.store.getUsedCapacity() > 0;
      }
    }));
  

    targets.push(...creep.room.find(FIND_RUINS, {
      filter: function (object) {
        return object.store.getUsedCapacity() > 0;
      }
    }));

  if (targets.length === 0) {
    if (creep.body.some((part) => part.type === WORK && part.hits > 0)) {
      changeActivity(creep, 'harvest');
      return;
    }
  }
  
  target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true, });
  
  if(!target) {
    targets = creep.room.find(FIND_DROPPED_RESOURCES);
    target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true, });
  }

  if (!target) {
    targets.push(...creep.room.find(FIND_STRUCTURES, {
      filter: function (object) {
        return object.structureType === STRUCTURE_CONTAINER;
      }
    }));
    target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true, });
    return;
  }
  
  if(!target)
    return;

  if (creep.pos.inRangeTo(target, 1)) {
    creep.pickup(target);
    if (target instanceof Resource && target.amount >= creep.store.getFreeCapacity(target.resourceType)) {
      changeActivity(creep, creep.memory.whenFull);
      return;
    }

    if (target instanceof Structure || target instanceof Tombstone || target instanceof Ruin) {
      const stored_resources = _.filter(Object.keys(target.store), resource => target.store[resource] > 0)
        creep.withdraw(target, stored_resources[0]);

      if (target.store[stored_resources[0]] >= creep.store.getFreeCapacity(RESOURCE_ENERGY)) {
        changeActivity(creep, creep.memory.whenFull);
        return;
      }
    }
  }

  moveIgnore(creep, target);
}

module.exports = { activityPickup };
