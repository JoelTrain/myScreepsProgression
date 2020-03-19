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
        return object.structureType === STRUCTURE_STORAGE && object.store.getFreeCapacity() > creep.store.getUsedCapacity();
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
  // drop all resources
  for (const resourceType in creep.carry) {
    creep.drop(resourceType);
    break;
  }
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
