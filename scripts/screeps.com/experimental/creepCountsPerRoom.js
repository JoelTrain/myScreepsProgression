let creepCountsPerRoom = function() {};

try {
  creepCountsPerRoom = require(`./creepCountsPerRoom-${Game.shard.name}`).creepCountsPerRoom;
}
catch (_) {
  console.log('No counts per room defined for this shard.', Game.shard.name);
  const defaultCounts = {
    defender: 0,
    heavyHarvester: 0,
    carrier: 0,
    attacker: 0,
    builder: 0,
    repairer: 0,
    upgrader: 0,
    remoteHarvester: 0,
    remoteCarrier: 0,
    claimer: 0,
  };
  creepCountsPerRoom = () => defaultCounts;
}
module.exports = { creepCountsPerRoom };
