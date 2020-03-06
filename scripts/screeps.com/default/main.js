require('./global');
const { runCommon } = require('./roleCommon');
const { roleUpgrader } = require('./roleUpgrader');
const { runBuilder } = require('./roleBuilder');
const { roleSpawn } = require('./roleSpawn');


function freeOldMem() {
    if(Object.keys(Game.creeps).length < 5)
      Game.notify('low creeps!', 20);
    for(var i in Memory.creeps) {
        const creep = Game.creeps[i];
        if(!creep) {
            delete Memory.creeps[i];
            continue;
        }
    }
}

function spawn() {
    for(const spawn of Object.values(Game.spawns)){
        roleSpawn.run(spawn);
    }
}

const dispatch = {
    harvester: runCommon,
    builder: runBuilder,
    upgrader: roleUpgrader.run,
    basic: runCommon,
};

function dispatchCreeps() {
    for(const creep of Object.values(Game.creeps)){
        dispatch[creep.memory.role](creep);
    }
}

function main() {
    try {
        freeOldMem();
        spawn();
        dispatchCreeps();
    }
    catch (error) {
        error.message = error.message.concat(' at time:', currentTimeString());
        throw error;
    }
}

module.exports.loop = main;
