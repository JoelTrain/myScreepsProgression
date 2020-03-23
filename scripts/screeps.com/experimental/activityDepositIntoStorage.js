const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityDepositIntoStorage(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
  }

  let target;

  if (!target) {
    let targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: object => (object.structureType === STRUCTURE_STORAGE || object.structureType === STRUCTURE_TOWER)
        && object.store.getFreeCapacity() > creep.store.getUsedCapacity(),
      ignoreCreeps: true,
    });
    target = creep.pos.findClosestByRange(targets);
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
    changeActivity(creep, 'transfer');
    return;
  }

  if (creep.pos.isNearTo(target)) {
    // transfer all resources
    for (const resourceType in creep.carry) {
      creep.transfer(target, resourceType);
      break;
    }

    return;
  }

  moveIgnore(creep, target);
}

module.exports = { activityDepositIntoStorage };
