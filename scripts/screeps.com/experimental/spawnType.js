const { bodyCost } = require('./bodyCost');
const { activitySetup } = require('./activity');
const { pickRandomFromList } = require('./pickRandomFromList');

function spawnType(spawner, type) {
  if (spawner.spawning || spawner.memory.saving) {
    console.log(`${spawner.name} cannot spawn ${type.memory.role} because ${spawner.spawning ? 'spawning' : 'saving'} in progress`);
    return;
  }

  const creepNumber = Math.floor(Math.random() * 10000);
  const creepName = `${type.memory.role}${creepNumber}`;
  const spawnResult = spawner.spawnCreep(type.body, creepName, { memory: type.memory });
  const string = (spawnResult === 0) ? 'success' : `fail with code ${spawnResult}`;
  const cost = bodyCost(type.body);
  console.log(`${spawner.name} is trying to spawn type:${type.memory.role}, cost:${cost}, name:${creepName}...${string}`);
  logCreepCountsForRoom(spawner.room);
  if (spawnResult === 0) {
    spawner.memory.saving = true;
    const newestCreep = Game.creeps[creepName];
    if (!newestCreep)
      throw Error(`Well that's weird. I really thought ${creepName} spawned.`);

    if (newestCreep.memory.role === 'basic') {
      const whenFullActivity = pickRandomFromList(['upgrade', 'repair', 'transfer', 'transfer', 'transfer',]);
      newestCreep.memory.whenFull = whenFullActivity;
    }

    if (spawner.room.name === 'E5S31')
      if (newestCreep.memory.role === 'attacker')
        newestCreep.memory.rallyPoint = 'AttackMove';
      else if (newestCreep.memory.role === 'tank')
        newestCreep.memory.rallyPoint = 'TankMove1';

    if (spawner.room.name === 'E9S32')
      if (newestCreep.memory.role === 'attacker')
        newestCreep.memory.rallyPoint = 'AttackMove2';
      else if (newestCreep.memory.role === 'tank')
        newestCreep.memory.rallyPoint = 'TankMove2';

    activitySetup(newestCreep);
  }
}

module.exports = { spawnType };
