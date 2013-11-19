var events = require('./eventAggregator');

events.subscribe('scenario.scenario.start', function (e, scenario) {
    console.log('Scenario: ' + scenario.title);
});

events.subscribe('scenario.step.start', function (e, step) {
    console.log('    ' + step.title);
});

events.subscribe('scenario.step.fail', function (e, step) {
    console.error(step.error.stack || step.error.message);
});

events.subscribe('scenario.scenario.end', function (e, scenario) {
    var text = scenario.error ? 'FAILED' : 'Passed';
    console.log(text + '!');
});