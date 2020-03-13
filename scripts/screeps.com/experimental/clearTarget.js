function clearTarget(creep) {
  delete creep.memory.targetId;
}

module.exports = { clearTarget };
