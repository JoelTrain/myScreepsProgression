const { moveIgnore } = require('./moveIgnore');

function activityAttack(creep) {
  {
    const targets = creep.room.find(FIND_HOSTILE_CREEPS, {
      filter: function (object) {
        return object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
      }
    });
    if (targets.length) {
      const target = creep.pos.findClosestByRange(targets);
      if (target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          moveIgnore(creep, target, { visualizePathStyle: { stroke: 'red' } });
        }
        creep.rangedAttack(target);
        return;
      }
    }
  }
  {
    const targets = creep.room.find(FIND_HOSTILE_STRUCTURES, {
      filter: function (object) {
        return object.structureType !== STRUCTURE_CONTROLLER;
      },
    });
    const target = creep.pos.findClosestByRange(targets);
    if (target) {
      if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        moveIgnore(creep, target, { visualizePathStyle: { stroke: 'red' } });
      }
      creep.rangedAttack(target);
      return;
    }
  }
  {
    const targets = creep.room.find(FIND_HOSTILE_CREEPS);
    if (targets.length) {
      const target = creep.pos.findClosestByRange(targets);
      if (target) {
        if (creep.attack(target) == ERR_NOT_IN_RANGE) {
          moveIgnore(creep, target, { visualizePathStyle: { stroke: 'red' } });
        }
        creep.rangedAttack(target);
        return;
      }
    }
  }
  {
    const controller = creep.room.controller;
    if (creep.pos.inRangeTo(controller, 1)) {
      creep.attackController(controller);
      creep.claimController(controller);
      creep.reserveController(controller);
    }
  }
  const attackMoveTarget = Game.flags[creep.memory.rallyPoint];
  if (attackMoveTarget) {
    moveIgnore(creep, attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
  }
}

module.exports = { activityAttack };
