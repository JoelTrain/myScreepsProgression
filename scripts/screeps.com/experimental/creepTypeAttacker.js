const creepTypeAttacker = {
  body: [MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK, HEAL],
  memory: {
    role: 'attacker',
    activity: 'attack',
    whenFull: 'attack',
    whenEmpty: 'attack',
    rallyPoint: 'AttackMove',
  },
  maxCount: 0,
};

module.exports = { creepTypeAttacker };
