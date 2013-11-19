define(['gwt/eventAggregator'], function (events) {
	events.subscribe('gwt.scenario.start', function (e, scenario) {
		console.log('Scenario: ' + scenario.title);
	});

	events.subscribe('gwt.step.start', function (e, step) {
		console.log('    ' + step.title);
	});
	events.subscribe('gwt.step.fail', function (e, step) {
		console.error(step.error.stack || step.error.message);
	});

	events.subscribe('gwt.scenario.end', function (e, scenario) {
		var text = scenario.passed ? 'Passed' : 'FAILED';
		if (window.chrome) {
			var color = scenario.passed ? 'green' : 'red';
			console.log('%c' + text + '!', 'color: ' + color);
		} else {
			console.log(text + '!');
		}
	});
});