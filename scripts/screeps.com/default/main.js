require('./global');
const { roleCommon } = require('./roleCommon');
const { roleUpgrader } = require('./roleUpgrader');
const { roleBuilder } = require('./roleBuilder');
const { roleSpawn } = require('./roleSpawn');

const dispatch = {
    harvester: roleCommon.run,
    builder: roleBuilder.run,
    upgrader: roleUpgrader.run,
};

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
                roleCommon.run(creep);
            if(creep.memory.role === 'builder')
                roleBuilder.run(creep);
            if(creep.memory.role === 'upgrader')
                roleUpgrader.run(creep);
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
