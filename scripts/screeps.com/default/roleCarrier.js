const { activity, changeActivity } = require('./activity');
const { findTransferTargets, moveIgnore, creepIsEmpty, } = require('./common');

const carrierOverrides = {
  'transferring': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    let targets;
    targets = findTransferTargets(creep);

    if (!targets.length) {
      targets = creep.room.find(FIND_MY_CREEPS, {
        filter: function (otherCreep) {
          return otherCreep.store.getFreeCapacity() > 50 && (otherCreep.memory.role === 'upgrader' || otherCreep.memory.role === 'harvester' || otherCreep.memory.role === 'builder');
        }
      });
    }

    if (!targets.length) {
      creep.memory.rallyPoint = 'DefenseRallyPoint';
      changeActivity(creep, 'move to rally point');
      return;
    }

    let target = creep.pos.findClosestByPath(targets);
    if (!target)
      return;

    creep.memory.targetId = target.id;
    if (creep.pos.inRangeTo(target, 1)) {
      creep.transfer(target, RESOURCE_ENERGY);

      const pos = targets.indexOf(target);
      if (pos > -1) {
        targets.splice(pos, 1);
        target = creep.pos.findClosestByPath(targets);
      }
    }

    moveIgnore(creep, target);
  },
};

function runCarrier(creep) {
  if (carrierOverrides[creep.memory.activity]) {
    carrierOverrides[creep.memory.activity](creep);
    return;
  }
  else if (activity[creep.memory.activity]) {
    activity[creep.memory.activity](creep);
    return;
  }

  changeActivity(creep, creep.memory.whenEmpty);
}

module.exports = { runCarrier };
