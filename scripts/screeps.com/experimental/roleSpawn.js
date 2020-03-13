const { creepTypes } = require('./creepTypes');
const { bodyCost } = require('./common');
const { activitySetup } = require('./activity');

function spawnType(spawner, type) {
  const creepNumber = Math.floor(Math.random() * 10000);
  const creepName = `${type.memory.role}${creepNumber}`;
  const spawnResult = spawner.spawnCreep(type.body, creepName, { memory: type.memory, directions: type.spawnDirections });
  const string = (spawnResult === 0) ? 'success' : `fail with code ${spawnResult}`;
  const cost = bodyCost(type.body);
  console.log(`${spawner.name} is trying to spawn type:${type.memory.role}, cost:${cost}, name:${creepName}...${string}`);
  logCreepCountsForRoom(spawner.room);
  if (spawnResult === 0) {
    const newestCreep = Game.creeps[creepName];
    if (!newestCreep)
      throw Error(`Well that's weird. I really thought ${creepName} spawned.`);

    activitySetup(newestCreep);
  }
}

function runSpawn(spawner) {
  if (spawner.spawning)
    return;
  const currentEnergy = spawner.room.energyAvailable;

  const numSources = spawner.room.find(FIND_SOURCES).length;
  creepTypes.heavyHarvester.maxCount = numSources;

  //console.log(`Spawner energy ${currentEnergy}`);
  if (currentEnergy < 200)
    return;

  const enemiesExistInRoom = spawner.room.find(FIND_HOSTILE_CREEPS, {
    filter: function (object) {
      return object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
    }
  }).length;

  if (enemiesExistInRoom)
    creepTypes.defender.maxCount = 9999999;
  else
    creepTypes.defender.maxCount = 0;

  const typeVals = Object.values(creepTypes);
  if (typeVals.length < 1)
    return;

  const countsForThisRoom = { total: 0 };
  for (const typeKey of Object.keys(creepTypes)) {
    countsForThisRoom[typeKey] = 0;
  }

  for (const creep of spawner.room.find(FIND_MY_CREEPS)) {
    countsForThisRoom[creep.memory.role]++;
    countsForThisRoom.total++;
  }

  //typeVals.sort((a,b) => {
  // if(a.maxCount === b.maxCount)
  //     return 0;
  // if(a.maxCount === 0)
  //     return 999999;
  // if(b.maxCount === 0)
  //     return -999999;
  // const aManningFraction = a.currentCount / a.maxCount;
  // const bManningFraction = b.currentCount / b.maxCount;
  // return aManningFraction - bManningFraction;
  //});

  const roomMax = spawner.room.energyCapacityAvailable;

  for (const typeToBuild of typeVals) {
    //const typeToBuild = typeVals[0];
    if (countsForThisRoom[typeToBuild.memory.role] >= typeToBuild.maxCount)
      continue;
    const costOfBody = bodyCost(typeToBuild.body);
    if (costOfBody > roomMax && countsForThisRoom['basic'] < 5)
      spawnType(spawner, creepTypes.basic);
    if (costOfBody > currentEnergy)
      break;
    if (typeToBuild.memory.role === 'basic')
      continue;
    spawnType(spawner, typeToBuild);
    return;
  }

  if (countsForThisRoom.total < 5 && currentEnergy >= bodyCost(creepTypes.basic.body)) {
    Game.notify('Uh oh we are making basic creeps at ' + currentTimeString(), 120);
    console.log('Sending Email!');
    const basicType = creepTypes.basic;
    const prob = Math.random();
    console.log(prob);
    if (prob < 0.2)
      basicType.memory.whenFull = 'upgrading controller';
    else
      basicType.memory.whenFull = 'transferring';
    spawnType(spawner, basicType);
  }
}

module.exports = { runSpawn };
