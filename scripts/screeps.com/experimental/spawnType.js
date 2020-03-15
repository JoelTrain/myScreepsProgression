const { bodyCost } = require('./bodyCost');
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

module.exports = { spawnType };
