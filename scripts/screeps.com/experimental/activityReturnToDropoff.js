const { changeActivity } = require('./changeActivity');

function activityReturnToDropoff(creep) {
  creep.memory.whenArrive = 'deposit';
  creep.memory.targetPos = creep.memory.dropoffPos;
  
  if(creep.memory.pickupPos)
    creep.memory.whenEmpty = 'return to pickup';

  changeActivity(creep, 'move to room');
}

module.exports = { activityReturnToDropoff };
