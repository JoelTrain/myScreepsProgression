function readyForRepair(object) {
  return object.hits / object.hitsMax < 0.8 && object.hits < 1000000;
}

function activityTowerAttack(tower) {
  let targets = [];
  targets = tower.room.find(FIND_HOSTILE_CREEPS, {
    filter: (creep) => creep.getActiveBodyparts(HEAL)
  });

  const towerHasEnergy = tower.store.getUsedCapacity(RESOURCE_ENERGY) > 10;

  if (!targets.length)
    targets = tower.room.find(FIND_HOSTILE_CREEPS);

  let target = tower.pos.findClosestByRange(targets);
  if (target && target.getActiveBodyparts(HEAL) > 12 && tower.pos.getRangeTo(target) >= 20)
    target = undefined;


  if (target && towerHasEnergy) {
    tower.attack(target);
    console.log(`${tower.id} is attacking ${target.name}`);
  }

  if (!target && towerHasEnergy) {
    targets = tower.room.find(FIND_MY_CREEPS, {
      filter: creep => creep.hits < creep.hitsMax
    });
    target = tower.pos.findClosestByRange(targets);
    tower.heal(target);
  }

  if (!target && tower.store.getUsedCapacity(RESOURCE_ENERGY) > 500) {
    targets = tower.room.find(FIND_STRUCTURES, {
      filter: object => object.hits === 1 && object.structureType === STRUCTURE_RAMPART
    });

    if (targets.length === 0)
      targets = tower.room.find(FIND_STRUCTURES, {
        filter: object => readyForRepair(object) && object.structureType !== STRUCTURE_WALL && object.structureType !== STRUCTURE_RAMPART
      });

    if (targets.length == 0)
      targets = tower.room.find(FIND_STRUCTURES, {
        filter: object => readyForRepair(object) && object.structureType !== STRUCTURE_WALL
      });

    if (targets.length == 0)
      targets = tower.room.find(FIND_STRUCTURES, {
        filter: object => readyForRepair(object)
      });

    targets.sort((a, b) => a.hits - b.hits);
    target = targets[0];

    if (target)
      tower.repair(target);
  }
}

module.exports = { activityTowerAttack };
