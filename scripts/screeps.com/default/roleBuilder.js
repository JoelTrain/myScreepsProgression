/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleBuilder');
 * mod.thing == 'a thing'; // true
 */
 
const roleBuilder = {
    run: function(builder){
        const mySite = builder.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            
        const mySource = builder.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(!mySource)
            return;
        
        if(builder.store.getUsedCapacity() === 0) {
            builder.moveTo(mySource, { visualizePathStyle: {} });
            builder.harvest(mySource);
        }
        if(builder.store.getFreeCapacity() > 0 && builder.store.getUsedCapacity() > 0) {
            const harvestResult = builder.harvest(mySource);
            if(harvestResult === 0)
                return;
            const buildResult = builder.build(mySite);
            if(harvestResult === buildResult)
                builder.moveTo(mySource, { visualizePathStyle: {} });
        }
        if(builder.store.getFreeCapacity() === 0){
            if(!mySite) {
                const controller = builder.room.controller;
                builder.moveTo(controller, { visualizePathStyle: {} });
                builder.upgradeController(controller);
                return;
            }
            
            builder.moveTo(mySite, { visualizePathStyle: {} });
            builder.build(mySite);
        }
    }  
};

module.exports = roleBuilder;