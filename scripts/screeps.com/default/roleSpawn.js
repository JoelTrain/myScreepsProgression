const { creepTypes } = require('./creepTypes');
const { bodyCost } = require('./creepCommon');
const { activitySetup } = require('./activity');

function isFull(type) {
    if(countCreepsOfType(type) >= type.maxCount)
        return true;
    return false;
}

function spawnType(spawner, type) {
    const creepNumber = Math.floor(Math.random() * 10000);
    const creepName = `creep${creepNumber}`;
    const spawnResult = spawner.spawnCreep(type.body, creepName, { memory: type.memory, directions:type.spawnDirections } );
    const string = (spawnResult === 0) ? 'success' : `fail with code ${spawnResult}`;
    const cost = bodyCost(type.body);
    console.log(`Trying to spawn type:${type.memory.role}, cost:${cost}, name:${creepName}...${string}`);
    logCreepCounts();
    if(spawnResult === 0) {
        const newestCreep = Game.creeps[creepName];
        if(!newestCreep)
            throw Error(`Well that's weird. I really thought ${creepName} spawned.`);
        
        activitySetup(newestCreep);
    }
}

const roleSpawn = {
    run: function(spawner) {
        if(spawner.spawning)
            return;
        const currentEnergy = spawner.room.energyAvailable;
        //console.log(`Spawner energy ${currentEnergy}`);
        if(currentEnergy < 300)
            return;

        const typeVals = Object.values(creepTypes);
        if(typeVals.length < 1)
            return;
            
        updateCurrentCreepCounts();
        
        //typeVals.sort((a,b) => {
            // if(a.maxCount === b.maxCount)
            //     return 0;
            // if(a.maxCount === 0)
            //     return 999999;
            // if(b.maxCount === 0)
            //     return -999999;
            // const aManningFraction = a.currentCount / a.maxCount;
            // const bManningFraction = b.currentCount / b.maxCount;
            // return aManningFraction - bManningFraction;
        //});
        for(const typeToBuild of typeVals) {
            //const typeToBuild = typeVals[0];
            if(isFull(typeToBuild))
                continue;
            if(bodyCost(typeToBuild.body) > currentEnergy) 
                break;
            if(typeToBuild.memory.role === 'basic')
                continue;
            spawnType(spawner, typeToBuild);
            return;
        }

        if(totalCreepCount() <= 5) {
            Game.notify('Uh oh we are making basic creeps at ' + currentTimeString());
            console.log('Sending Email!');
            spawnType(spawner, creepTypes.basic);
        }
    },
};
module.exports = { roleSpawn };
