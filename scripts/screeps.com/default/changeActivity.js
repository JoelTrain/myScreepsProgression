const { clearTarget } = require('./clearTarget');

let callOuts = true;
function changeActivity(creep, newActivity) {
  if (creep.memory.activity === newActivity)
    return;
    
  clearTarget(creep);

  if (callOuts)
    creep.say(newActivity);

  creep.memory.activity = newActivity;
}

module.exports = { changeActivity };
