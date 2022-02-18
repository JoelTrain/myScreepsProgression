const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { clearTarget } = require('./clearTarget');
const { changeActivity } = require('./changeActivity');

function activityBuilding(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  let target = Game.getObjectById(creep.memory.targetId);
  let targets = [];
  if (target && target instanceof ConstructionSite && target.progress < target.progressTotal)
    targets.push(target);

  if (!targets.length) {
    targets.push(...creep.room.find(FIND_CONSTRUCTION_SITES, {
      filter: structure => structure.structureType === STRUCTURE_EXTENSION
    }));
  }
  if (!targets.length) {
    targets.push(...creep.room.find(FIND_CONSTRUCTION_SITES));
  }
  if (!targets.length) {
    console.log(creep.name, 'has no targets in', creep.room.name);
    const dropPos = creep.memory.dropoffPos;
    if (dropPos && creep.room.name != dropPos.roomName) {
      changeActivity(creep, 'return to dropoff');
      return;
    }
    else {
      if (creep.memory.role !== 'basic' && creep.room.find(FIND_MY_CREEPS, { filter: foundCreep => foundCreep.memory.role === 'carrier' }).length === 0) {
        changeActivity(creep, 'transfer');
        return;
      }
    }
  }
  if (!targets.length) {
    console.log(creep.name, "no build targets, going repair");
    changeActivity(creep, 'repair');
    return;
  }

  target = targets[0];
  creep.memory.targetId = target.id;

  const buildResult = creep.build(target);
  if (buildResult === ERR_NOT_IN_RANGE)
    moveIgnore(creep, target, { maxRooms: 1 });
  else if (buildResult !== OK) {
    clearTarget(creep);
    console.log(creep.name, `failed build for ${buildResult}, cleared target`);
    //changeActivity(creep, 'repair');
  }
}

module.exports = { activityBuilding };
