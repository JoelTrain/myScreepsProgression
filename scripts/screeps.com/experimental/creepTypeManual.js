const creepTypeManual = {
  body: [CLAIM, CLAIM, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, MOVE, WORK, CARRY],
  memory: {
    role: 'manual',
    activity: 'attack',
    whenFull: 'attack',
    whenEmpty: 'attack',
  },
  maxCount: 0,
};

module.exports = { creepTypeManual };
