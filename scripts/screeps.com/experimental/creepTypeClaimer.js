const creepTypeClaimer = {
  body: [MOVE, MOVE, CLAIM, CLAIM],
  memory: {
    role: 'claimer',
    activity: 'attack',
    whenFull: 'attack',
    whenEmpty: 'attack',
  },
};

module.exports = { creepTypeClaimer };
