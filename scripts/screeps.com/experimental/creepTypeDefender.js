const creepTypeDefender = {
  body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK, MOVE],
  memory: {
    role: 'defender',
    activity: 'attack',
    whenFull: 'attack',
    whenEmpty: 'attack',
  },
  maxCount: 0,
};

module.exports = { creepTypeDefender };
