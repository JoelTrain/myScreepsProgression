// need 1/4 work, 1/4 carry, 1/2 move

// medium body = 16

function workCarryMoveBody(totalLimbCount) {
  const workLimbCount = Math.floor(totalLimbCount / 4);
  const carryLimbCount = Math.floor(totalLimbCount / 4);
  const moveLimbCount = Math.floor(totalLimbCount / 2);

  return new Array(totalLimbCount).fill(WORK, 0, workLimbCount).fill(CARRY, workLimbCount, carryLimbCount).fill(MOVE, carryLimbCount, moveLimbCount);
}

module.exports = { workCarryMoveBody };
