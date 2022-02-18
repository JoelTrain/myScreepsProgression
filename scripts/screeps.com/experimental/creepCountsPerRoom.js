let creepCountsPerRoom = {};

try {
  creepCountsPerRoom = require(`./creepCountsPerRoom-${Game.shard.name}`).creepCountsPerRoom;
}
catch (_) {
  console.log('No counts per room defined for this shard.', Game.shard.name);
}
module.exports = { creepCountsPerRoom };
