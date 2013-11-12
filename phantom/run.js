var fs = require('fs'),
    system = require('system'),
    args = system.args;

if (args.length < 3) {
    console.log('Usage: phantomjs phantomTestRunner.js <test-name>');
    console.log('Options: --no-debug --no-console-reporter --no-snapshot');
    phantom.exit(1);
}

var config = require(fs.absolute('gwt')),
    url = args[1],
    test = 'tests/' + args[2],
    testUrl = url + '#' + test,
    consoleReporter = !findArg('--no-console-reporter'),
    teamcity = findArg('--teamcity'),
    snapshot = !findArg('--no-snapshot'),
    debug = !findArg('--no-debug');

var page = require('webpage').create(),
    events = require(fs.absolute('gwt/phantom/eventAggregator')),
    scenario, step;

if (consoleReporter) {
    require(fs.absolute('gwt/phantom/consoleReporter'));
}
if (config.reporters) {
    config.reporters.forEach(function (reporter) {
        require(reporter);
    });
}

phantom.onError = function (msg, trace) {
    var msgStack = ['PHANTOM ERROR: ' + msg];
    if (trace && trace.length) {
        msgStack.push('TRACE:');
        trace.forEach(function (t) {
            msgStack.push(' -> ' + (t.file || t.sourceURL) + ': ' + t.line + (t.function ? ' (in function ' + t.function + ')' : ''));
        });
    }
    console.error(msgStack.join('\n'));
    phantom.exit(1);
};

if (debug) {
    page.onConsoleMessage = function (msg) {
        console.log(msg);
    };
}

page.onInitialized = function() {
    page.evaluate(function() {
        window.gwtReporters = ['gwt/phantom/phantomReporter'];
    });
};

page.onError = function (msg, trace) {
    if (step) {
        events.publish('gwt.step.error', { step: step, msg: msg, trace: trace });
    }
    phantom.exit(1);
};

page.onCallback = function (event) {
    events.publish(event.type, event.obj);

    switch(event.type) {
        case 'gwt.scenario.start':
            scenario = event.obj;
            break;
        case 'gwt.scenario.end':
            if (snapshot) {
                page.render(test + '.png');
            }
            phantom.exit(0);
            break;
        case 'gwt.step.start':
          step = event.obj;
          break;
    }
};

if (debug) {
    console.log('Running scenario: ' + testUrl);
}
page.open(testUrl);

function findArg(arg) {
    for (var i = 0; i < args.length; i++) {
        if (args[i] === arg) return args[i];
    }
}