const { creepTypes } = require('./creepTypes');

global.totalCreepCount = function(){
    let count = 0;
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        count++;
    }
    return count;
}

global.updateCurrentCreepCounts = function() {
    for(const typeVal of Object.values(creepTypes)) {
        typeVal.currentCount = 0;
    }

    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        creepTypes[creep.memory.role].currentCount++;
    }
}

global.countCreepsOfType = function(type){
    let count = 0;
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        if(creep.memory.role === type.memory.role)
            count++;
    }
    return count;
}

global.logCreepCounts = function(){
    console.log('Num creeps', Object.keys(Game.creeps).length);
    for(const type of Object.values(creepTypes)) {
        console.log(type.memory.role, countCreepsOfType(type));
    }
}

global.printEachActivity = function() {
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        console.log(creep.id, creep.memory.role, creep.memory.activity);
    }
}
