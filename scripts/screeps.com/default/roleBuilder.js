const { pickRandomFromList } = require('./common');

const {
activitySetup,
changeActivity, 
changeActivityToRandomPickFromList,
} = require('./activity');

const {
    creepIsEmpty,
    creepIsFull,
    clearTarget,
} = require('./creepCommon');
 
const roleBuilder = {
    run: function(creep){
        activitySetup(creep);

        const activityFunc = this[creep.memory.activity];
        if(!activityFunc) {
            changeActivity(creep, 'default');
        }
        //console.log(creep.name, creep.memory.activity);
        activityFunc(creep);
    },
    'default': function(creep) {
        changeActivity(creep, 'searching for source');
        return;
    },
    'searching for source': function(creep) {
        clearTarget(creep);
        if(creepIsFull(creep)) {
            const nextActivity = pickRandomFromList(['moving to build site', 'searching for repair']);
            //console.log(creep.name, nextActivity);
            changeActivity(creep, nextActivity);
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
            changeActivityToRandomPickFromList(creep, ['moving to build site', 'searching for repair']);
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
    'moving to build site': function(creep) {
        let mySite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
        if(!mySite) {
            changeActivity(creep, 'searching for repair');
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

        const buildResult = creep.build(target);
        if(buildResult !== OK){
            changeActivity(creep, 'searching for repair');
        }
    },
    'searching for repair': function(creep) {
        const targets = creep.room.find(FIND_STRUCTURES, {
            filter: object => object.structureType !== STRUCTURE_WALL && object.hits / object.hitsMax < 0.8
        });
        
        if(targets.length === 0) {
            changeActivity(creep, 'moving to controller');
            return;
        }
        
        targets.sort((a,b) => a.hits - b.hits);
        const target = targets[0];

        creep.memory.targetId = target.id;
        changeActivity(creep, 'moving to repair');
    },
    'moving to repair': function(creep) {
        const target = Game.getObjectById(creep.memory.targetId);
        if(!target) {
            console.log('could not find object by id', creep.memory.targetId, 'for creep', creep.name);
            changeActivity(creep, 'searching for repair');
            return;
        }

        if(target.hits === target.hitsMax) {
            changeActivity(creep, 'searching for repair');
            return;
        }

        if(creep.pos.inRangeTo(target, 3)) {
            changeActivity(creep, 'repairing');
            return;
        }
        
        creep.moveTo(target, {visualizePathStyle: {} });
    },
    'repairing': function(creep) {
        if(creepIsEmpty(creep)) {
            changeActivity(creep, 'searching for source');
            return;
        }

        const target = Game.getObjectById(creep.memory.targetId);
        if(!target) {
            console.log('could not find object by id', creep.memory.targetId, 'for creep', creep.name);
            changeActivity(creep, 'searching for repair');
            return;
        }

        if(target.hits === target.hitsMax) {
            changeActivity(creep, 'searching for repair');
            return;
        }

        creep.repair(target);
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

module.exports = { roleBuilder };
