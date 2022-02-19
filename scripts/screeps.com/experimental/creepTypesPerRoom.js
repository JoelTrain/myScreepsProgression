const { creepTypesSmall, creepTypes, creepTypesLarge, creepTypesMax } = require('./creepTypes');

const creepTypeSizes = {
  'tiny': creepTypesSmall,
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

  const room = Game.rooms[roomName];
  const energyMax = room.energyCapacityAvailable;

  let roomSize = 'max';

  if(energyMax <= 550)
    roomSize = 'tiny';
  else if(energyMax <= 800)
    roomSize = 'small';
  else if(energyMax <= 1300)
    roomSize = 'medium';
  else if(energyMax <= 2000)
    roomSize = 'large';

  // old behavior
  // return creepTypeSizes[roomToTypes[roomName]];
  return creepTypeSizes[roomSize];
}

module.exports = { creepTypesPerRoom };
