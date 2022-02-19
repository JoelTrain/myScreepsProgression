const small = {
  body: [WORK, WORK, WORK, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY],
  memory: {
    role: 'upgrader',
    activity: 'withdraw',
    whenFull: 'upgrade',
    whenEmpty: 'withdraw',
  },
  maxCount: 1,
};

const medium = {
  body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE,],
  memory: {
    role: 'upgrader',
    activity: 'withdraw',
    whenFull: 'upgrade',
    whenEmpty: 'withdraw',
  },
  maxCount: 4,
};

const large = {
  body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, CARRY, MOVE,],
  memory: {
    role: 'upgrader',
    activity: 'withdraw',
    whenFull: 'upgrade',
    whenEmpty: 'withdraw',
  },
  maxCount: 4,
};

const creepTypeUpgrader = {
  small: small,
  medium: medium,
  large: large,
};

module.exports = { creepTypeUpgrader };
