const { workCarryMoveBody } = require('./workCarryMoveBody');

const creepTypeHarvester = {
  body: workCarryMoveBody,
  memory: {
    role: 'harvester',
    activity: 'harvest',
    whenFull: 'transfer',
    whenEmpty: 'harvest',
  },
  maxCount: 0,
};

module.exports = { creepTypeHarvester };
