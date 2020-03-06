const basicBody = [WORK, CARRY, MOVE];
const workCarryMoveBody = [WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

const creepTypes = {
    basic: {
        body: basicBody,
        memory: { 
            role: 'basic', 
            activity: 'default', 
            whenFull: 'moving to structures',
            whenEmpty: 'searching for source',
        },
        spawnDirections: [BOTTOM],
        maxCount: 0,
    },
    harvester: {
        body: workCarryMoveBody,
        memory: { 
            role: 'harvester', 
            activity: 'default', 
            whenFull: 'moving to structures',
            whenEmpty: 'searching for source',
        },
        spawnDirections: [BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT, BOTTOM_LEFT],
        maxCount: 8,
    },
    defender: {
        body: [MOVE, ATTACK, ATTACK, TOUGH, TOUGH, TOUGH],
        memory: { 
            role: 'defender', 
            activity: 'attack', 
            whenFull: 'attack',
            whenEmpty: 'attack',
        },
        spawnDirections: [BOTTOM, BOTTOM, BOTTOM_RIGHT],
        maxCount: 2,
    },
    builder: {
        body: workCarryMoveBody,
        memory: { 
            role: 'builder', 
            activity: 'default', 
            whenFull: 'moving to structures',
            whenEmpty: 'searching for source',
        },
        spawnDirections: [BOTTOM],
        maxCount: 5,
    },
    upgrader: {
        body: workCarryMoveBody,
        memory: { 
            role: 'upgrader', 
            activity: 'default', 
            whenFull: 'moving to controller', 
            whenEmpty: 'searching for source',
        },
        spawnDirections: [BOTTOM],
        maxCount: 3,
    },
    manual: {
        body: [CLAIM, MOVE, MOVE, MOVE, WORK, CARRY],
        memory: { 
            role: 'manual', 
            activity: 'default', 
            whenFull: 'moving to controller', 
            whenEmpty: 'searching for source',
        },
        spawnDirections: [BOTTOM],
        maxCount: 0,
    },
};

module.exports = { creepTypes };
