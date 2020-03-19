const basicBody = [WORK, CARRY, MOVE, MOVE];

const creepTypeBasic = {
  body: basicBody,
  memory: {
    role: 'basic',
    activity: 'pickup',
    whenFull: 'transfer',
    whenEmpty: 'pickup',
  },
  maxCount: 0,
};

module.exports = { creepTypeBasic };
