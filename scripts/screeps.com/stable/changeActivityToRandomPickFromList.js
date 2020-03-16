const { pickRandomFromList } = require('./pickRandomFromList');
const { changeActivity } = require('./changeActivity');

function changeActivityToRandomPickFromList(creep, activityList) {
  changeActivity(creep, pickRandomFromList(activityList));
}

module.exports = { changeActivityToRandomPickFromList };
