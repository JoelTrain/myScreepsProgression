function findExtensionsWithFreeSpace(creep) {
    const extensions = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    return extensions;
}

function findMySpawnWithFreeSpace(creep) {
    const spawns = creep.room.find(FIND_MY_STRUCTURES, {
        filter: (structure) => {
            return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
        }
    });
    return spawns;
}

let callOuts = true;

function changeActivity(creep, newActivity) {
    if(creep.memory.activity === newActivity)
        return;
    
    if(callOuts)
        creep.say(newActivity);

    creep.memory.activity = newActivity;    
}

function creepIsEmpty(creep) {
    return creep.store.getUsedCapacity() === 0;
}

function creepHasSpace(creep){
    return creep.store.getFreeCapacity() > 0;
}

function creepIsFull(creep) {
    return creep.store.getFreeCapacity() === 0;
}

const roleHarvester = {
    run: function(creep){
        if(creep.memory.activity === undefined)
            changeActivity(creep, 'searching for source');

        this[creep.memory.activity](creep);
    },
    'searching for source': function(creep) {
        if(creepIsFull(creep)) {
            changeActivity(creep, 'moving to structures');
            return;
        }
        
        const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        
        if(!mySource)
            return;
            
        creep.moveTo(mySource, { visualizePathStyle: {} });
        changeActivity(creep, 'moving to source');
    },
    'moving to source': function(creep) {
        if(creep.memory._move)
            return;
        
        const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    
        if(!mySource) {
            creep.memory.activity = 'searching for source';
            return;
        }
        
        if(creep.pos.inRangeTo(mySource, 1)) {
            changeActivity(creep, 'harvesting from source');
            return;
        }
        creep.moveTo(mySource, { visualizePathStyle: {} });
    },
    'harvesting from source': function(creep) {
        if(creepIsFull(creep)) {
            changeActivity(creep, 'moving to structures');
            return;
        }

        // @TODO improve this
        const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(!mySource) {
            creep.memory.activity = 'searching for source';
            return;
        }
        creep.harvest(mySource);
    },
    'moving to structures': function(creep) {
        if(creep.memory._move)
            return;

        let targets = findExtensionsWithFreeSpace(creep);
        if(targets.length === 0){
            targets = findMySpawnWithFreeSpace(creep);
        }
        if(targets.length === 0) {
            changeActivity(creep, 'moving to controller');
            return;
        }
        const target = targets[0];
        creep.memory.targetId = target.id;
        if(creep.pos.inRangeTo(target, 1)) {
            changeActivity(creep, 'transferring resources');
            return;
        }
        creep.moveTo(target, { visualizePathStyle: {} });
    },
    'transferring resources': function(creep) {
        if(creepIsEmpty(creep)) {
            changeActivity(creep, 'searching for source');
            return;
        }

        const target = Game.getObjectById(creep.memory.targetId);
        if(!target) {
            changeActivity(creep, 'moving to structures');
            return;
        }

        if(creep.transfer(target, RESOURCE_ENERGY) === ERR_FULL){
            changeActivity(creep, 'moving to structures');
        }
    },
    'moving to controller': function(creep) {
        if(creep.memory._move)
            return;

        const controller = creep.room.controller;
        if(creep.pos.inRangeTo(controller, 3)) {
            changeActivity(creep, 'upgrading controller');
            return;
        }
        creep.moveTo(controller, { visualizePathStyle: {} });
    },
    'upgrading controller': function(creep) {
        if(creepIsEmpty(creep)) {
            changeActivity(creep, 'searching for source');
            return;
        }

        const controller = creep.room.controller;
        creep.upgradeController(controller);
    }
};

module.exports = { roleHarvester };
