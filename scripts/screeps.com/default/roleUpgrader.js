/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('roleUpgrader');
 * mod.thing == 'a thing'; // true
 */
 
const roleUpgrader = {
    run: function(up){
        const mySource = up.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        
        if(!mySource)
            return;
        
        const controller = up.room.controller;
            if(!controller)
                return;
            
        if(up.store.getUsedCapacity() === 0) {
            up.moveTo(mySource, { visualizePathStyle: {} });
            up.harvest(mySource);
        }
        if(up.store.getFreeCapacity() > 0 && up.store.getUsedCapacity() > 0) {
            const harvestResult = up.harvest(mySource);
            const upgradeResult = up.upgradeController(controller);
            if(harvestResult == upgradeResult){
                up.moveTo(mySource, { visualizePathStyle: {} });
            }
        }
        if(up.store.getFreeCapacity() === 0){
            up.moveTo(controller, { visualizePathStyle: {} });
            up.upgradeController(controller);
        }
    },
};

module.exports = { roleUpgrader };
