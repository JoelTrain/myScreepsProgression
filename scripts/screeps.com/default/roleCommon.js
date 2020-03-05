const { activity, changeActivity } = require('./activity');
const roleCommon = {
    run: function(creep){
        if(activity[creep.memory.activity]) {
            activity[creep.memory.activity](creep);
            return;
        }

        changeActivity(creep, 'default');
    },
};

module.exports = { roleCommon };
