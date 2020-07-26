const creepTypeHeavyCarrier = {
  body: new Array(50).fill(MOVE, 0, 17).fill(CARRY, 17),
  memory: {
    role: 'carrier',
    activity: 'pickup',
    whenFull: 'transfer',
    whenEmpty: 'pickup',
  },
  maxCount: 2,
};

module.exports = { creepTypeHeavyCarrier };
