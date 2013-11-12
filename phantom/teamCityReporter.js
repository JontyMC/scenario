var events = require('./eventAggregator'),
    currentScenario;

function logScenarioEnd() {
    console.log('##teamcity[testSuiteFinished name=\'' + currentScenario.title + '\']');
}

function logStepStart(e, step) {
    console.log('##teamcity[testStarted name=\'' + step.title + '\']');
}

function logStepEnd(e, step) {
    console.log('##teamcity[testFinished name=\'' + step.title + '\']');
}

function logStepError(stepTitle, msg, stack) {
    
}

events.subscribe('gwt.scenario.start', function (e, scenario) {
    currentScenario = scenario;
    console.log('##teamcity[testSuiteStarted name=\'' + scenario.title + '\']');
});

events.subscribe('gwt.scenario.end', logScenarioEnd);

events.subscribe('gwt.step.start', logStepStart);

events.subscribe('gwt.step.end', logStepEnd);

events.subscribe('gwt.step.error', function (e, error) {
    var stack = '',
        writeStep = false;

    error.trace.forEach(function (item) {
        stack = stack + item.file + ':' + item.line + '|n|r';
    });

    console.log('##teamcity[testFailed name=\'' + error.step.title + '\' message=\''+ error.msg +'\' details=\'' + stack + '\']');
    logStepEnd(null, error.step);

    currentScenario.steps.forEach(function (step) {
        if (writeStep) {
            logStepStart(null, step);
            console.log('##teamcity[testFailed name=\'' + step.title + '\']');
            logStepEnd(null, step);
        }

        if (step.title === error.step.title) {
            writeStep = true;
        }
    });

    logScenarioEnd();
});