define(['gwt/eventAggregator'], function (events) {
	events.subscribe('gwt.scenario.start', function (e, scenario) {
		console.log('Scenario: ' + scenario.title);
	});

	events.subscribe('gwt.step.start', function (e, step) {
		console.log('    ' + step.title);
	});

	events.subscribe('gwt.scenario.end', function (e, scenario) {
		if (window.chrome) {
			console.log('%cPassed!', 'color: green');
		} else {
			console.log('Passed!');
		}
	});
});