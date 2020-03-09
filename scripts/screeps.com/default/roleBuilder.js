const { activity, changeActivity } = require('./activity');
const { moveIgnore } = require('./common');

const {
  creepIsEmpty,
  clearTarget,
} = require('./creepCommon');

const builderOverrides = {
  'moving to build site': this['building site'],
  'building site': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    let target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    }
    if (!target) {
      clearTarget(creep);
      changeActivity(creep, 'searching for repair');
      return;
    }

    creep.memory.targetId = target.id;

    if (creep.pos.inRangeTo(target, 3)) {
      const buildResult = creep.build(target);
      if (buildResult !== OK) {
        changeActivity(creep, 'searching for repair');
      }
      return;
    }

    moveIgnore(creep, target);
    return;
  },
  'searching for repair': function (creep) {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: object => object.structureType !== STRUCTURE_WALL && ((object.hits / object.hitsMax) < 0.8)
    });

    if (targets.length === 0) {
      changeActivity(creep, 'upgrading controller');
      return;
    }

    targets.sort((a, b) => a.hits - b.hits);
    const target = targets[0];

    creep.memory.targetId = target.id;
    changeActivity(creep, 'moving to repair');
  },
  'moving to repair': function (creep) {
    const target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
      console.log('could not find object by id', creep.memory.targetId, 'for creep', creep.name);
      changeActivity(creep, 'searching for repair');
      return;
    }

    if (target.hits === target.hitsMax) {
      changeActivity(creep, 'searching for repair');
      return;
    }

    if (creep.pos.inRangeTo(target, 3)) {
      changeActivity(creep, 'repairing');
      return;
    }

    moveIgnore(creep, target);
  },
  'repairing': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    const target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
      console.log('could not find object by id', creep.memory.targetId, 'for creep', creep.name);
      changeActivity(creep, 'searching for repair');
      return;
    }

    if (target.hits === target.hitsMax) {
      changeActivity(creep, 'searching for repair');
      return;
    }

    creep.repair(target);
  },
};

function runBuilder(creep) {
  if (builderOverrides[creep.memory.activity]) {
    builderOverrides[creep.memory.activity](creep);
    return;
  }
  else if (activity[creep.memory.activity]) {
    activity[creep.memory.activity](creep);
    return;
  }

  changeActivity(creep, creep.memory.whenEmpty);
}

module.exports = { runBuilder };
