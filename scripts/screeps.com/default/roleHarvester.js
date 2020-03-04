const { activitySetup, changeActivity } = require('./activity');
const {
    creepIsEmpty,
    creepIsFull,
} = require('./creepCommon');

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

const roleHarvester = {
    run: function(creep){
        activitySetup(creep);

        if(!this[creep.memory.activity]) {
            changeActivity(creep, 'default');
        }
        this[creep.memory.activity](creep);
    },
    'default': function(creep) {
        changeActivity(creep, 'searching for source');
        return;
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
            changeActivity(creep, 'searching for source');
            return;
        }
        creep.harvest(mySource);
    },
    'moving to structures': function(creep) {
        let targets = findExtensionsWithFreeSpace(creep);
        if(targets.length === 0){
            targets = findMySpawnWithFreeSpace(creep);
        }
        if(targets.length === 0) {
            changeActivity(creep, 'moving to build site');
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
    'moving to build site': function(creep) {        
        let mySite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(!mySite) {
            changeActivity(creep, 'moving to controller');
            // @TODO add possibility to repair
            return;
        }
        creep.memory.targetId = mySite.id;
        if(creep.pos.inRangeTo(mySite, 3)) {
            changeActivity(creep, 'building site');
            return;
        }
        creep.moveTo(mySite, {visualizePathStyle: {} });
    },
    'building site': function(creep) {
        if(creepIsEmpty(creep)) {
            changeActivity(creep, 'searching for source');
            return;
        }

        const target = Game.getObjectById(creep.memory.targetId);
        if(!target) {
            changeActivity(creep, 'moving to build site');
            return;
        }

        if(creep.build(target) !== 0){
            changeActivity(creep, 'moving to controller');
        }
    },
    'moving to controller': function(creep) {
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
        const result = creep.upgradeController(controller);

        if(result !== OK){
            changeActivity(creep, 'searching for source');
            return;
        }
    }
};

module.exports = { roleHarvester };
