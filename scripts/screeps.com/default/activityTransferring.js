const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');
const { findTransferTargets } = require('./findTransferTargets');

function activityTransferring(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  let targets;
  targets = findTransferTargets(creep);

  if (!targets.length) {
    changeActivity(creep, 'move to rally point');
    return;
  }

  let target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
  if (!target) {
    creep.say('stuck');
    return;
  }

  creep.memory.targetId = target.id;
  if (creep.pos.inRangeTo(target, 1)) {
    creep.transfer(target, RESOURCE_ENERGY);

    const pos = targets.indexOf(target);
    if (pos > -1) {
      targets.splice(pos, 1);
      target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
    }
  }
  
  if(target)
    moveIgnore(creep, target);
}

module.exports = { activityTransferring };
