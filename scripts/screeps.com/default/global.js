const { creepTypes } = require('./creepTypes');
global.currentTimeString = function() {
    const d = new Date();
    const offset = (-6 * 60 * 60 * 1000);
    const n = new Date(d.getTime() + offset).toTimeString();
    
    return n.replace('GMT+0000 (Coordinated Universal Time)', '');
};

global.totalCreepCount = function(){
    return Game.creeps.reduce((count) => count + 1);
};

global.updateCurrentCreepCounts = function() {
    for(const typeVal of Object.values(creepTypes)) {
        typeVal.currentCount = 0;
    }

    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        creepTypes[creep.memory.role].currentCount++;
    }
};

global.countCreepsOfType = function(type){
    let count = 0;
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        if(creep.memory.role === type.memory.role)
            count++;
    }
    return count;
};

global.logCreepCounts = function(){
    updateCurrentCreepCounts();
    console.log('Num creeps', Object.keys(Game.creeps).length);
    for(const type of Object.values(creepTypes)) {
        console.log(type.memory.role, `${type.currentCount}/${type.maxCount}`);
    }
};

global.printEachActivity = function() {
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        console.log(creep.id, creep.memory.role, creep.memory.activity);
    }
};
