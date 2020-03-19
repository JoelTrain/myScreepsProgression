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
const { creepTypeManual } = require('./creepTypeManual');

const creepTypes = {
  basic: creepTypeBasic,
  defender: creepTypeDefender,
  harvester: creepTypeHarvester,
  heavyHarvester: creepTypeHeavyHarvester,
  carrier: creepTypeCarrier,
  tank: creepTypeTank,
  attacker: creepTypeAttacker,
  builder: creepTypeBuilder,
  repairer: creepTypeRepairer,
  remoteBuilder: creepTypeRemoteBuilder,
  upgrader: creepTypeUpgrader,
  manual: creepTypeManual,
};

module.exports = { creepTypes };
