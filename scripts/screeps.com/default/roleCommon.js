const { activity, changeActivity } = require('./activity');
function runCommon(creep) {
  if (activity[creep.memory.activity]) {
    activity[creep.memory.activity](creep);
    return;
  }

  changeActivity(creep, creep.memory.whenEmpty);
}

module.exports = { runCommon };
