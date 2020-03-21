const { changeActivity } = require('./changeActivity');

function activityReturnToPickup(creep) {
  creep.memory.whenArrive = 'pickup';
  creep.memory.targetPos = creep.memory.pickupPos;

  changeActivity(creep, 'move to position');
}

module.exports = { activityReturnToPickup };
