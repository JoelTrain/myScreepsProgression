const { moveIgnore } = require('./moveIgnore');
const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');

function activityUpgrading(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
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

    if (result !== OK) {
      changeActivity(creep, creep.memory.whenEmpty);
    }
    return;
  }

  moveIgnore(creep, controller);
}

module.exports = { activityUpgrading };
