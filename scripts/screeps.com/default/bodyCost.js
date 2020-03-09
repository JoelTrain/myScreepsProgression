function bodyCost(body) {
  return body.reduce(function (cost, part) {
    return cost + BODYPART_COST[part];
  }, 0);
}

module.exports = { bodyCost };
