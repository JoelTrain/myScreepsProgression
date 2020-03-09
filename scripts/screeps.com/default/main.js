require('./global');
const { runCommon } = require('./roleCommon');
const { runBuilder } = require('./roleBuilder');
const { runCarrier } = require('./roleCarrier');
const { runSpawn } = require('./roleSpawn');


function freeOldMem() {
  if (Object.keys(Game.creeps).length < 5)
    Game.notify('low creeps!', 120);
  for (var i in Memory.creeps) {
    const creep = Game.creeps[i];
    if (!creep) {
      delete Memory.creeps[i];
      continue;
    }
  }
}

function spawns() {
  for (const spawn of Object.values(Game.spawns)) {
    try {
      runSpawn(spawn);
    }
    catch (error) {
      //errorMessage += error.message;
      errorMessage += error.stack + '\n';
    }
  }
}

function towers() {
  for (const tower of Object.values(Game.structures)) {
    try {
      if (tower.structureType !== STRUCTURE_TOWER)
        continue;
      tower.memory = {
        role: 'tower',
        activity: 'tower attack',
      };
      runCommon(tower);
    }
    catch (error) {
      //errorMessage += error.message;
      errorMessage += error.stack + '\n';
    }
  }
}

const dispatch = {
  heavyHarvester: runCommon,
  harvester: runCommon,
  builder: runBuilder,
  upgrader: runCommon,
  basic: runCommon,
  defender: runCommon,
  attacker: runCommon,
  carrier: runCarrier,
};

function dispatchCreeps() {
  for (const creep of Object.values(Game.creeps)) {
    try {
      if (!creep.spawning)
        dispatch[creep.memory.role](creep);
    }
    catch (error) {
      //errorMessage += error.message;
      errorMessage += error.stack + '\n';
    }
  }
}

function main() {
  errorMessage = '';
  try {
    creepsCounted = false;
    freeOldMem();
  }
  catch (error) {
    //errorMessage += error.message;
    errorMessage += error.stack + '\n';
  }
  try {
    spawns();
  }
  catch (error) {
    //errorMessage += error.message;
    errorMessage += error.stack + '\n';
  }
  try {
    towers();
  }
  catch (error) {
    //errorMessage += error.message;
    errorMessage += error.stack + '\n';
  }
  try {
    dispatchCreeps();
  }
  catch (error) {
    //errorMessage += error.message;
    errorMessage += error.stack + '\n';
  }
  if (errorMessage.length)
    throw Error(`At time: ${currentTimeString()} ${errorMessage}`);
}

module.exports.loop = main;
