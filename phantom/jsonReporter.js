var events = require('./eventAggregator');

events.subscribe('gwt.scenario.end', function (e, scenario) {
    console.log(JSON.stringify(scenario, null, 2));
});