const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityDepositIntoStorage(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
  }

  let target;

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: function (object) {
        return (object.structureType === STRUCTURE_STORAGE || object.structureType === STRUCTURE_TERMINAL) && object.store.getFreeCapacity() > creep.store.getUsedCapacity();
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    if (!creep.room.controller || !creep.room.controller.my) {
      if (creep.memory.dropoffPos) {
        changeActivity(creep, 'return to dropoff');
        return;
      }
    }
    // drop all resources
    for (const resourceType in creep.carry) {
      creep.drop(resourceType);
      break;
    }
    return;
  }

  if (creep.room.find(FIND_MY_CREEPS, { filter: foundCreep => foundCreep.memory.role === 'carrier' }).length === 0) {
    console.log(creep.name);
    changeActivity(creep, 'transfer');
    return;
  }

  moveIgnore(creep, target);

  // transfer all resources
  for (const resourceType in creep.carry) {
    creep.transfer(target, resourceType);
    break;
  }
}

module.exports = { activityDepositIntoStorage };
