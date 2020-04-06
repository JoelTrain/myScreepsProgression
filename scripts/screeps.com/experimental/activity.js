const { activitySetup } = require('./activitySetup');
const { changeActivity } = require('./changeActivity');
const { activityTowerAttack } = require('./activityTowerAttack');
const { activityLinkTransfer } = require('./activityLinkTransfer');
const { activityPickup } = require('./activityPickup');
const { activityDepositIntoStorage } = require('./activityDepositIntoStorage');
const { activityWithdrawFromStorage } = require('./activityWithdrawFromStorage');
const { activityHarvestInPlace } = require('./activityHarvestInPlace');
const { activityMoveToRallyPoint } = require('./activityMoveToRallyPoint');
const { activityMoveToTarget } = require('./activityMoveToTarget');
const { activityMoveToRoom } = require('./activityMoveToRoom');
const { activityReturnToPickup } = require('./activityReturnToPickup');
const { activityReturnToDropoff } = require('./activityReturnToDropoff');
const { activityAttack } = require('./activityAttack');
const { activityHarvest } = require('./activityHarvest');
const { activityTransferring } = require('./activityTransferring');
const { activityBuilding } = require('./activityBuilding');
const { activityRepair } = require('./activityRepair');
const { activityUpgrading } = require('./activityUpgrading');

const activity = {
  'tower attack': activityTowerAttack,
  'link transfer': activityLinkTransfer,
  'pickup': activityPickup,
  'deposit': activityDepositIntoStorage,
  'withdraw': activityWithdrawFromStorage,
  'harvest in place': activityHarvestInPlace,
  'move to rally point': activityMoveToRallyPoint,
  'move to position': activityMoveToTarget,
  'move to room': activityMoveToRoom,
  'return to pickup': activityReturnToPickup,
  'return to dropoff': activityReturnToDropoff,
  'attack': activityAttack,
  'harvest': activityHarvest,
  'transfer': activityTransferring,
  'build': activityBuilding,
  'repairing': activityRepair,
  'repair': activityRepair,
  'upgrade': activityUpgrading,
};

module.exports = {
  activity,
  activitySetup,
  changeActivity,
};
