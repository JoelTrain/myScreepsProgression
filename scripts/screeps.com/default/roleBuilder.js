const { pickRandomFromList } = require('./common');
const { activity, changeActivity } = require('./activity');

const {
    creepIsEmpty,
    creepIsFull,
    clearTarget,
} = require('./creepCommon');
 
const roleBuilder = {
    run: function(creep){
        if(this[creep.memory.activity]) {
            this[creep.memory.activity](creep);
            return;
        }
        if(activity[creep.memory.activity]) {
            activity[creep.memory.activity](creep);
            return;
        }

        changeActivity(creep, 'default');
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
