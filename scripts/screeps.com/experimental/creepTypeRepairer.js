const { workCarryMoveBody } = require('./workCarryMoveBody');

const creepTypeRepairer = {
  body: workCarryMoveBody(16),
  memory: {
    role: 'repairer',
    activity: 'withdraw',
    whenFull: 'repair',
    whenEmpty: 'withdraw',
  },
  maxCount: 1,
};

module.exports = { creepTypeRepairer };
