const creepTypeHeavyHarvester = {
  body: [WORK, WORK, WORK, WORK, WORK, MOVE],
  memory: {
    role: 'heavyHarvester',
    activity: 'harvest in place',
    whenFull: 'harvest in place',
    whenEmpty: 'harvest in place',
  },
  maxCount: 2,
};

module.exports = { creepTypeHeavyHarvester };
