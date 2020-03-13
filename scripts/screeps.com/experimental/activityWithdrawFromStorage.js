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
        return object.structureType === STRUCTURE_STORAGE && object.room === creep.room && object.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity();
      },
      ignoreCreeps: true,
    });
  }

  if (!target) {
    if (creep.body.some((part) => part.type === CARRY && part.hits > 0))
      changeActivity(creep, 'pickup');
    return;
  }

  moveIgnore(creep, target);
  const withdrawResult = creep.withdraw(target, RESOURCE_ENERGY);
  if (withdrawResult === OK) {
    creep.memory.ready = true;
  }
}

module.exports = { activityWithdrawFromStorage };
