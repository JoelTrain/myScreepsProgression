const { bodyCost } = require('./bodyCost');
const { activitySetup } = require('./activity');
const { pickRandomFromList } = require('./pickRandomFromList');

function spawnType(spawner, type) {
  if (spawner.spawning || spawner.memory.saving) {
    console.log(`${spawner.name} cannot spawn ${type.memory.role} because ${spawner.spawning ? 'spawning' : 'saving'} in progress`);
    return;
  }

  spawner.memory.saving = true;

  const creepNumber = Math.floor(Math.random() * 10000);
  const creepName = `${type.memory.role}${creepNumber}`;
  const spawnResult = spawner.spawnCreep(type.body, creepName, {
    memory: type.memory,
    energyStructures: [
      ...spawner.room.find(FIND_MY_STRUCTURES, { filter: structure => structure.structureType === STRUCTURE_EXTENSION }),
      spawner,
      ...spawner.room.find(FIND_MY_SPAWNS)
    ]
  });
  const string = (spawnResult === 0) ? 'success' : `fail with code ${spawnResult}`;
  const cost = bodyCost(type.body);
  console.log(`${spawner.name} is trying to spawn type:${type.memory.role}, cost:${cost}, name:${creepName}...${string}`);
  logCreepCountsForRoom(spawner.room);
  if (spawnResult === OK) {
    // @TODO need to re-evaluate this section, might not be safe
    spawner.room.memory.spawnScheduled = true;
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

    if (newestCreep.memory.dropoffPos === undefined
      || newestCreep.memory.dropoffPos.roomName != spawner.room.name)
      newestCreep.memory.dropoffPos = { x, y, roomName } = spawner.pos;

    console.log(newestCreep.name, newestCreep.memory.dropoffPos.roomName, 'dropoff room because of', spawner.room.name);
    if (newestCreep.memory.dropoffPos.roomName != spawner.room.name) {
      const message = `Created creep ${creep.name} but dropoff pos ${newestCreep.memory.dropoffPos.roomName
        } does not match spawner, ${spawner.name}, pos ${spawner.room.name}`;
      console.log('notifying', message);
      Game.notify(message);
    }

    activitySetup(newestCreep);
  }
}

module.exports = { spawnType };
