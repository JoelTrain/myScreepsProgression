let workCarryMoveBody = [WORK, WORK, WORK, CARRY, MOVE, MOVE, MOVE, MOVE];

const creepTypes = {
    harvester: {
        body: workCarryMoveBody,
        memory: { role: "harvester" },
        maxCount: 8,
    },
    builder: {
        body: workCarryMoveBody,
        memory: { role: "builder" },
        maxCount: 5,
    },
    upgrader: {
        body: workCarryMoveBody,
        memory: { role: "upgrader" },
        maxCount: 0,
    },
    manual: {
        body: workCarryMoveBody,
        memory: { role: "manual" },
        maxCount: 1,
    },
};

module.exports = { creepTypes };
