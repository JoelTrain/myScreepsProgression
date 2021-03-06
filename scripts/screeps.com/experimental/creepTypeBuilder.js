const { workCarryMoveBody } = require('./workCarryMoveBody');

const creepTypeBuilder = {
  body: workCarryMoveBody,
  memory: {
    role: 'builder',
    activity: 'withdraw',
    whenFull: 'build',
    whenEmpty: 'withdraw',
  },
  maxCount: 3,
};

module.exports = { creepTypeBuilder };
