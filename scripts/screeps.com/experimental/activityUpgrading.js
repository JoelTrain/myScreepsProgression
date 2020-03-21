const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');

function activityUpgrading(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  if (creep.room.find(FIND_MY_CREEPS, { filter: foundCreep => foundCreep.memory.role === 'carrier' }).length === 0) {
    console.log(creep.name);
    changeActivity(creep, 'transfer');
    return;
  }

  let controller = creep.room.controller;
  if (!controller.my) {
    for (const room of Object.values(Game.rooms)) {
      if (room.controller.my) {
        controller = room.controller;
        break;
      }
    }
  }

  if (creep.pos.inRangeTo(controller, 3)) {
    const result = creep.upgradeController(controller);

    if (!controller.sign || controller.sign.username !== 'ComradeJoecool') {
      moveIgnore(creep, controller);
      creep.signController(controller, 'Write your own code or die.');
    }

    const storages = creep.pos.findInRange(FIND_STRUCTURES, 1, {
      filter: function (object) {
        return (object.structureType === STRUCTURE_STORAGE || object.structureType == STRUCTURE_CONTAINER) && object.store.getUsedCapacity(RESOURCE_ENERGY) >= creep.store.getFreeCapacity();
      }
    });
    if (storages.length)
      creep.withdraw(storages[0], RESOURCE_ENERGY);

    if (result !== OK) {
      changeActivity(creep, creep.memory.whenEmpty);
    }
    return;
  }

  moveIgnore(creep, controller);
}

module.exports = { activityUpgrading };
