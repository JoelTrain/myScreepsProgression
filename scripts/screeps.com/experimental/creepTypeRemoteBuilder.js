const { workCarryMoveBody } = require('./workCarryMoveBody');

const creepTypeRemoteBuilder = {
  body: workCarryMoveBody(16),
  memory: {
    role: 'remoteBuilder',
    activity: 'move to rally point',
    whenFull: 'build',
    whenEmpty: 'harvest',
  },
  maxCount: 0,
};

module.exports = { creepTypeRemoteBuilder };
