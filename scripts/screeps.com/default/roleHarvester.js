const { activity, changeActivity } = require('./activity');
const roleHarvester = {
    run: function(creep){
        if(this[creep.memory.activity]) {
            this[creep.memory.activity](creep);
            return;
        }
        if(activity[creep.memory.activity]) {
            activity[creep.memory.activity](creep);
            return;
        }

        changeActivity(creep, 'default');
    },
    'default': function(creep) {
        changeActivity(creep, 'searching for source');
        return;
    },
};

module.exports = { roleHarvester };
