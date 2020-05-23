const { creepTypesSmall, creepTypes, creepTypesLarge } = require('./creepTypes');

const creepTypeSizes = {
  'small': creepTypesSmall,
  'medium': creepTypes,
  'large': creepTypesLarge,
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
