const { workCarryMoveBody } = require('./workCarryMoveBody');

const tiny = {
  body: workCarryMoveBody(8),
  memory: {
    role: 'builder',
    activity: 'withdraw',
    whenFull: 'build',
    whenEmpty: 'withdraw',
  },
  maxCount: 3,
};

const small = {
  body: workCarryMoveBody(12),
  memory: {
    role: 'builder',
    activity: 'withdraw',
    whenFull: 'build',
    whenEmpty: 'withdraw',
  },
  maxCount: 3,
};

const medium = {
  body: workCarryMoveBody(8),
  memory: {
    role: 'builder',
    activity: 'withdraw',
    whenFull: 'build',
    whenEmpty: 'withdraw',
  },
  maxCount: 3,
};

const large = {
  body: workCarryMoveBody(16),
  memory: {
    role: 'builder',
    activity: 'withdraw',
    whenFull: 'build',
    whenEmpty: 'withdraw',
  },
  maxCount: 3,
};

const max = {
  body: workCarryMoveBody(16),
  memory: {
    role: 'builder',
    activity: 'withdraw',
    whenFull: 'build',
    whenEmpty: 'withdraw',
  },
  maxCount: 3,
};

const creepTypeBuilder = {
  tiny: tiny,
  small: small,
  medium: medium,
  large: large,
  max: max,
};

module.exports = { creepTypeBuilder };
