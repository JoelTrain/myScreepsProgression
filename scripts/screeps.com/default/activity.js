const { pickRandomFromList } = require('./common');
const {
  creepIsEmpty,
  creepIsFull,
} = require('./creepCommon');

let callOuts = true;

function activitySetup(creep) {
  if (creep.memory.activity === undefined)
    creep.memory.activity = 'default';
  if (creep.memory.whenEmpty === undefined)
    creep.memory.whenEmpty = 'pickup';
  if (creep.memory.whenFull === undefined)
    creep.memory.whenFull = 'upgrading controller';
}

function changeActivity(creep, newActivity) {
  if (creep.memory.activity === newActivity)
    return;

  if (callOuts)
    creep.say(newActivity);

  creep.memory.activity = newActivity;
}

function changeActivityToRandomPickFromList(creep, activityList) {
  changeActivity(creep, pickRandomFromList(activityList));
}

function findExtensionsWithFreeSpace(creep) {
  const extensions = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return extensions;
}

function findMySpawnsWithFreeSpace(creep) {
  const spawns = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return spawns;
}

function findStorageWithFreeSpace(creep) {
  const storage = creep.room.find(FIND_STRUCTURES, {
    filter: function (object) {
      return object.structureType === STRUCTURE_STORAGE && object.store.getFreeCapacity() > creep.store.getUsedCapacity();
    }
  });
  return storage;
}

function findTransferTargets(creep) {
  let targets = [];
  if (!targets.length)
    targets = findExtensionsWithFreeSpace(creep);
  if (!targets.length)
    targets = findMySpawnsWithFreeSpace(creep);
  if (!targets.length)
    targets = findStorageWithFreeSpace(creep);

  return targets;
}

const activity = {
  'default': function (creep) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  },
  'tower attack': function (tower) {
    const targets = tower.room.find(FIND_HOSTILE_CREEPS);
    const target = tower.pos.findClosestByRange(targets);
    if (target) {
      tower.attack(target);
    }
  },
  'pickup': function (creep) {
    if (creepIsFull(creep)) {
      changeActivity(creep, creep.memory.whenFull);
    }

    let target;
    if (!target) {
      target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: function (object) {
          return object.structureType === STRUCTURE_CONTAINER && object.store.getUsedCapacity() >= 100;
        }
      });
    }

    if (!target) {
      target = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
        filter: function (object) {
          return object.store.getUsedCapacity() > 0;
        }
      });
    }

    if (!target) {
      target = creep.pos.findClosestByPath(FIND_RUINS, {
        filter: function (object) {
          return object.store.getUsedCapacity() > 0;
        }
      });
    }

    if (!target) {
      let targets = creep.room.find(FIND_DROPPED_RESOURCES);
      target = creep.pos.findClosestByPath(targets);
    }

    if (!target) {
      changeActivity(creep, 'searching for source');
      return;
    }

    creep.moveTo(target, { visualizePathStyle: {} });
    creep.pickup(target);
    creep.withdraw(target, RESOURCE_ENERGY);
  },
  'harvest in place': function (creep) {
    const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
    if (structuresAtMyPos[0] instanceof StructureContainer && structuresAtMyPos[0].store.getFreeCapacity() > 0) {
      const harvestTarget = creep.pos.findInRange(FIND_SOURCES, 1)[0];
      if (harvestTarget) {
        creep.harvest(harvestTarget);
        return;
      }
    }

    const spot = creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: function (object) {
        return object.structureType === STRUCTURE_CONTAINER && object.pos.lookFor(LOOK_CREEPS).length === 0;
      }
    });

    if (spot) {
      creep.moveTo(spot, { visualizePathStyle: {}, ignoreCreeps: true });
      return;
    }
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    creep.moveTo(source, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' }, ignoreCreeps: true });
  },
  'move to rally point': function (creep) {
    const rallyTarget = Game.flags[creep.memory.rallyPoint];
    if (rallyTarget) {
      creep.moveTo(rallyTarget, { reusePath: 20, visualizePathStyle: { stroke: 'yellow' } });
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
            creep.moveTo(target, { visualizePathStyle: { stroke: 'red' } });
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
          creep.moveTo(target, { visualizePathStyle: { stroke: 'red' } });
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
            creep.moveTo(target, { visualizePathStyle: { stroke: 'red' } });
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
      creep.moveTo(attackMoveTarget, { reusePath: 20, visualizePathStyle: { stroke: 'red' } });
    }
  },
  'searching for source': function (creep) {
    if (creepIsFull(creep)) {
      changeActivity(creep, creep.memory.whenFull);
      return;
    }

    const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!mySource) {
      changeActivity(creep, 'default');
      return;
    }

    creep.moveTo(mySource, { visualizePathStyle: {} });
    changeActivity(creep, 'moving to source');
  },
  'moving to source': function (creep) {
    const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

    if (!mySource) {
      changeActivity(creep, 'searching for source');
      return;
    }

    if (creep.pos.inRangeTo(mySource, 1)) {
      creep.harvest(mySource);
      changeActivity(creep, 'harvesting from source');
      return;
    }
    creep.moveTo(mySource, { visualizePathStyle: {} });
  },
  'harvesting from source': function (creep) {
    if (creepIsFull(creep)) {
      changeActivity(creep, creep.memory.whenFull);
      return;
    }

    // @TODO improve this
    const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!mySource) {
      changeActivity(creep, 'searching for source');
      return;
    }
    const freeSpace = creep.store.getFreeCapacity();
    const willBeFull = creep.getActiveBodyparts(WORK) * 2 > freeSpace;
    creep.harvest(mySource);

    if (willBeFull) {
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
      changeActivity(creep, 'moving to build site');
      return;
    }

    let target = creep.pos.findClosestByPath(targets);
    if (!target)
      return;

    creep.memory.targetId = target.id;
    if (creep.pos.inRangeTo(target, 1)) {
      creep.transfer(target, RESOURCE_ENERGY);

      const pos = targets.indexOf(target);
      if (pos > -1) {
        targets.splice(pos, 1);
        target = creep.pos.findClosestByPath(targets);
      }
    }

    creep.moveTo(target, { visualizePathStyle: {} });
  },
  'moving to build site': function (creep) {
    let mySite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (!mySite) {
      changeActivity(creep, 'upgrading controller');
      // @TODO add possibility to repair
      return;
    }
    creep.memory.targetId = mySite.id;
    if (creep.pos.inRangeTo(mySite, 3)) {
      changeActivity(creep, 'building site');
      return;
    }
    creep.moveTo(mySite, { visualizePathStyle: {} });
  },
  'building site': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    const target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
      changeActivity(creep, 'moving to build site');
      return;
    }

    if (creep.build(target) !== 0) {
      changeActivity(creep, 'upgrading controller');
    }
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
        changeActivity(creep, 'default');
      }
      return;
    }

    creep.moveTo(controller, { visualizePathStyle: {} });
  }
};

module.exports = {
  activity,
  activitySetup,
  changeActivity,
  changeActivityToRandomPickFromList,
};
