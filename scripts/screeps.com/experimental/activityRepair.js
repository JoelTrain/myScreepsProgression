const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { clearTarget } = require('./clearTarget');
const { changeActivity } = require('./changeActivity');

function activityRepair(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  let target;
  target = Game.getObjectById(creep.memory.targetId);
  if (!target || !(target instanceof Structure) || target.hits === target.hitsMax) {
    const targets = creep.room.find(FIND_STRUCTURES, {
      filter: object => object.structureType !== STRUCTURE_WALL && ((object.hits / object.hitsMax) < 0.8)
    });

    targets.sort((a, b) => a.hits - b.hits);
    target = targets[0];

    if (target)
      creep.memory.targetId = target.id;
    else
      clearTarget(creep);
  }
  if (!target) {
    changeActivity(creep, 'upgrading');
    return;
  }

  if (creep.pos.inRangeTo(target, 3)) {
    creep.repair(target);
  }

  moveIgnore(creep, target);
  return;
}

module.exports = { activityRepair };
