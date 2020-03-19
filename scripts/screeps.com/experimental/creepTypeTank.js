const creepTypeTank = {
  body: [MOVE, MOVE, MOVE, MOVE, MOVE, HEAL, HEAL, HEAL, HEAL, HEAL],
  memory: {
    role: 'tank',
    activity: 'move to rally point',
    whenFull: 'move to rally point',
    whenEmpty: 'move to rally point',
    rallyPoint: 'TankMove1',
  },
  maxCount: 0,
};

module.exports = { creepTypeTank };
