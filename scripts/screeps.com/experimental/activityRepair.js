const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { clearTarget } = require('./clearTarget');
const { changeActivity } = require('./changeActivity');

function readyForRepair(object) {
  return object.hits / object.hitsMax < 0.8 && object.hits < 1000000;
}

function activityRepair(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  if (creep.memory.role !== 'basic' && creep.room.find(FIND_MY_CREEPS, { filter: foundCreep => foundCreep.memory.role === 'carrier' }).length === 0) {
    changeActivity(creep, 'transfer');
    return;
  }

  let target;
  target = Game.getObjectById(creep.memory.targetId);
  if (!target || !(target instanceof Structure) || target.hits === target.hitsMax) {
    const extensionsToBuild = creep.room.find(FIND_MY_CONSTRUCTION_SITES, {
      filter: object => object.structureType === STRUCTURE_EXTENSION
    });
    if (extensionsToBuild.length) {
      clearTarget(creep);
      changeActivity(creep, 'build');
      return;
    }

    let targets = [];
    targets = creep.room.find(FIND_STRUCTURES, {
      filter: object => object.hits === 1 && object.structureType === STRUCTURE_RAMPART
    });

    if (targets.length === 0)
      targets = creep.room.find(FIND_STRUCTURES, {
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
    clearTarget(creep);
    changeActivity(creep, 'transfer');
    return;
  }

  if (creep.pos.inRangeTo(target, 3)) {
    creep.repair(target);
    return;
  }

  moveIgnore(creep, target, { maxRooms: 1 });
  return;
}

module.exports = { activityRepair };
