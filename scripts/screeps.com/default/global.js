const { creepTypes } = require('./creepTypes');
const { bodyCost } = require('./creepCommon');

global.bodyCost = bodyCost;
global.roomCapacities = function () {
  const returnArr = [];
  for (const room of Object.values(Game.rooms)) {
    returnArr.push(`${room.name} ${room.energyAvailable}/${room.energyCapacityAvailable}\n`);
  }
  return returnArr;
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

global.creepsCounted = false;
global.updateCurrentCreepCounts = function () {
  if (creepsCounted)
    return;

  for (const typeVal of Object.values(creepTypes)) {
    typeVal.currentCount = 0;
  }

  for (const creepHash in Game.creeps) {
    const creep = Game.creeps[creepHash];
    creepTypes[creep.memory.role].currentCount++;
  }
  creepsCounted = true;
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

global.printEachActivity = function () {
  for (const creepHash in Game.creeps) {
    const creep = Game.creeps[creepHash];
    console.log(creep.id, creep.memory.role, creep.memory.activity);
  }
};

global.try = function () {

};

global.errorMessage = '';
