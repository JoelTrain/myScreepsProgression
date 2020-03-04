let workCarryMoveBody = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];

const creepTypes = {
    harvester: {
        body: workCarryMoveBody,
        memory: { role: "harvester", activity: 'default' },
        maxCount: 8,
    },
    builder: {
        body: workCarryMoveBody,
        memory: { role: "builder", activity: 'default' },
        maxCount: 3,
    },
    upgrader: {
        body: workCarryMoveBody,
        memory: { role: "upgrader", activity: 'default' },
        maxCount: 3,
    },
    manual: {
        body: [CLAIM, MOVE, MOVE, CARRY],
        memory: { role: "manual", activity: 'default' },
        maxCount: 0,
    },
};

module.exports = { creepTypes };
