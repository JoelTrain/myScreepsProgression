const { pickRandomFromList } = require('./common');
const {
    creepIsEmpty,
    creepIsFull,
} = require('./creepCommon');

let callOuts = false;

function activitySetup(creep) {
    if(creep.memory.activity === undefined)
        creep.memory.activity = 'default';
    if(creep.memory.whenEmpty === undefined)
        creep.memory.whenEmpty = 'searching for source';
    if(creep.memory.whenFull === undefined)
        creep.memory.whenFull = 'moving to controller';
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

const activity = {
    'moving to controller': function(creep) {
        const controller = creep.room.controller;
        if(creep.pos.inRangeTo(controller, 3)) {
            changeActivity(creep, 'upgrading controller');
            return;
        }
        creep.moveTo(controller, { visualizePathStyle: {} });
    },
    'upgrading controller': function(creep) {
        if(creepIsEmpty(creep)) {
            changeActivity(creep, creep.memory.whenEmpty);
            return;
        }

        const controller = creep.room.controller;
        const result = creep.upgradeController(controller);

        if(result !== OK){
            changeActivity(creep, 'default');
            return;
        }
    }
};

module.exports = { 
    activity,
    activitySetup,
    changeActivity, 
    changeActivityToRandomPickFromList,
};
