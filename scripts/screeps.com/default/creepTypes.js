const basicBody = [WORK, CARRY, MOVE, ATTACK];
const workCarryMoveBody = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

const creepTypes = {
  basic: {
    body: basicBody,
    memory: {
      role: 'basic',
      activity: 'default',
      whenFull: 'transferring',
      whenEmpty: 'pickup',
    },
    spawnDirections: [BOTTOM],
    maxCount: 0,
  },
  defender: {
    body: [TOUGH, TOUGH, TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK, MOVE],
    memory: {
      role: 'defender',
      activity: 'attack',
      whenFull: 'attack',
      whenEmpty: 'attack',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM, BOTTOM, BOTTOM_RIGHT],
    maxCount: 0,
  },
  harvester: {
    body: workCarryMoveBody,
    memory: {
      role: 'harvester',
      activity: 'default',
      whenFull: 'transferring',
      whenEmpty: 'pickup',
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 4,
  },
  heavyHarvester: {
    body: [WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, WORK, MOVE],
    memory: {
      role: 'heavyHarvester',
      activity: 'harvest in place',
      whenFull: 'harvest in place',
      whenEmpty: 'harvest in place',
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 5,
  },
  attacker: {
    body: [TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK],
    memory: {
      role: 'attacker',
      activity: 'attack',
      whenFull: 'attack',
      whenEmpty: 'attack',
      rallyPoint: 'AttackMove',
    },
    spawnDirections: [BOTTOM, BOTTOM, BOTTOM_RIGHT],
    maxCount: 0,
  },
  builder: {
    body: workCarryMoveBody,
    memory: {
      role: 'builder',
      activity: 'default',
      whenFull: 'building site',
      whenEmpty: 'pickup',
    },
    spawnDirections: [BOTTOM],
    maxCount: 2,
  },
  upgrader: {
    body: workCarryMoveBody,
    memory: {
      role: 'upgrader',
      activity: 'default',
      whenFull: 'upgrading controller',
      whenEmpty: 'pickup',
    },
    spawnDirections: [BOTTOM],
    maxCount: 4,
  },
  manual: {
    body: [CLAIM, MOVE, MOVE, MOVE, WORK, CARRY],
    memory: {
      role: 'manual',
      activity: 'default',
      whenFull: 'upgrading controller',
      whenEmpty: 'pickup',
    },
    spawnDirections: [BOTTOM],
    maxCount: 0,
  },
};

module.exports = { creepTypes };
