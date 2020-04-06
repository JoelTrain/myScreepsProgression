const { creepTypes } = require('./creepTypes');

const creepTypeSizes = {
  'small': undefined,
  'medium': creepTypes,
  'large': undefined,
  undefined: creepTypes,
};

const roomToTypes = {
  E5S31: 'large',
  E9S32: 'large',
};

function creepTypesPerRoom(roomName) {
  return creepTypeSizes[roomToTypes[roomName]];
}

module.exports = { creepTypesPerRoom };
