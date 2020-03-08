function pickRandomFromList(list) {
  if (!list.length) {
    throw Error(`Cannot pick at random from ${List}`);
  }

  const index = Math.floor(Math.random() * list.length);
  return list[index];
}

module.exports = { pickRandomFromList };
