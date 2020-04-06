const { creepTypes } = require('./creepTypes');

const creepTypesPerRoom = {
  'E3S1': creepTypes,
  'E5S31': creepTypes,
  'E9S32': creepTypes,
};

module.exports = { creepTypesPerRoom };
