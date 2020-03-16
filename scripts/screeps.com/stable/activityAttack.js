const { moveIgnore } = require('./moveIgnore');
const { isAlly } = require('./isAlly');

function activityAttack(creep) {
  let targets = [];

  let healingAnAlly = false;
  const friendly = creep.pos.findClosestByRange(FIND_CREEPS, {
    filter: function (object) {
      return isAlly(object) && object.hits < object.hitsMax;
    }
  });
  if (friendly) {
    if (creep.pos.isNearTo(friendly)) {
      creep.heal(friendly);
      healingAnAlly = true;
    }
    else if (creep.pos.inRangeTo(friendly, 3)) {
      creep.rangedHeal(friendly);
      healingAnAlly = true;
    }
  }

  const controller = creep.room.controller;
  if (controller)
    if (creep.pos.inRangeTo(controller, 1)) {
      creep.attackController(controller);
      creep.reserveController(controller);
      creep.claimController(controller);
      creep.signController(controller, 'Write your own code or die.');
      healingAnAlly = true;
    }

  const attackMoveTarget = Game.flags[creep.memory.rallyPoint];
  if (attackMoveTarget) {
    if (attackMoveTarget.pos.roomName !== creep.room.name) {
      moveIgnore(creep, attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
      return;
    }
    else {
      const enemyStructure = creep.room.lookForAt(LOOK_STRUCTURES, attackMoveTarget)[0];
      if (enemyStructure && !isAlly(enemyStructure))
        targets.push(enemyStructure);

      const enemy = creep.room.lookForAt(LOOK_CREEPS, attackMoveTarget)[0];
      if (enemy && !isAlly(enemy))
        targets.push(enemy);
    }
  }

  if (targets.length === 0) {
    targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3, { filter: !isAlly });
    if (targets.length > 1) {
      creep.rangedMassAttack();
    }
    targets = creep.room.find(FIND_HOSTILE_CREEPS, {
      filter: function (object) {
        return object.getActiveBodyparts(HEAL) + object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0 && !isAlly(object);
      }
    });
  }
  if (targets.length === 0) {
    targets = creep.room.find(FIND_HOSTILE_STRUCTURES, {
      filter: function (object) {
        return object.structureType !== STRUCTURE_RAMPART && object.structureType !== STRUCTURE_CONTROLLER && !isAlly(object) && !(object.structureType === STRUCTURE_STORAGE && object.store.getUsedCapacity() > 0);
      },
    });
  }
  if (targets.length === 0) {
    targets = creep.room.find(FIND_HOSTILE_CREEPS, { filter: !isAlly });
  }

  if (targets.length) {
    const target = creep.pos.findClosestByRange(targets);
    if (target) {
      if (target instanceof Creep) {
        if (creep.pos.inRangeTo(target.pos, 3) && target.getActiveBodyparts(RANGED_ATTACK) === 0 && target.getActiveBodyparts(ATTACK) > 0) {
          const pathResult = PathFinder.search(creep.pos, { pos: target.pos, range: 2 }, { flee: true });
          console.log(pathResult);
          if (pathResult && pathResult.path.length)
            moveIgnore(creep, pathResult.path[0]);
          const attackResult = creep.attack(target);
          if (attackResult === ERR_NOT_IN_RANGE && !healingAnAlly)
            creep.heal(creep);
          creep.rangedAttack(target);
          return;
        }
      }
      if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        moveIgnore(creep, target, { visualizePathStyle: { stroke: 'red' } });
        if (!healingAnAlly)
          creep.heal(creep);
      }
      creep.rangedAttack(target);
      return;
    }
  }

  if (attackMoveTarget) {
    moveIgnore(creep, attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
    if (!healingAnAlly)
      creep.heal(creep);
  }
}

module.exports = { activityAttack };