const { moveIgnore } = require('./moveIgnore');
const { creepIsFull } = require('./creepIsFull');
const { changeActivity } = require('./changeActivity');

function activityHarvest(creep) {
  if (creepIsFull(creep)) {
    changeActivity(creep, creep.memory.whenFull);
    return;
  }
  const mySource = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);

  if (!mySource) {
    changeActivity(creep, creep.memory.whenEmpty);
    return;
  }

  const inRange = creep.pos.inRangeTo(mySource, 1);
  if (!inRange)
    moveIgnore(creep, mySource, { maxRooms: 1 });

  const willBeFull = creep.getActiveBodyparts(WORK) * 2 > creep.store.getFreeCapacity();
  creep.harvest(mySource);

  if (willBeFull && inRange) {
    console.log(creep.name + ' will be full');
    changeActivity(creep, creep.memory.whenFull);
    const deltaX = creep.pos.x - mySource.pos.x;
    const deltaY = creep.pos.y - mySource.pos.y;

    const adjacentPosX = creep.pos.x + deltaX;
    const adjacentPosY = creep.pos.y + deltaY;

    const oppositeDirectionFromSource = creep.pos.getDirectionTo(adjacentPosX, adjacentPosY);
    const result = creep.move(oppositeDirectionFromSource);
    console.log(creep.name, ' early move result:', result);
    return;
  }
}

module.exports = { activityHarvest };
