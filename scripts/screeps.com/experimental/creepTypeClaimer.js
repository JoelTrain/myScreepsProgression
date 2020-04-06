const small = {
  body: [MOVE, MOVE, CLAIM, CLAIM],
  memory: {
    role: 'claimer',
    activity: 'move to position',
    whenFull: 'attack',
    whenEmpty: 'attack',
    whenArrive: 'attack',
  },
};

const medium = {
  body: [MOVE, MOVE, CLAIM, CLAIM],
  memory: {
    role: 'claimer',
    activity: 'move to position',
    whenFull: 'attack',
    whenEmpty: 'attack',
    whenArrive: 'attack',
  },
};

const large = {
  body: new Array(10).fill(MOVE, 0, 5).fill(CLAIM, 5),
  memory: {
    role: 'claimer',
    activity: 'move to position',
    whenFull: 'attack',
    whenEmpty: 'attack',
    whenArrive: 'attack',
  },
};

const creepTypeClaimer = {
  small: small,
  medium: medium,
  large: large,
};

module.exports = { creepTypeClaimer };
