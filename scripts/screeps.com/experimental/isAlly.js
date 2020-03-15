const { allies } = require('./allies');

function isAlly(object) {
  if (object && (object.my || (object.owner && allies.includes(object.owner))))
    return true;

  return false;
}

module.exports = { isAlly };
