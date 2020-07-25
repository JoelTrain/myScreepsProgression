const { creepTypes } = require('./creepTypes');
const { creepCountsPerRoom } = require('./creepCountsPerRoom');
const { bodyCost } = require('./bodyCost');

global.creepTypes = creepTypes;
global.bodyCost = bodyCost;
global.roomCapacities = function () {
  const returnArr = [];
  for (const room of Object.values(Game.rooms)) {
    returnArr.push(`${room.name} ${room.energyAvailable}/${room.energyCapacityAvailable}\n`);
  }
  return returnArr;
};

global.setRallyPointOnType = function (typeName, flagName) {
  for (const creep of Object.values(Game.creeps)) {
    if (creep.memory.role === typeName)
      creep.memory.rallyPoint = flagName;
  }
};

global.setTargetPosOnType = function (typeName, flagName) {
  const flag = Game.flags[flagName];
  if (!flag)
    return;
  for (const creep of Object.values(Game.creeps)) {
    if (creep.memory.role === typeName)
      creep.memory.targetPos = flag.pos;
  }
};

global.setActivityOnType = function (typeName, activityName) {
  for (const creep of Object.values(Game.creeps)) {
    if (creep.memory.role === typeName)
      creep.memory.activity = activityName;
  }
};

global.currentTimeString = function () {
  const d = new Date();
  const offset = (-6 * 60 * 60 * 1000);
  const n = new Date(d.getTime() + offset).toTimeString();

  return n.replace('GMT+0000 (Coordinated Universal Time)', '');
};

global.totalCreepCount = function () {
  return Object.keys(Game.creeps).length;
};

global.changeAllWhenEmpty = function (newTask) {
  for (const creep of Object.values(Game.creeps)) {
    creep.memory.whenEmpty = newTask;
  }
};

global.creepsCounted = false;
global.updateCurrentCreepCounts = function () {
  if (creepsCounted)
    return;

  for (const typeVal of Object.values(creepTypes)) {
    typeVal.currentCount = 0;
  }

  for (const creepHash in Game.creeps) {
    const creep = Game.creeps[creepHash];
    if (creepTypes[creep.memory.role])
      creepTypes[creep.memory.role].currentCount++;
  }
  creepsCounted = true;
};


global.countCreepsOfTypeInRoom = function (type, room) {
  let count = 0;
  for (const creep of room.find(FIND_MY_CREEPS)) {
    if (creep.memory.role === type.memory.role)
      count++;

  }
  return count;
};

global.countCreepsOfType = function (type) {
  if (creepsCounted)
    return type.currentCount;
  let count = 0;
  for (const creepHash in Game.creeps) {
    const creep = Game.creeps[creepHash];
    if (creep.memory.role === type.memory.role)
      count++;
  }
  return count;
};

global.logCreepCounts = function () {
  updateCurrentCreepCounts();
  console.log('Num creeps', Object.keys(Game.creeps).length);
  for (const type of Object.values(creepTypes)) {
    console.log(type.memory.role, `${type.currentCount}/${type.maxCount}`);
  }
};

global.logCreepCountsForRoom = function (room) {
  const countsForThisRoom = { total: 0 };

  for (const creep of room.find(FIND_MY_CREEPS)) {
    if (countsForThisRoom[creep.memory.role])
      countsForThisRoom[creep.memory.role]++;
    else
      countsForThisRoom[creep.memory.role] = 1;
    countsForThisRoom.total++;
  }

  const creepMaxCountsForRoom = creepCountsPerRoom[room.name];

  let output = `Room: ${room.name} Num creeps: ${countsForThisRoom.total}\n`;
  for (const role of Object.keys(countsForThisRoom)) {
    if (role === 'total')
      continue;

    const currentCount = countsForThisRoom[role];
    let maxCount = 0;
    if (creepMaxCountsForRoom[role])
      maxCount = creepMaxCountsForRoom[role];
    if (currentCount > 0)
      output += `${role} ${currentCount}/${maxCount}\n`;
  }
  console.log(output);
};

global.printEachActivity = function () {
  for (const creepHash in Game.creeps) {
    const creep = Game.creeps[creepHash];
    console.log(creep.id, creep.memory.role, creep.memory.activity);
  }
};

global.try = function () {

};

global.errorMessage = '';
