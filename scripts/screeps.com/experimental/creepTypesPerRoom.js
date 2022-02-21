const { creepTypesSmall, creepTypes, creepTypesLarge, creepTypesMax } = require('./creepTypes');

const creepTypeSizes = {
  'tiny': creepTypesSmall,
  'small': creepTypesSmall,
  'medium': creepTypes,
  'large': creepTypesLarge,
  'max': creepTypesMax,
  undefined: creepTypes,
};


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

  return creepTypeSizes[roomSize];
}

module.exports = { creepTypesPerRoom };
