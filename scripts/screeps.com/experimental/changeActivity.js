let callOuts = true;
function changeActivity(creep, newActivity) {
  if (creep.memory.activity === newActivity)
    return;

  if (callOuts)
    creep.say(newActivity);

  creep.memory.activity = newActivity;
  creep.memory.changedActivity = true;
  creep.memory.ready = true;
  delete creep.memory._move;
}

module.exports = { changeActivity };
