const { creepTypesSmall, creepTypes, creepTypesLarge, creepTypesMax } = require('./creepTypes');

const creepTypeSizes = {
  'small': creepTypesSmall,
  'medium': creepTypes,
  'large': creepTypesLarge,
  'max': creepTypesMax,
  undefined: creepTypes,
};

const roomToTypes = {
  E5S31: 'large',
  E9S32: 'max',
  E12S42: 'medium',
};

// @TODO add a function the determines size from room energy max capacity

function creepTypesPerRoom(roomName) {
  return creepTypeSizes[roomToTypes[roomName]];
}

module.exports = { creepTypesPerRoom };
