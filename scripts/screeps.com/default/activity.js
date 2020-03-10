const {
  activitySetup,
  changeActivity,
} = require('./common');

const { activityTowerAttack } = require('./activityTowerAttack');
const { activityPickup } = require('./activityPickup');
const { activityDepositIntoStorage } = require('./activityDepositIntoStorage');
const { activityHarvestInPlace } = require('./activityHarvestInPlace');
const { activityMoveToRallyPoint } = require('./activityMoveToRallyPoint');
const { activityAttack } = require('./activityAttack');
const { activityHarvest } = require('./activityHarvest');
const { activityTransferring } = require('./activityTransferring');
const { activityBuilding } = require('./activityBuilding');
const { activityUpgrading } = require('./activityUpgrading');

const activity = {
  'tower attack': activityTowerAttack,
  'pickup': activityPickup,
  'deposit': activityDepositIntoStorage,
  'harvest in place': activityHarvestInPlace,
  'move to rally point': activityMoveToRallyPoint,
  'attack': activityAttack,
  'harvest': activityHarvest,
  'transferring': activityTransferring,
  'building site': activityBuilding,
  'upgrading controller': activityUpgrading,
};

module.exports = {
  activity,
  activitySetup,
  changeActivity,
};
