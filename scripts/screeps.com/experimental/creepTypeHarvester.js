const { workCarryMoveBody } = require('./workCarryMoveBody');

const small = {
  body: [WORK, WORK, WORK, WORK, CARRY, MOVE, MOVE,],
  memory: {
    role: 'harvester',
    activity: 'harvest',
    whenFull: 'transfer',
    whenEmpty: 'harvest',
  },
  maxCount: 0,
};

const medium = {
  body: workCarryMoveBody,
  memory: {
    role: 'harvester',
    activity: 'harvest',
    whenFull: 'transfer',
    whenEmpty: 'harvest',
  },
  maxCount: 0,
};

const large = {
  body: workCarryMoveBody,
  memory: {
    role: 'harvester',
    activity: 'harvest',
    whenFull: 'transfer',
    whenEmpty: 'harvest',
  },
  maxCount: 0,
};

const creepTypeHarvester = {
  small: small,
  medium: medium,
  large: large,
};

module.exports = { creepTypeHarvester };
