// const { findTerminalWithLessThan15kEnergy } = require('./findTerminalWithLessThan15kEnergy');
const { findStructuresWithFreeSpace } = require('./findStructuresWithFreeSpace');
const { findInputLinks } = require('./findInputLinks');

const structuresWithFreeSpace = 'structures_with_free_space';
// const terminalsWithLessThan15kEnergy = 'terminals_with_less_than_15k_energy';
// const terminalWithFreeSpace = 'terminal_with_free_space';
// const storageWithFreeSpace = 'storage_with_free_space';
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

  // if (cachedFindsForThisRoom[terminalsWithLessThan15kEnergy] === undefined)
  //   cachedFindsForThisRoom[terminalsWithLessThan15kEnergy] = findTerminalWithLessThan15kEnergy(creep.room);
  // targets.push(...cachedFindsForThisRoom[terminalsWithLessThan15kEnergy]);
  // causes problem with pickup and immediatly transfer back
  // targets.push(...findStructuresWithFreeSpace(creep.room, STRUCTURE_STORAGE));

  // for fast stock up on energy in terminal, uncomment next line
  // targets.push(...findStructuresWithFreeSpace(creep, STRUCTURE_TERMINAL));

  cachedFindsForThisRoom[allTransferTargets] = targets;

  return targets;
}

module.exports = { findTransferTargets };
