const { findTerminalWithLessThan15kEnergy } = require('./findTerminalWithLessThan15kEnergy');
const { findStructuresWithFreeSpace } = require('./findStructuresWithFreeSpace');

function findTransferTargets(creep) {
  const transferTargetTypes = [
    STRUCTURE_TOWER,
    STRUCTURE_EXTENSION,
    STRUCTURE_SPAWN,
  ];

  let targets = [];
  targets.push(...findStructuresWithFreeSpace(creep.room, transferTargetTypes));
  targets.push(...findTerminalWithLessThan15kEnergy(creep.room));
  // causes problem with pickup and immediatly transfer back
  //targets.push(...findStructuresWithFreeSpace(creep.room, STRUCTURE_STORAGE));

  // for fast stock up on energy in terminal, uncomment next line
  // targets.push(...findStructuresWithFreeSpace(creep, STRUCTURE_TERMINAL));
  return targets;
}

module.exports = { findTransferTargets };
