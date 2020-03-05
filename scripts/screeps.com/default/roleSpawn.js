const { creepTypes } = require('./creepTypes');
const { bodyCost } = require('./creepCommon');

function isFull(type) {
    if(countCreepsOfType(type) >= type.maxCount)
        return true;
    return false;
}

function spawnType(spawner, type) {
    const creepNumber = Math.floor(Math.random() * 10000);
    const creepName = `creep${creepNumber}`;
    const spawnResult = spawner.spawnCreep(type.body, creepName, { memory: type.memory } );
    const string = (spawnResult === 0) ? 'success' : `fail with code ${spawnResult}`;
    const cost = bodyCost(type.body);
    console.log(`Trying to spawn type:${type.memory.role}, cost:${cost}, name:${creepName}...${string}`);
    logCreepCounts();
}

const roleSpawn = {
    run: function(spawner) {
        if(spawner.spawning)
            return;
        
        const currentEnergy = spawner.store[RESOURCE_ENERGY];
        if(currentEnergy < 300)
            return;

        const typeVals = Object.values(creepTypes);
        if(typeVals.length < 1)
            return;
        
        updateCurrentCreepCounts();

        typeVals.sort((a,b) => {
            const aManningFraction = a.currentCount / Math.max(a.maxCount, 1);
            const bManningFraction = b.currentCount / Math.max(b.maxCount, 1);
            return aManningFraction - bManningFraction;
        });
        const typeToBuild = typeVals[0];
        if(isFull(typeToBuild))
            return;

        if(currentEnergy < bodyCost)
            return;
        
        spawnType(spawner, typeToBuild);
        return;
    },
};
module.exports = { roleSpawn };
