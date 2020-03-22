const { activity, changeActivity } = require('./activity');
const { creepHasResources } = require('./creepHasResources');
const { pickRandomFromList } = require('./pickRandomFromList');
const { findTransferTargets, moveIgnore, creepIsEmpty, } = require('./common');

const carrierOverrides = {
  'transfer': function (creep) {
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
      const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
      if (structuresAtMyPos.length) {
        const randomDirection = pickRandomFromList([TOP, TOP_LEFT, TOP_RIGHT, LEFT, RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT]);
        creep.move(randomDirection);
      }

      return;
    }

    let target = creep.pos.findClosestByPath(targets);
    if (!target)
      return;

    creep.memory.targetId = target.id;
    if (creep.pos.inRangeTo(target, 1)) {
      creep.transfer(target, RESOURCE_ENERGY);
      if (target.store.getFreeCapacity(RESOURCE_ENERGY) >= creep.store.getUsedCapacity(RESOURCE_ENERGY)) {
        changeActivity(creep, creep.memory.whenEmpty);
        return;
      }

      const pos = targets.indexOf(target);
      if (pos > -1) {
        targets.splice(pos, 1);
        target = creep.pos.findClosestByPath(targets);
      }
    }

    if (target)
      moveIgnore(creep, target);
  },
};

function runCarrier(creep) {
  const start = Game.cpu.getUsed();
  if (creepHasResources(creep))
    changeActivity(creep, 'deposit');

  if (carrierOverrides[creep.memory.activity])
    carrierOverrides[creep.memory.activity](creep);
  else if (activity[creep.memory.activity])
    activity[creep.memory.activity](creep);
  else
    changeActivity(creep, creep.memory.whenEmpty);

  const end = Game.cpu.getUsed();

  //console.log(creep.name, end - start);
}

module.exports = { runCarrier };
