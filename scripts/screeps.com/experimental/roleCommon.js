const { activity, changeActivity } = require('./activity');
const { creepHasResources } = require('./creepHasResources');

function runCommon(creep) {
  if (creepHasResources(creep) && creep.memory.role !== 'carrier' && creep.memory.role !== 'remoteCarrier')
    changeActivity(creep, 'deposit');

  if (activity[creep.memory.activity]) {
    activity[creep.memory.activity](creep);
    return;
  }

  changeActivity(creep, creep.memory.whenEmpty);
}

module.exports = { runCommon };
