const { findTerminalWithLessThan15kEnergy } = require('./findTerminalWithLessThan15kEnergy');
const { findStructuresWithFreeSpace } = require('./findStructuresWithFreeSpace');
const { findInputLinks } = require('./findInputLinks');

const structuresWithFreeSpace = 'structures_with_free_space';
const terminalsWithLessThan15kEnergy = 'terminals_with_less_than_15k_energy';
const terminalWithFreeSpace = 'terminal_with_free_space';
const storageWithFreeSpace = 'storage_with_free_space';
const containersWithFreeSpace = 'containers_near_controller_with_free_space';
const linksForDepositting = 'links_for_depositting';
const allTransferTargets = 'all_transfer_targets';

function findTransferTargets(creep) {
  const { cachedRoomFinds } = global;
  if (cachedRoomFinds[creep.room] === undefined)
    cachedRoomFinds[creep.room] = {};

  const cachedFindsForThisRoom = cachedRoomFinds[creep.room];

  const allTargets = cachedFindsForThisRoom[allTransferTargets];

  if (allTargets === undefined)
    cachedFindsForThisRoom[allTransferTargets] = {};
  else
    return allTargets;

  const transferTargetTypes = [
    STRUCTURE_TOWER,
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
  ];

  let targets = [];

  if (cachedFindsForThisRoom[structuresWithFreeSpace] === undefined)
    cachedFindsForThisRoom[structuresWithFreeSpace] = findStructuresWithFreeSpace(creep.room, transferTargetTypes);
  targets.push(...cachedFindsForThisRoom[structuresWithFreeSpace]);

  if (cachedFindsForThisRoom[linksForDepositting] === undefined)
    cachedFindsForThisRoom[linksForDepositting] = findInputLinks(creep.room);
  targets.push(...cachedFindsForThisRoom[linksForDepositting]);

  if (cachedFindsForThisRoom[terminalsWithLessThan15kEnergy] === undefined)
    cachedFindsForThisRoom[terminalsWithLessThan15kEnergy] = findTerminalWithLessThan15kEnergy(creep.room);
  targets.push(...cachedFindsForThisRoom[terminalsWithLessThan15kEnergy]);

  
  // causes problem with pickup and immediatly transfer back
  if (cachedFindsForThisRoom[containersWithFreeSpace] === undefined) {
    const containers = findStructuresWithFreeSpace(creep.room, STRUCTURE_CONTAINER);
    cachedFindsForThisRoom[containersWithFreeSpace] = _.filter(containers, container => container.pos.findInRange(container.room.controller, 2));
  }

  if(targets.length === 0)
    targets.push(...cachedFindsForThisRoom[containersWithFreeSpace]);

  // causes problem with pickup and immediatly transfer back
  if (cachedFindsForThisRoom[storageWithFreeSpace] === undefined)
    cachedFindsForThisRoom[storageWithFreeSpace] = findStructuresWithFreeSpace(creep.room, STRUCTURE_STORAGE);

  if(targets.length === 0)
    targets.push(...cachedFindsForThisRoom[storageWithFreeSpace]);

  // for fast stock up on energy in terminal, uncomment next lines
  if (cachedFindsForThisRoom[terminalWithFreeSpace] === undefined)
    cachedFindsForThisRoom[terminalWithFreeSpace] = findStructuresWithFreeSpace(creep.room, [STRUCTURE_TERMINAL]);
  targets.push(...cachedFindsForThisRoom[terminalWithFreeSpace]);

  cachedFindsForThisRoom[allTransferTargets] = targets;

  return targets;
}

module.exports = { findTransferTargets };
