const creepTypeUpgrader = {
  body: [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE],
  memory: {
    role: 'upgrader',
    activity: 'withdraw',
    whenFull: 'upgrade',
    whenEmpty: 'withdraw',
  },
  maxCount: 4,
};

module.exports = { creepTypeUpgrader };
