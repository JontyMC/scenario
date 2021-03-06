var events = require('./eventAggregator');

events.subscribe('scenario.scenario.start', function (e, scenario) {
    console.log('##teamcity[testSuiteStarted name=\'' + scenario.title + '\']');
});

events.subscribe('scenario.step.start', function (e, step) {
    console.log('##teamcity[testStarted name=\'' + step.title + '\']');
});

events.subscribe('scenario.step.fail', function (e, step) {
    console.log('##teamcity[testFailed name=\'' + step.title + '\' message=\''+ step.error.message +'\' details=\'' + step.error.stack + '\']');
});

events.subscribe('scenario.step.end', function (e, step) {
    console.log('##teamcity[testFinished name=\'' + step.title + '\']');
});

events.subscribe('scenario.scenario.end', function (e, scenario) {
    console.log('##teamcity[testSuiteFinished name=\'' + scenario.title + '\']');
});