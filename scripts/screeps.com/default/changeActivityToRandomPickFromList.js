const { pickRandomFromList } = require('./pickRandomFromList');

function changeActivityToRandomPickFromList(creep, activityList) {
  changeActivity(creep, pickRandomFromList(activityList));
}

module.exports = { changeActivityToRandomPickFromList };
