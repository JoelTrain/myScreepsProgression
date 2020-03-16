const { activitySetup } = require('./activitySetup');
const { changeActivity } = require('./changeActivity');
const { activityTowerAttack } = require('./activityTowerAttack');
const { activityPickup } = require('./activityPickup');
const { activityDepositIntoStorage } = require('./activityDepositIntoStorage');
const { activityWithdrawFromStorage } = require('./activityWithdrawFromStorage');
const { activityHarvestInPlace } = require('./activityHarvestInPlace');
const { activityMoveToRallyPoint } = require('./activityMoveToRallyPoint');
const { activityMoveToTarget } = require('./activityMoveToTarget');
const { activityAttack } = require('./activityAttack');
const { activityHarvest } = require('./activityHarvest');
const { activityTransferring } = require('./activityTransferring');
const { activityBuilding } = require('./activityBuilding');
const { activityRepair } = require('./activityRepair');
const { activityUpgrading } = require('./activityUpgrading');

const activity = {
  'tower attack': activityTowerAttack,
  'pickup': activityPickup,
  'deposit': activityDepositIntoStorage,
  'withdraw': activityWithdrawFromStorage,
  'harvest in place': activityHarvestInPlace,
  'move to rally point': activityMoveToRallyPoint,
  'move to position': activityMoveToTarget,
  'attack': activityAttack,
  'harvest': activityHarvest,
  'transferring': activityTransferring,
  'transfer': activityTransferring,
  'building site': activityBuilding,
  'build': activityBuilding,
  'repairing': activityRepair,
  'repair': activityRepair,
  'upgrading controller': activityUpgrading,
  'upgrade': activityUpgrading,
};

module.exports = {
  activity,
  activitySetup,
  changeActivity,
};
