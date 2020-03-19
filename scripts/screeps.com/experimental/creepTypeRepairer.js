const { workCarryMoveBody } = require('./workCarryMoveBody');

const creepTypeRepairer = {
  body: workCarryMoveBody,
  memory: {
    role: 'repairer',
    activity: 'withdraw',
    whenFull: 'repair',
    whenEmpty: 'withdraw',
  },
  maxCount: 1,
};

module.exports = { creepTypeRepairer };
