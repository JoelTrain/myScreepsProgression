require('./global');
const { runCommon } = require('./roleCommon');
const { roleUpgrader } = require('./roleUpgrader');
const { runBuilder } = require('./roleBuilder');
const { runSpawn } = require('./roleSpawn');


function freeOldMem() {
  if (Object.keys(Game.creeps).length < 5)
    Game.notify('low creeps!', 20);
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
      errorMessage += error.message;
      errorMessage += error.stack;
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
      errorMessage += error.message;
      errorMessage += error.stack;
    }
  }
}

const dispatch = {
  harvester: runCommon,
  builder: runBuilder,
  upgrader: roleUpgrader.run,
  basic: runCommon,
  defender: runCommon,
  attacker: runCommon,
};

function dispatchCreeps() {
  for (const creep of Object.values(Game.creeps)) {
    try {
      dispatch[creep.memory.role](creep);
    }
    catch (error) {
      errorMessage += error.message;
      errorMessage += error.stack;
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
    errorMessage += error.stack;
  }
  try {
    spawns();
  }
  catch (error) {
    errorMessage += error.message;
    errorMessage += error.stack;
  }
  try {
    towers();
  }
  catch (error) {
    errorMessage += error.message;
    errorMessage += error.stack;
  }
  try {
    dispatchCreeps();
  }
  catch (error) {
    errorMessage += error.message;
    errorMessage += error.stack;
  }
  if (errorMessage.length)
    throw Error(errorMessage + ' at time:', currentTimeString());
}

module.exports.loop = main;
