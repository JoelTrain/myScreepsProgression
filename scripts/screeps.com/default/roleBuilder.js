let action = 'build';

function performAction(creep, arg) {
    return creep[action](arg);
} 
 
const roleBuilder = {
    run: function(creep){
        action = 'build';
        
        let mySite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
            
        const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        if(!mySource)
            return;
        
        if(creep.store.getUsedCapacity() === 0) {
            creep.moveTo(mySource, { visualizePathStyle: {} });
            creep.harvest(mySource);
        }
        if(creep.store.getFreeCapacity() > 0 && creep.store.getUsedCapacity() > 0) {
            const harvestResult = creep.harvest(mySource);
            if(harvestResult === 0)
                return;
            const buildResult = creep.build(mySite);
            if(harvestResult === buildResult)
                creep.moveTo(mySource, { visualizePathStyle: {} });
        }
        if(creep.store.getFreeCapacity() === 0){
            if(!mySite) {
                const targets = creep.room.find(FIND_STRUCTURES, {
                    filter: object => object.hits < object.hitsMax
                });
                
                if(targets.length === 0) {
                    creep.memory.role = 'harvester';
                    return;
                }
                
                targets.sort((a,b) => a.hits - b.hits);
                mySite = targets[0];
                action = 'repair';
            }
            creep.moveTo(mySite, { visualizePathStyle: {} });
            performAction(creep, mySite);
        }
    }  
};

module.exports = { roleBuilder };
