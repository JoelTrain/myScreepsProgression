/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleHarvester');
 * mod.thing == 'a thing'; // true
 */

const roleHarvester = {
    run: function(hv){
        const mySource = hv.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        
        if(!mySource)
            return;
        
        let targets = hv.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_EXTENSION && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
        if(targets.length === 0){
            targets = hv.room.find(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
                    }
            });
        }
        
        if(hv.store.getUsedCapacity() === 0) {
            hv.moveTo(mySource, { visualizePathStyle: {} });
            hv.harvest(mySource);
        }
        if(hv.store.getUsedCapacity() > 0 && hv.store.getFreeCapacity() > 0) {
            const harvestResult = hv.harvest(mySource);
                
            if(targets.length === 0)
                return;
            const myTarget = targets[0];
            
            const transferResult = hv.transfer(myTarget, RESOURCE_ENERGY);
            if(harvestResult === transferResult)
                hv.moveTo(myTarget, { visualizePathStyle: {} });
        }
        if(hv.store.getFreeCapacity() === 0) {
            if(targets.length === 0) {
                const controller = hv.room.controller;
                hv.moveTo(controller, { visualizePathStyle: {} });
                hv.upgradeController(controller);
                return;
            }
            const myTarget = targets[0];
            hv.moveTo(myTarget, { visualizePathStyle: {} });
            hv.transfer(myTarget, RESOURCE_ENERGY);
        }
    },
};

module.exports = roleHarvester;