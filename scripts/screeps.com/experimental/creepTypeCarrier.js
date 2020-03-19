const creepTypeCarrier = {
  body: [MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
  memory: {
    role: 'carrier',
    activity: 'pickup',
    whenFull: 'transfer',
    whenEmpty: 'pickup',
  },
  maxCount: 2,
};

module.exports = { creepTypeCarrier };
