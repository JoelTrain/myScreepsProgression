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

// tiny room creep types need to be less than or equal 550 (Room controller level 2)
const creepTypesTiny = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.small,
  heavyHarvester: creepTypeHeavyHarvester.small,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.small,
  builder: creepTypeBuilder.tiny,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.small,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

// small room creep types need to be less than or equal 800 (Room controller level 3)
const creepTypesSmall = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.small,
  heavyHarvester: creepTypeHeavyHarvester.small,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.small,
  builder: creepTypeBuilder.small,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.small,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

// Are all of these bodies under a certain cost?

// Medium creep types need to be less than ... (Room controller level 4)
const creepTypes = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester.medium,
  heavyHarvester: creepTypeHeavyHarvester.medium,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.medium,
  builder: creepTypeBuilder.medium,
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
  builder: creepTypeBuilder.large,
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
  builder: creepTypeBuilder.max,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.large,
  claimer: creepTypeClaimer.small,
  manual: creepTypeManual,
};

module.exports = { creepTypesTiny, creepTypesSmall, creepTypes, creepTypesLarge, creepTypesMax };
