const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');
const { findTransferTargets } = require('./findTransferTargets');
const { changeActivityToRandomPickFromList } = require('./changeActivityToRandomPickFromList');

function activityTransferring(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  let targets;
  targets = findTransferTargets(creep);

  if (!targets.length) {
    if (creep.body.some((part) => part.type === WORK && part.hits > 0)) {
      changeActivityToRandomPickFromList(creep, ['repair', 'build', 'build',]);
    }
    else {
      changeActivity(creep, 'move to rally point');
    }
    return;
  }

  let target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
  if (!target) {
    creep.say('stuck');
    return;
  }

  if (creep.pos.inRangeTo(target, 1)) {
    creep.transfer(target, RESOURCE_ENERGY);
    console.log(creep.name, target.store.getFreeCapacity(RESOURCE_ENERGY));
    if (target.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    const pos = targets.indexOf(target);
    if (pos > -1) {
      targets.splice(pos, 1);
      target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
    }
  }

  if (target)
    moveIgnore(creep, target);
}

module.exports = { activityTransferring };
