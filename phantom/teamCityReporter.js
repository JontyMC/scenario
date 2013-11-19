var events = require('./eventAggregator');

events.subscribe('gwt.scenario.start', function (e, scenario) {
    console.log('##teamcity[testSuiteStarted name=\'' + scenario.title + '\']');
});

events.subscribe('gwt.step.start', function (e, step) {
    console.log('##teamcity[testStarted name=\'' + step.title + '\']');
});

events.subscribe('gwt.step.fail', function (e, step) {
    console.log('##teamcity[testFailed name=\'' + step.title + '\' message=\''+ step.error.message +'\' details=\'' + step.error.stack + '\']');
});

events.subscribe('gwt.step.end', function (e, step) {
    console.log('##teamcity[testFinished name=\'' + step.title + '\']');
});

events.subscribe('gwt.scenario.end', function (e, scenario) {
    console.log('##teamcity[testSuiteFinished name=\'' + scenario.title + '\']');
});