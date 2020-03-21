const basicBody = [WORK, CARRY, MOVE, MOVE];

const creepTypeBasic = {
  body: basicBody,
  memory: {
    role: 'basic',
    activity: 'withdraw', // single withdraw to kick start
    whenFull: '',
    whenEmpty: 'pickup', // after we get going pickups will be faster without withdraw
  },
  maxCount: 0,
};

module.exports = { creepTypeBasic };
