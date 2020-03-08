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
    creep.memory.whenEmpty = 'searching for source';
  if (creep.memory.whenFull === undefined)
    creep.memory.whenFull = 'moving to controller';
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

function findClosestExtensionWithFreeSpace(creep) {
  const extension = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_TOWER) && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return extension;
}

function findMySpawnWithFreeSpace(creep) {
  const spawns = creep.room.find(FIND_MY_STRUCTURES, {
    filter: (structure) => {
      return structure.structureType == STRUCTURE_SPAWN && structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
    }
  });
  return spawns;
}

const activity = {
  'default': function (creep) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  },
  'tower attack': function (tower) {
    const targets = tower.room.find(FIND_HOSTILE_CREEPS, {
      filter: function (object) {
        return object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
      }
    });
    const target = tower.pos.findClosestByRange(targets);
    if (target) {
      tower.attack(target);
    }
  },
  'attack': function (creep) {
    const attackMoveTarget = Game.flags['AttackMove'];
    const targets = creep.room.find(FIND_HOSTILE_CREEPS, {
      filter: function (object) {
        return object.getActiveBodyparts(ATTACK) + object.getActiveBodyparts(RANGED_ATTACK) > 0;
      }
    });
    const target = creep.pos.findClosestByRange(targets);
    if (target) {
      if (creep.attack(target) == ERR_NOT_IN_RANGE) {
        creep.moveTo(target);
        return;
      }
    }
    else if (attackMoveTarget) {
      creep.moveTo(attackMoveTarget, { visualizePathStyle: { stroke: 'red' } });
    }
  },
  'searching for source': function (creep) {
    if (creepIsFull(creep)) {
      changeActivity(creep, creep.memory.whenFull);
      return;
    }

    const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
    if (!mySource)
      return;

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
  'moving to structures': function (creep) {
    let target = findClosestExtensionWithFreeSpace(creep);
    if (!target) {
      target = findMySpawnWithFreeSpace(creep)[0];
    }
    if (!target) {
      changeActivity(creep, 'moving to build site');
      return;
    }
    creep.memory.targetId = target.id;
    if (creep.pos.inRangeTo(target, 2)) {
      creep.moveTo(target, { visualizePathStyle: {} });
      console.log(creep.name, 'early transfer result', creep.transfer(target, RESOURCE_ENERGY));
      changeActivity(creep, 'transferring resources');
      return;
    }
    if (creep.pos.inRangeTo(target, 1)) {
      creep.transfer(target, RESOURCE_ENERGY);
      changeActivity(creep, 'transferring resources');
      return;
    }
    creep.moveTo(target, { visualizePathStyle: {} });
  },
  'transferring resources': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    const target = Game.getObjectById(creep.memory.targetId);
    if (!target) {
      changeActivity(creep, 'moving to structures');
      return;
    }

    if (creep.transfer(target, RESOURCE_ENERGY)) {
      changeActivity(creep, 'moving to structures');
    }
  },
  'moving to build site': function (creep) {
    let mySite = creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
    if (!mySite) {
      changeActivity(creep, 'moving to controller');
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
      changeActivity(creep, 'moving to controller');
    }
  },
  'moving to controller': function (creep) {
    const controller = creep.room.controller;
    if (creep.pos.inRangeTo(controller, 3)) {
      changeActivity(creep, 'upgrading controller');
      return;
    }
    creep.moveTo(controller, { visualizePathStyle: {} });
  },
  'upgrading controller': function (creep) {
    if (creepIsEmpty(creep)) {
      changeActivity(creep, creep.memory.whenEmpty);
      return;
    }

    const controller = creep.room.controller;
    const result = creep.upgradeController(controller);

    if (result !== OK) {
      changeActivity(creep, 'default');
      return;
    }
  }
};

module.exports = {
  activity,
  activitySetup,
  changeActivity,
  changeActivityToRandomPickFromList,
};
