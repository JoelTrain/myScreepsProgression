const { creepTypeBasic } = require('./creepTypeBasic');
const { creepTypeDefender } = require('./creepTypeDefender');
const { creepTypeHarvester } = require('./creepTypeHarvester');
const { creepTypeHeavyHarvester } = require('./creepTypeHeavyHarvester');
const { creepTypeCarrier } = require('./creepTypeCarrier');
const { creepTypeTank } = require('./creepTypeTank');
const { creepTypeAttacker } = require('./creepTypeAttacker');
const { creepTypeBuilder } = require('./creepTypeBuilder');
const { creepTypeRepairer } = require('./creepTypeRepairer');
const { creepTypeRemoteBuilder } = require('./creepTypeRemoteBuilder');
const { creepTypeUpgrader } = require('./creepTypeUpgrader');
const { creepTypeClaimer } = require('./creepTypeClaimer');
const { creepTypeManual } = require('./creepTypeManual');

const creepTypesSmall = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester,
  heavyHarvester: creepTypeHeavyHarvester,
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

const creepTypes = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester,
  heavyHarvester: creepTypeHeavyHarvester,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.medium,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.medium,
  claimer: creepTypeClaimer.medium,
  manual: creepTypeManual,
};

const creepTypesLarge = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester,
  heavyHarvester: creepTypeHeavyHarvester,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.large,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.large,
  claimer: creepTypeClaimer.large,
  manual: creepTypeManual,
};

const creepTypesMax = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester,
  heavyHarvester: creepTypeHeavyHarvester,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker.large,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader.small,
  claimer: creepTypeClaimer.large,
  manual: creepTypeManual,
};

module.exports = { creepTypesSmall, creepTypes, creepTypesLarge, creepTypesMax };
