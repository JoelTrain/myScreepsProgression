const small = {
  body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE,],
  memory: {
    role: 'heavyHarvester',
    activity: 'harvest in place',
    whenFull: 'harvest in place',
    whenEmpty: 'harvest in place',
  },
  maxCount: 0,
};

const medium = {
  body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE,],
  memory: {
    role: 'heavyHarvester',
    activity: 'harvest in place',
    whenFull: 'harvest in place',
    whenEmpty: 'harvest in place',
  },
  maxCount: 2,
};

const large = {
  body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE, MOVE, MOVE,],
  memory: {
    role: 'heavyHarvester',
    activity: 'harvest in place',
    whenFull: 'harvest in place',
    whenEmpty: 'harvest in place',
  },
  maxCount: 2,
};

const creepTypeHeavyHarvester = {
  small: small,
  medium: medium,
  large: large,
};

module.exports = { creepTypeHeavyHarvester };
