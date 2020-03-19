function getHubRooms() {
  let hubRooms = [];
  for (const room of Object.values(Game.rooms)) {
    if (!room.controller || !room.controller.my)
      continue;

    const spawnCount = room.find(FIND_MY_SPAWNS).length;
    if (spawnCount === 0)
      continue;

    hubRooms.push(room.name);
  }
  return hubRooms;
}

module.exports = { getHubRooms };
