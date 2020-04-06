const small = {
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

const medium = {
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

const large = {
  body: new Array(50).fill(MOVE, 0, 25).fill(ATTACK, 25, 48).fill(HEAL, 48, 49).fill(RANGED_ATTACK, 49),
  memory: {
    role: 'attacker',
    activity: 'attack',
    whenFull: 'attack',
    whenEmpty: 'attack',
    rallyPoint: 'AttackMove',
  },
  maxCount: 0,
};

const creepTypeAttacker = {
  small: small,
  medium: medium,
  large: large,
};

module.exports = { creepTypeAttacker };
