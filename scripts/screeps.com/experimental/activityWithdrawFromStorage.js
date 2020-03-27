const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');
const { pickRandomFromList } = require('./pickRandomFromList');

function activityWithdrawFromStorage(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
  }

  let targets = [];
  targets = creep.room.find(FIND_STRUCTURES, {
    filter: object => (object.structureType === STRUCTURE_STORAGE || object.structureType === STRUCTURE_TERMINAL) && object.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity(),
    ignoreCreeps: true,
  });

  if (!targets.length) {
    if (creep.getActiveBodyparts(CARRY))
      changeActivity(creep, 'pickup');
    return;
  }

  const target = creep.pos.findClosestByPath(targets);
  if (!target) {
    const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
    if (structuresAtMyPos.length) {
      const randomDirection = pickRandomFromList([TOP, TOP_LEFT, TOP_RIGHT, LEFT, RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT]);
      creep.move(randomDirection);
    }
    return;
  }

  const withdrawResult = creep.withdraw(target, RESOURCE_ENERGY);
  if (withdrawResult === OK) {
    creep.memory.ready = true;
  }

  moveIgnore(creep, target, { maxRooms: 1 });
}

module.exports = { activityWithdrawFromStorage };
