const { moveIgnore } = require('./moveIgnore');

function activityAttack(creep) {
  let targets = [];

  const controller = creep.room.controller;
  if (controller)
    if (creep.pos.inRangeTo(controller, 1)) {
      creep.attackController(controller);
      creep.reserveController(controller);
      creep.claimController(controller);
    }

  const attackMoveTarget = Game.flags[creep.memory.rallyPoint];
  if (attackMoveTarget) {
    if (attackMoveTarget.pos.roomName !== creep.room.name) {
      moveIgnore(creep, attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
      return;
    }
    else {
      targets.push(...creep.room.lookForAt(LOOK_STRUCTURES, attackMoveTarget));
      targets.push(...creep.room.lookForAt(LOOK_CREEPS, attackMoveTarget));
    }
  }

  if (targets.length === 0) {
    targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
    if (targets.length > 1) {
      creep.rangedMassAttack();
    }
    targets = creep.room.find(FIND_HOSTILE_CREEPS, {
      filter: function (object) {
        return object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
      }
    });
  }
  if (targets.length === 0) {
    targets = creep.room.find(FIND_HOSTILE_STRUCTURES, {
      filter: function (object) {
        return object.structureType !== STRUCTURE_CONTROLLER;
      },
    });
  }
  if (targets.length === 0) {
    targets = creep.room.find(FIND_HOSTILE_CREEPS);
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
  if (attackMoveTarget) {
    moveIgnore(creep, attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
  }
}

module.exports = { activityAttack };
