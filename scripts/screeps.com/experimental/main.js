// const profiler = require('screeps-profiler');

// // This line monkey patches the global prototypes.
// profiler.enable();

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
    spawn.room.memory.spawnScheduled = false;
  }
  for (const spawn of Object.values(Game.spawns)) {
    try {
      if (!spawn.room.memory.spawnScheduled)
        runSpawn(spawn);
    }
    catch (error) {
      if (error && error.stack)
        errorMessage += error.stack + '\n';
    }
  }
}

function links() {
  for (const link of Object.values(Game.structures)) {
    try {
      if (link.structureType !== STRUCTURE_LINK)
        continue;
      link.memory = {
        role: 'link',
        activity: 'link transfer',
      };
      runCommon(link);
    }
    catch (error) {
      if (error && error.stack)
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
      if (error && error.stack)
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

let roleTimes = {};
let activityTimes = {};

function dispatchCreeps() {
  for (const creep of Object.values(Game.creeps)) {
    try {
      if (!creep.spawning && creep.memory.ready) {
        creep.memory.ready = false;

        if (roleTimes[creep.memory.role] === undefined)
          roleTimes[creep.memory.role] = { count: 0, time: 0 };

        const startingActivity = creep.memory.activity;
        if (activityTimes[startingActivity] === undefined)
          activityTimes[startingActivity] = { count: 0, time: 0 };
        const start = Game.cpu.getUsed();
        if (dispatch[creep.memory.role])
          dispatch[creep.memory.role](creep);
        else
          runCommon(creep);
        const end = Game.cpu.getUsed();
        roleTimes[creep.memory.role].time += end - start;
        roleTimes[creep.memory.role].count++;
        activityTimes[startingActivity].time += end - start;
        activityTimes[startingActivity].count++;
      }
    }
    catch (error) {
      errorMessage += error.stack + '\n';
    }
  }
}

function main() {
  //console.log(Game.time, `${Game.cpu.getUsed()}/${Game.cpu.bucket}/${Game.cpu.tickLimit}`);

  global.cachedRoomFinds = {};
  activityTimes = {};
  roleTimes = {};
  errorMessage = '';
  //console.log('Game clock', Game.time);
  try {
    creepsCounted = false;
    freeOldMem();
  }
  catch (error) {
    if (error && error.stack)
      errorMessage += error.stack + '\n';
  }
  try {
    spawns();
  }
  catch (error) {
    if (error && error.stack)
      errorMessage += error.stack + '\n';
  }
  try {
    if (Game.time % 10 === 0)
      assignRemoteHarvesters();
  }
  catch (error) {
    if (error && error.stack)
      errorMessage += error.stack + '\n';
  }
  try {
    towers();
  }
  catch (error) {
    if (error && error.stack)
      errorMessage += error.stack + '\n';
  }
  try {
    links();
  }
  catch (error) {
    if (error && error.stack)
      errorMessage += error.stack + '\n';
  }
  try {
    prepareForDispatch();
    for (let i = 0; i < 3; i++)
      dispatchCreeps();
  }
  catch (error) {
    if (error && error.stack)
      errorMessage += error.stack + '\n';
  }
  // for (const [role, ob] of Object.entries(roleTimes))
  //   console.log(role, ob.count, ob.time);
  // for (const [role, ob] of Object.entries(activityTimes))
  //   console.log(role, ob.count, ob.time);
  if (errorMessage.length) {
    errorMessage = `At time: ${currentTimeString()} ${errorMessage}`;
    Game.notify(errorMessage);
    throw new Error(errorMessage);
  }
  if (Game.time % 10 === 0)
    console.log(Game.time, `${Game.cpu.getUsed()}/${Game.cpu.bucket}/${Game.cpu.tickLimit}`);

}

module.exports.loop = main;

//module.exports.loop = () => profiler.wrap(main);
