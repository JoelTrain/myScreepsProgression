require('./global');
const { runCommon } = require('./roleCommon');
const { runCarrier } = require('./roleCarrier');
const { runSpawn } = require('./roleSpawn');
const { assignRemoteHarvesters } = require('./assignRemoteHarvesters');


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
      errorMessage += error.stack + '\n';
    }
  }
}

function prepareForDispatch() {
  for (const creep of Object.values(Game.creeps)) {
    creep.memory.ready = true;
    creep.memory.changedActivity = false;
  }
}

const dispatch = {
  carrier: runCarrier,
};

function dispatchCreeps() {
  for (const creep of Object.values(Game.creeps)) {
    try {
      if (!creep.spawning && creep.memory.ready) {
        creep.memory.ready = false;
        if (dispatch[creep.memory.role])
          dispatch[creep.memory.role](creep);
        else
          runCommon(creep);
      }
    }
    catch (error) {
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
    errorMessage += error.stack + '\n';
  }
  try {
    if (Game.time % 10 === 0)
      assignRemoteHarvesters();
  }
  catch (error) {
    errorMessage += error.stack + '\n';
  }
  try {
    spawns();
  }
  catch (error) {
    errorMessage += error.stack + '\n';
  }
  try {
    towers();
  }
  catch (error) {
    errorMessage += error.stack + '\n';
  }
  try {
    prepareForDispatch();
    for (let i = 0; i < 3; i++)
      dispatchCreeps();
  }
  catch (error) {
    errorMessage += error.stack + '\n';
  }
  if (errorMessage.length) {
    errorMessage = `At time: ${currentTimeString()} ${errorMessage}`;
    Game.notify(errorMessage, 120);
    throw Error(errorMessage);
  }
}

module.exports.loop = main;
