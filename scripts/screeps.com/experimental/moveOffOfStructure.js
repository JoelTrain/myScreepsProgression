const { pickRandomFromList } = require('./pickRandomFromList');

function moveOffOfStructure(creep) {
  const structuresAtMyPos = creep.pos.lookFor(LOOK_STRUCTURES);
  if (structuresAtMyPos.length) {
    const randomDirection = pickRandomFromList([TOP, TOP_LEFT, TOP_RIGHT, LEFT, RIGHT, BOTTOM, BOTTOM_LEFT, BOTTOM_RIGHT]);
    creep.move(randomDirection);
    return true;
  }

  return false;
}


module.exports = { moveOffOfStructure };
