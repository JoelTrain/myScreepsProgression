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
  let target;
  if(targets.length) {
    target = targets.find(obj =>
      obj.structureType && obj.structureType === STRUCTURE_TOWER
      && obj.store.getUsedCapacity(RESOURCE_ENERGY) < 200);
  }

  if (target)
    targets = [target];

  if (!targets.length) {
    if (creep.getActiveBodyparts(WORK) > 0)
      changeActivityToRandomPickFromList(creep, ['repair', 'build', 'build',]);
    else {
      const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
      if (structuresAtMyPos.length) {
        const randomDirection = pickRandomFromList([TOP, TOP_LEFT, TOP_RIGHT, LEFT, RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT]);
        creep.move(randomDirection);
      }
      else if (creep.memory.dropoffPos)
        creep.memory.targetPos = creep.memory.dropoffPos;
      changeActivity(creep, 'move to room');
      return;
    }
    return;
  }

  target = creep.pos.findClosestByRange(targets, { ignoreCreeps: true });
  if (!target) {
    creep.say('stuck');
    return;
  }

  if (creep.pos.inRangeTo(target, 1)) {
    creep.transfer(target, RESOURCE_ENERGY);
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
