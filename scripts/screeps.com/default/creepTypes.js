let workCarryMoveBody = [WORK, WORK, WORK, WORK, WORK, WORK, CARRY, CARRY, CARRY, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE, MOVE];

const creepTypes = {
    harvester: {
        body: workCarryMoveBody,
        memory: { 
            role: 'harvester', 
            activity: 'default', 
            whenFull: 'moving to structures',
            whenEmpty: 'searching for source',
        },
        maxCount: 8,
    },
    builder: {
        body: workCarryMoveBody,
        memory: { 
            role: 'builder', 
            activity: 'default', 
            whenFull: 'moving to structures',
            whenEmpty: 'searching for source',
        },
        maxCount: 0,
    },
    upgrader: {
        body: workCarryMoveBody,
        memory: { 
            role: 'upgrader', 
            activity: 'default', 
            whenFull: 'moving to structures', 
            whenEmpty: 'searching for source',
        },
        maxCount: 0,
    },
    manual: {
        body: [CLAIM, MOVE, MOVE, MOVE, WORK, CARRY],
        memory: { role: 'manual', activity: 'default' },
        maxCount: 0,
    },
};

module.exports = { creepTypes };
