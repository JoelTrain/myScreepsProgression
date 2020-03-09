const { activitySetup, changeActivity } = require('./activity');
const { moveIgnore } = require('./common');

const roleManual = {
  run: function (creep) {
    activitySetup(creep);

    this[creep.memory.activity](creep);
  },
  creep.memory.whenEmpty: function(creep) {
    changeActivity(creep, 'moving to flag');
  },
  'moving to flag': function (creep) {
    const flag = Game.flags['Flag1'];
    if (creep.pos.inRangeTo(flag, 0)) {
      changeActivity(creep, 'moving to foreign controller');
      return;
    }

    moveIgnore(creep, flag);
  },
  'moving to foreign controller': function (creep) {
    if (creep.pos.inRangeTo(creep.room.controller, 1)) {
      changeActivity(creep, 'claiming controller');
      return;
    }

    moveIgnore(creep, creep.room.controller);
  },
  'claiming controller': function (creep) {
    if (creep.room.controller.my) {
      creep.say('Claimed!');
      changeActivity(creep, 'change to harvester');
      return;
    }

    const failCode = creep.claimController(creep.room.controller);
    if (failCode) {
      console.log('Failed with code', failCode);
      changeActivity(creep, 'change to harvester');
    }
  },
  'change to harvester': function (creep) {
    creep.memory.role = 'harvester';
    changeActivity(creep, creep.memory.whenEmpty);
  },
};

module.exports = { roleManual };
