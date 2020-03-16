const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { clearTarget } = require('./clearTarget');
const { changeActivity } = require('./changeActivity');

function readyForRepair(object) {
  return object.hits / object.hitsMax < 0.8;
}

function activityRepair(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  let target;
  target = Game.getObjectById(creep.memory.targetId);
  if (!target || !(target instanceof Structure) || target.hits === target.hitsMax) {
    const extensionsToBuild = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
      filter: object => object.structureType === STRUCTURE_EXTENSION
    });
    if (extensionsToBuild.length) {
      changeActivity(creep, 'build');
      return;
    }

    let targets = creep.room.find(FIND_STRUCTURES, {
      filter: object => readyForRepair(object) && object.structureType !== STRUCTURE_WALL && object.structureType !== STRUCTURE_RAMPART
    });

    if (targets.length == 0)
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => readyForRepair(object) && object.structureType !== STRUCTURE_WALL
      });

    if (targets.length == 0)
      targets = creep.room.find(FIND_STRUCTURES, {
        filter: object => readyForRepair(object)
      });

    targets.sort((a, b) => a.hits - b.hits);
    target = targets[0];

    if (target)
      creep.memory.targetId = target.id;
    else
      clearTarget(creep);
  }
  if (!target) {
    changeActivity(creep, 'build');
    return;
  }

  if (creep.pos.inRangeTo(target, 3)) {
    creep.repair(target);
    return;
  }

  moveIgnore(creep, target);
  return;
}

module.exports = { activityRepair };
