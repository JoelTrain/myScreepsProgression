const {
  creepIsFull,
  changeActivity,
  moveIgnore,
} = require('./common');

function pickupActivity(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
  }

  let target;

  if (!target) {
    let targets = creep.room.find(FIND_DROPPED_RESOURCES);
    target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
  }

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: function (object) {
        return object.structureType === STRUCTURE_CONTAINER && object.store.getUsedCapacity() >= 100;
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
    creep.memory.rallyPoint = 'DefenseRallyPoint';
    changeActivity(creep, 'move to rally point');
    return;
  }

  moveIgnore(creep, target);
  creep.pickup(target);
  creep.withdraw(target, RESOURCE_ENERGY);
}

module.export = { pickupActivity };
