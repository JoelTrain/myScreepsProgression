function activitySetup(creep) {
  if (creep.memory.activity === undefined)
    creep.memory.activity = creep.memory.whenEmpty;
  if (creep.memory.whenEmpty === undefined)
    creep.memory.whenEmpty = 'pickup';
  if (creep.memory.whenFull === undefined)
    creep.memory.whenFull = 'upgrading controller';
}

module.exports = { activitySetup };
