const creepTypeClaimer = {
  body: [MOVE, MOVE, CLAIM, CLAIM],
  memory: {
    role: 'claimer',
    activity: 'move to position',
    whenFull: 'attack',
    whenEmpty: 'attack',
    whenArrive: 'attack',
  },
};

module.exports = { creepTypeClaimer };
