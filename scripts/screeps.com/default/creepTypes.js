const basicBody = [WORK, CARRY, MOVE];
const workCarryMoveBody = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

const creepTypes = {
  basic: {
    body: basicBody,
    memory: {
      role: 'basic',
      activity: 'withdraw',
      whenFull: 'transferring',
      whenEmpty: 'harvest',
      rallyPoint: 'DefenseRallyPoint',
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
      activity: 'harvest',
      whenFull: 'transferring',
      whenEmpty: 'harvest',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 0,
  },
  heavyHarvester: {
    body: [WORK, WORK, WORK, WORK, WORK, MOVE],
    memory: {
      role: 'heavyHarvester',
      activity: 'harvest in place',
      whenFull: 'harvest in place',
      whenEmpty: 'harvest in place',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 4,
  },
  carrier: {
    body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    memory: {
      role: 'carrier',
      activity: 'pickup',
      whenFull: 'transferring',
      whenEmpty: 'pickup',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 2,
  },
  attacker: {
    body: [TOUGH, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK],
    memory: {
      role: 'attacker',
      activity: 'attack',
      whenFull: 'attack',
      whenEmpty: 'attack',
      rallyPoint: 'AttackMove',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM, BOTTOM, BOTTOM_RIGHT],
    maxCount: 0,
  },
  builder: {
    body: workCarryMoveBody,
    memory: {
      role: 'builder',
      activity: 'withdraw',
      whenFull: 'building site',
      whenEmpty: 'withdraw',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM],
    maxCount: 3,
  },
  upgrader: {
    body: workCarryMoveBody,
    memory: {
      role: 'upgrader',
      activity: 'withdraw',
      whenFull: 'upgrading controller',
      whenEmpty: 'withdraw',
      rallyPoint: 'DefenseRallyPoint',
    },
    spawnDirections: [BOTTOM],
    maxCount: 4,
  },
  manual: {
    body: [CLAIM, CLAIM, MOVE, MOVE, RANGED_ATTACK, MOVE, MOVE, MOVE, WORK, CARRY],
    memory: {
      role: 'manual',
      activity: 'attack',
      whenFull: 'attack',
      whenEmpty: 'attack',
      rallyPoint: 'AttackMove',
    },
    spawnDirections: [BOTTOM],
    maxCount: 2,
  },
};

module.exports = { creepTypes };
