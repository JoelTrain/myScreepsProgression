let harvestLocations = {};

try {
  harvestLocations = require(`./harvestLocations-${Game.shard.name}`).harvestLocations;
}
catch (_) {
  console.log('No harvest locations defined for this shard.', Game.shard.name);
}

module.exports = { harvestLocations };
