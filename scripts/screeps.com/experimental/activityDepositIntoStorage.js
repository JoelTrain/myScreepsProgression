const { creepIsEmpty } = require('./creepIsEmpty');
const { changeActivity } = require('./changeActivity');
const { moveIgnore } = require('./moveIgnore');

function activityDepositIntoStorage(creep) {
  if (creepIsEmpty(creep)) {
    changeActivity(creep, creep.memory.whenEmpty);
  }

  // beware of downgraded rooms with terminals
  // terminals can have 0 maximum capacity (divide by 0 issues)

  let dropoffStructureTypes = [STRUCTURE_STORAGE];
  if (creep.store[RESOURCE_OXYGEN] > 0)
    dropoffStructureTypes = [STRUCTURE_TERMINAL];
  if (creep.store[RESOURCE_ENERGY] > 0)
    dropoffStructureTypes.push(STRUCTURE_TOWER, STRUCTURE_LINK);

  const storages = creep.room.find(FIND_MY_STRUCTURES, { filter: object => object.structureType === STRUCTURE_STORAGE });
  if (storages.length === 0 || (storages[0].store.getFreeCapacity(RESOURCE_ENERGY) / storages[0].store.getCapacity(RESOURCE_ENERGY) < 0.05))
    dropoffStructureTypes.push(STRUCTURE_TERMINAL);

  const terminals = creep.room.find(FIND_MY_STRUCTURES, { filter: object => object.structureType === STRUCTURE_TERMINAL });
  if (terminals.length === 0 || (terminals[0].store.getFreeCapacity(RESOURCE_ENERGY) <= 0) || (terminals[0].store.getFreeCapacity(RESOURCE_ENERGY) / terminals[0].store.getCapacity(RESOURCE_ENERGY) < 0.05))
    dropoffStructureTypes.push(STRUCTURE_STORAGE);

  let target;

  if (!target) {
    let targets = creep.room.find(FIND_MY_STRUCTURES, {
      filter: object => dropoffStructureTypes.includes(object.structureType) && object.store.getFreeCapacity(RESOURCE_ENERGY) >= (creep.store.getUsedCapacity() / 2),
    });
    target = creep.pos.findClosestByRange(targets);
  }

  if (!target) {
    if (!creep.room.controller || !creep.room.controller.my) {
      if (creep.memory.dropoffPos) {
        changeActivity(creep, 'return to dropoff');
        return;
      }
    }
    // drop all resources
    for (const resourceType in creep.carry) {
      console.log(creep.name, 'dropping');
      creep.drop(resourceType);
      break;
    }
    return;
  }

  if (creep.memory.role !== 'basic' && creep.room.find(FIND_MY_CREEPS, { filter: foundCreep => foundCreep.memory.role === 'carrier' }).length === 0) {
    changeActivity(creep, 'transfer');
    return;
  }

  if (creep.pos.isNearTo(target)) {
    // transfer all resources
    for (const resourceType in creep.carry) {
      creep.transfer(target, resourceType);
      break;
    }

    return;
  }

  moveIgnore(creep, target, { maxRooms: 1 });
}

module.exports = { activityDepositIntoStorage };
