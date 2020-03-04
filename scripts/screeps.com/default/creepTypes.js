let workCarryMoveBody = [WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE, MOVE];

const creepTypes = {
    harvester: {
        body: workCarryMoveBody,
        memory: { role: "harvester" },
        maxCount: 8,
    },
    builder: {
        body: workCarryMoveBody,
        memory: { role: "builder" },
        maxCount: 3,
    },
    upgrader: {
        body: workCarryMoveBody,
        memory: { role: "upgrader" },
        maxCount: 0,
    }
};

module.exports = { creepTypes };
