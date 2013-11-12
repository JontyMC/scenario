var events = require('./eventAggregator');

events.subscribe('gwt.scenario.start', function (e, scenario) {
    console.log('Scenario: ' + scenario.title);
});

events.subscribe('gwt.scenario.end', function (e, scenario) {
    console.log('Passed!');
});

events.subscribe('gwt.step.start', function (e, step) {
    console.log('    ' + step.title);
});

events.subscribe('gwt.step.error', function (e, error) {
    console.log(error.msg);
    error.trace.forEach(function (item) {
        console.log('  ', item.file, ':', item.line);
    })
});