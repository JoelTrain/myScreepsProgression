const { creepTypes } = require('./creepTypes');
const { roleHarvester } = require('./roleHarvester');
const { roleUpgrader } = require('./roleUpgrader');
const { roleBuilder } = require('./roleBuilder');
const { roleSpawn } = require('./roleSpawn');
const { roleManual } = require('./roleManual');


function loop() {
    const time = Game.time;
    for(var i in Memory.creeps) {
        const creep = Game.creeps[i];
        if(!creep) {
            delete Memory.creeps[i];
            continue;
        }

        if(creep.memory._move && time > creep.memory._move.time)
            delete creep.memory._move;
    }
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        
        if(creep.memory.role === 'harvester')
            roleHarvester.run(creep);
            
        if(creep.memory.role === 'builder')
            roleBuilder.run(creep);
            
        if(creep.memory.role === 'upgrader')
            roleUpgrader.run(creep);
            
        if(creep.memory.role === 'manual')
            roleManual.run(creep);
    }
    for(const spawnHash in Game.spawns){
        const spawn = Game.spawns[spawnHash];
        roleSpawn.run(spawn);
    }
}
function totalCreepCount(){
    let count = 0;
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        count++;
    }
    return count;
}

function countCreepsOfType(type){
    let count = 0;
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        if(creep.memory.role === type.memory.role)
            count++;
    }
    return count;
}

function logCreepCounts(){
    console.log(
        'Num creeps', totalCreepCount(), 
        'Harvester count', countCreepsOfType(creepTypes.harvester),
        'Builder count', countCreepsOfType(creepTypes.builder),
        'Upgrader count', countCreepsOfType(creepTypes.upgrader),
    );
}

function printEachActivity() {
    for(const creepHash in Game.creeps){
        const creep = Game.creeps[creepHash];
        console.log(creep.id, creep.memory.role, creep.memory.activity);
    }
}

global.creepTypes = creepTypes;
global.totalCreepCount = totalCreepCount;
global.countCreepsOfType = countCreepsOfType;
global.logCreepCounts = logCreepCounts;
global.printEachActivity = printEachActivity;

module.exports.loop = loop;
