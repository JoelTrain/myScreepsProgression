const basicBody = [WORK, CARRY, MOVE, MOVE];
const workCarryMoveBody = [WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

const creepTypes = {
  basic: {
    body: basicBody,
    memory: {
      role: 'basic',
      activity: 'pickup',
      whenFull: 'transfer',
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
    },
    spawnDirections: [BOTTOM, BOTTOM, BOTTOM_RIGHT],
    maxCount: 0,
  },
  harvester: {
    body: workCarryMoveBody,
    memory: {
      role: 'harvester',
      activity: 'harvest',
      whenFull: 'transfer',
      whenEmpty: 'harvest',
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
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 2,
  },
  carrier: {
    body: [MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY, CARRY],
    memory: {
      role: 'carrier',
      activity: 'pickup',
      whenFull: 'transfer',
      whenEmpty: 'pickup',
    },
    spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
    maxCount: 3,
  },
  attacker: {
    body: [TOUGH, MOVE, MOVE, MOVE, MOVE, MOVE, ATTACK, ATTACK, RANGED_ATTACK, HEAL],
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
      activity: 'withdraw',
      whenFull: 'build',
      whenEmpty: 'withdraw',
    },
    spawnDirections: [BOTTOM],
    maxCount: 3,
  },
  remoteBuilder: {
    body: workCarryMoveBody,
    memory: {
      role: 'remoteBuilder',
      activity: 'move to rally point',
      whenFull: 'build',
      whenEmpty: 'harvest',
    },
    spawnDirections: [BOTTOM],
    maxCount: 0,
  },
  upgrader: {
    body: workCarryMoveBody,
    memory: {
      role: 'upgrader',
      activity: 'withdraw',
      whenFull: 'upgrade',
      whenEmpty: 'withdraw',
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
    },
    spawnDirections: [BOTTOM],
    maxCount: 0,
  },
};

module.exports = { creepTypes };
