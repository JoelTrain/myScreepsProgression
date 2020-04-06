let callOuts = true;
function changeActivity(creep, newActivity) {
  if (creep.memory.activity === newActivity)
    return;

  if (callOuts)
    creep.say(newActivity);

  //console.log(creep.name, newActivity);

  creep.memory.activity = newActivity;
  creep.memory.changedActivity = true;
  creep.memory.ready = true;
}

module.exports = { changeActivity };
