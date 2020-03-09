const {
  findTransferTargets,
  moveIgnore,
  creepIsEmpty,
  creepIsFull,
  activitySetup,
  changeActivity,
  activityPickup,
  activityHarvestInPlace,
} = require('./common');


const activity = {
  'tower attack': function (tower) {
    const targets = tower.room.find(FIND_HOSTILE_CREEPS);
    const target = tower.pos.findClosestByRange(targets);
    if (target) {
      tower.attack(target);
    }
  },
  'pickup': activityPickup,
  'harvest in place': activityHarvestInPlace,
  'move to rally point': function (creep) {
    const rallyTarget = Game.flags[creep.memory.rallyPoint];
    if (rallyTarget) {
      moveIgnore(creep, rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
    }
    if (creep.pos.inRangeTo(rallyTarget, 5)) {
      changeActivity(creep, creep.memory.whenEmpty);
    }
  },
  'attack': function (creep) {
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
      if (creep.pos.inRangeTo(controller, 1))
        creep.attackController(controller);
    }
    const attackMoveTarget = Game.flags[creep.memory.rallyPoint];
    if (attackMoveTarget) {
      moveIgnore(creep, attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
    }
  },
  'searching for source': function (creep) {
  },
  'moving to source': function (creep) {
  },
  'harvest': function (creep) {
    if (creepIsFull(creep)) {
      changeActivity(creep, creep.memory.whenFull);
      return;
    }
    const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (!mySource) {
      changeActivity(creep, 'pickup');
      return;
    }

    const inRange = creep.pos.inRangeTo(mySource, 1);
    if (!inRange)
      moveIgnore(creep, mySource);

    const willBeFull = creep.getActiveBodyparts(WORK) * 2 > creep.store.getFreeCapacity();
    creep.harvest(mySource);

    if (willBeFull && inRange) {
      console.log(creep.name + ' will be full');
      changeActivity(creep, creep.memory.whenFull);
      const deltaX = creep.pos.x - mySource.pos.x;
      const deltaY = creep.pos.y - mySource.pos.y;

      const adjacentPosX = creep.pos.x + deltaX;
      const adjacentPosY = creep.pos.y + deltaY;

      const oppositeDirectionFromSource = creep.pos.getDirectionTo(adjacentPosX, adjacentPosY);
      const result = creep.move(oppositeDirectionFromSource);
      console.log(creep.name, ' early move result:', result);
      return;
    }
  },
  'transferring': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    let targets;
    targets = findTransferTargets(creep);

    if (!targets.length) {
      changeActivity(creep, 'building site');
      return;
    }

    let target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
    if (!target) {
      creep.say('stuck');
      return;
    }

    creep.memory.targetId = target.id;
    if (creep.pos.inRangeTo(target, 1)) {
      creep.transfer(target, RESOURCE_ENERGY);

      const pos = targets.indexOf(target);
      if (pos > -1) {
        targets.splice(pos, 1);
        target = creep.pos.findClosestByPath(targets, { ignoreCreeps: true });
      }
    }

    moveIgnore(creep, target);
  },
  'building site': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    let target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    }
    if (!target) {
      clearTarget(creep);
      changeActivity(creep, 'upgrading controller');
      return;
    }

    creep.memory.targetId = target.id;

    if (creep.pos.inRangeTo(target, 3)) {
      const buildResult = creep.build(target);
      if (buildResult !== OK) {
        changeActivity(creep, 'upgrading controller');
      }
      return;
    }

    moveIgnore(creep, target);
    return;
  },
  'upgrading controller': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    let controller = creep.room.controller;
    if (!controller.my) {
      for (const room of Object.values(Game.rooms)) {
        if (room.controller.my) {
          controller = room.controller;
          break;
        }
      }
    }

    if (creep.pos.inRangeTo(controller, 3)) {
      const result = creep.upgradeController(controller);

      if (result !== OK) {
        changeActivity(creep, creep.memory.whenEmpty);
      }
      return;
    }

    moveIgnore(creep, controller);
  }
};

module.exports = {
  activity,
  activitySetup,
  changeActivity,
};
