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
        try {
          roleSpawn.run(spawn);
        }
        catch (error) {
          errorMessage += error.message;
        }
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
        try {
          dispatch[creep.memory.role](creep);
        }
        catch (error) {
          errorMessage += error.message;
        }
    }
}

function main() {
    errorMessage = '';
    try {
        freeOldMem();
    }
    catch (error) {
        errorMessage += error.message;
    }
    try {
        spawn();
    }
    catch (error) {
        errorMessage += error.message;
    }
    try {
        dispatchCreeps();
    }
    catch (error) {
        errorMessage += error.message;
    }
    if(errorMessage.length)
        throw Error(errorMessage + ' at time:', currentTimeString());
}

module.exports.loop = main;
