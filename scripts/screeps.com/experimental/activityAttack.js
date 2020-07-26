const { moveIgnore } = require('./moveIgnore');
const { isAlly } = require('./isAlly');

function activityAttack(creep) {
  let targets = [];

  let healingAnAlly = false;
  const attackPartCount = creep.getActiveBodyparts(ATTACK);
  const rangedPartCount = creep.getActiveBodyparts(RANGED_ATTACK);
  const totalAttackPartCount = attackPartCount + rangedPartCount;
  const healPartCount = creep.getActiveBodyparts(HEAL);
  const claimPartCount = creep.getActiveBodyparts(CLAIM);

  const controller = creep.room.controller;
  if (controller && !controller.my && claimPartCount > 0)
    if (creep.pos.inRangeTo(controller, 1)) {
      if (controller.reservation && controller.reservation.username !== 'ComradeJoecool') {
        creep.attackController(controller);
        creep.claimController(controller);
      }
      creep.reserveController(controller);
      creep.signController(controller, 'Write your own code or die.');
      healingAnAlly = true;
    }

  const attackMoveFlag = Game.flags[creep.memory.rallyPoint];
  let attackMovePos;
  if (attackMoveFlag)
    attackMovePos = attackMoveFlag.pos;
  else if (creep.memory.targetPos) {
    const { roomName, x, y } = creep.memory.targetPos;
    const roomPosition = new RoomPosition(x, y, roomName);
    attackMovePos = roomPosition;
  }

  let attackCreepsInThisRoom = attackMovePos && attackMovePos.roomName === creep.room.name;
  if (attackMovePos) {
    const moveCommand = Game.flags['move'];
    if (moveCommand && attackMovePos.roomName !== creep.room.name) {
      moveIgnore(creep, attackMovePos, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
      return;
    }
  }
  if (attackCreepsInThisRoom) {
    const enemyStructure = creep.room.lookForAt(LOOK_STRUCTURES, attackMovePos)[0];
    if (enemyStructure && !isAlly(enemyStructure) && enemyStructure.structureType != STRUCTURE_CONTROLLER)
      targets.push(enemyStructure);

    const enemy = creep.room.lookForAt(LOOK_CREEPS, attackMovePos)[0];
    if (enemy && !isAlly(enemy))
      targets.push(enemy);
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

  let isMeleeAttacking = false;
  let isRangedAttacking = false;

  if (targets.length && totalAttackPartCount) {
    const target = creep.pos.findClosestByRange(targets);
    if (target) {
      if (target instanceof Creep && creep.pos.inRangeTo(target, 3) && rangedPartCount > 0) {
        isRangedAttacking = creep.rangedAttack(target) === OK;
        isMeleeAttacking = creep.attack(target) === OK;

        if (target.getActiveBodyparts(RANGED_ATTACK) === 0 && target.getActiveBodyparts(ATTACK) > 0) {
          // run just out of range if they cannot melee
          const pathResult = PathFinder.search(creep.pos, { pos: target.pos, range: 2 }, { flee: true });
          console.log(pathResult);
          if (pathResult && pathResult.path.length)
            moveIgnore(creep, pathResult.path[0]);
          if (!isMeleeAttacking && !healingAnAlly && creep.hits < creep.hitsMax)
            creep.heal(creep);
          //could also heal my neighbors here
          return;
        }
      }
      if (!creep.pos.inRangeTo(target, 1) && attackPartCount > 0) {
        moveIgnore(creep, target.pos, { visualizePathStyle: { stroke: 'red' } });
        if (!healingAnAlly && creep.hits < creep.hitsMax)
          creep.heal(creep);
      }
      return;
    }
  }

  if (!isMeleeAttacking
    && !isRangedAttacking
    && healPartCount > 0) {
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
      else if (creep.hits === creep.hitsMax)
        healingAnAlly = true;
    }
  }

  if (isMeleeAttacking
    || isRangedAttacking
    || healingAnAlly) {
    return;
  }

  if (attackMovePos) {
    moveIgnore(creep, attackMovePos, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
    if (!healingAnAlly && creep.hits < creep.hitsMax)
      creep.heal(creep);
  }
  if (attackMovePos === undefined || attackMovePos.roomName === creep.room.name) {
    if (Memory.hostilesAt && Game.map.getRoomLinearDistance(creep.room.name, Memory.hostilesAt.roomName) < 10)
      creep.memory.targetPos = Memory.hostilesAt;
  }
}

module.exports = { activityAttack };
