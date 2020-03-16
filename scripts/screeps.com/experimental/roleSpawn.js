const { creepTypes } = require('./creepTypes');
const { creepTypesPerRoom } = require('./creepTypesPerRoom');
const { spawnType } = require('./spawnType');
const { bodyCost } = require('./bodyCost');

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

  let creepTypesForThisRoom = creepTypesPerRoom[spawner.room.name];
  if (!creepTypesForThisRoom)
    creepTypesForThisRoom = creepTypes;

  const typeVals = Object.values(creepTypesForThisRoom);
  if (typeVals.length < 1)
    return;

  const countsForThisRoom = { total: 0 };
  for (const typeKey of Object.keys(creepTypesForThisRoom)) {
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
    if (costOfBody > roomMax && countsForThisRoom['basic'] < 10)
      spawnType(spawner, creepTypesForThisRoom.basic);
    if (costOfBody > currentEnergy)
      break;
    if (typeToBuild.memory.role === 'basic')
      continue;
    spawnType(spawner, typeToBuild);
    return;
  }

  if (countsForThisRoom.total < 5 && currentEnergy >= bodyCost(creepTypesForThisRoom.basic.body)) {
    Game.notify(`Uh oh we are making basic creeps at ${currentTimeString()} in ${spawner.room.name}`, 120);
    console.log('Sending Email!');
    spawnType(spawner, creepTypesForThisRoom.basic);
  }
}

module.exports = { runSpawn };
