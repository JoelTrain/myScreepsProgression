require('./global');
const { roleHarvester } = require('./roleHarvester');
const { roleUpgrader } = require('./roleUpgrader');
const { roleBuilder } = require('./roleBuilder');
const { roleManual } = require('./roleManual');
const { roleSpawn } = require('./roleSpawn');

function main() {
    try {
        for(var i in Memory.creeps) {
            const creep = Game.creeps[i];
            if(!creep) {
                delete Memory.creeps[i];
                continue;
            }
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
    catch (error) {
        error.message = error.message.concat(' at time:', currentTimeString());
        throw error;
    }
}

module.exports.loop = main;
