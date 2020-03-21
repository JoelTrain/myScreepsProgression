function activityTowerAttack(tower) {
  let targets;
  targets = tower.room.find(FIND_HOSTILE_CREEPS, {
    filter: (creep) => creep.getActiveBodyparts(HEAL)
  });

  if (!targets.length)
    targets = tower.room.find(FIND_HOSTILE_CREEPS);

  let target = tower.pos.findClosestByRange(targets);
  if (target && target.getActiveBodyparts(HEAL) > 12 && tower.pos.getRangeTo(target) >= 20)
    target = undefined;


  if (target && tower.store.getUsedCapacity(RESOURCE_ENERGY) > 10) {
    tower.attack(target);
    console.log(`${tower.id} is attacking ${target.name}`);
  }

  if (!target && tower.store.getUsedCapacity(RESOURCE_ENERGY) > 10) {
    targets = tower.room.find(FIND_MY_CREEPS, {
      filter: creep => creep.hits < creep.hitsMax
    });
    target = tower.pos.findClosestByRange(targets);
    tower.heal(target);
  }
}

module.exports = { activityTowerAttack };
