const { creepTypeBasic } = require('./creepTypeBasic');
const { creepTypeDefender } = require('./creepTypeDefender');
const { creepTypeHarvester } = require('./creepTypeHarvester');
const { creepTypeHeavyHarvester } = require('./creepTypeHeavyHarvester');
const { creepTypeCarrier } = require('./creepTypeCarrier');
const { creepTypeHeavyCarrier } = require('./creepTypeHeavyCarrier');
const { creepTypeTank } = require('./creepTypeTank');
const { creepTypeAttacker } = require('./creepTypeAttacker');
const { creepTypeBuilder } = require('./creepTypeBuilder');
const { creepTypeRepairer } = require('./creepTypeRepairer');
const { creepTypeRemoteBuilder } = require('./creepTypeRemoteBuilder');
const { creepTypeUpgrader } = require('./creepTypeUpgrader');
const { creepTypeClaimer } = require('./creepTypeClaimer');
const { creepTypeManual } = require('./creepTypeManual');

// @TODO determine body size dynamically from energy capacity max based on limb proportions

const creepTypesSmall = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.small,
  heavyHarvester: creepTypeHeavyHarvester.small,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.small,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.small,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

// Are all of these bodies under a certain cost?

const creepTypes = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.medium,
  heavyHarvester: creepTypeHeavyHarvester.medium,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.medium,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.medium,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

const creepTypesLarge = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.large,
  heavyHarvester: creepTypeHeavyHarvester.large,
  carrier: creepTypeHeavyCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.large,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.large,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

const creepTypesMax = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.large,
  heavyHarvester: creepTypeHeavyHarvester.large,
  carrier: creepTypeHeavyCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.large,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.large,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

module.exports = { creepTypesSmall, creepTypes, creepTypesLarge, creepTypesMax };
