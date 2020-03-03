function isFull(type) {
    if(countCreepsOfType(type) >= type.maxCount)
        return true;
    return false;
}

module.exports.roleSpawn = {
    run: function(spawner) {
        if(spawner.spawning)
            return;
        
        if(spawner.store[RESOURCE_ENERGY] < 300)
            return;
        
        for(const typeKey of Object.keys(creepTypes)){
            const type = creepTypes[typeKey];
            
            if(isFull(type))
                continue;
            
            this.spawnType(spawner, type);
            logCreepCounts();
            return;
        }
    },
    spawnType: function(spawner, type){
        const creepNumber = Math.floor(Math.random() * 10000);
        const creepName = `creepA${creepNumber}`;
        const spawnResult = spawner.spawnCreep(type.body, creepName, { memory: type.memory } );
        const string = (spawnResult === 0) ? 'success' : `fail with code ${spawnResult}`;
        console.log('Attempting to spawn creep of type', type.memory.role, `with name: ${creepName}`, '...' + string);
    },
};
