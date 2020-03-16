function activityTowerAttack(tower) {
  const targets = tower.room.find(FIND_HOSTILE_CREEPS);
  const target = tower.pos.findClosestByRange(targets);
  if (target) {
    tower.attack(target);
    console.log(`${tower.name} is attacking ${target.name}`);
  }
}

module.exports = { activityTowerAttack };
