const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityWithdrawFromStorage(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
  }

  let target;

  if (!target) {
    target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: function (object) {
        return object.structureType === STRUCTURE_STORAGE && object.store.getUsedCapacity() >= creep.store.getUsedCapacity();
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    if (creep.body.some((part) => part.type === WORK && part.hits > 0))
      changeActivity(creep, 'pickup');
    return;
  }

  moveIgnore(creep, target);
  creep.withdraw(target, RESOURCE_ENERGY);
}

module.exports = { activityWithdrawFromStorage };
