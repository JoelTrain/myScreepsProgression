const { pickRandomFromList } = require('./common');

let callOuts = false;

function activitySetup(creep) {
    if(creep.memory.activity === undefined)
        changeActivity(creep, 'default');
}

function changeActivity(creep, newActivity) {
    if(creep.memory.activity === newActivity)
        return;
    
    if(callOuts)
        creep.say(newActivity);

    creep.memory.activity = newActivity;    
}

function changeActivityToRandomPickFromList(creep, activityList) {
    changeActivity(creep, pickRandomFromList(activityList));
}

module.exports = { 
    activitySetup,
    changeActivity, 
    changeActivityToRandomPickFromList,
};
