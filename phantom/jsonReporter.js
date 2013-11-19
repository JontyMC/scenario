var events = require('./eventAggregator');

events.subscribe('scenario.scenario.end', function (e, scenario) {
    console.log('##jsonBegin');
    console.log(JSON.stringify(scenario, null, 2));
    console.log('##jsonEnd');
});