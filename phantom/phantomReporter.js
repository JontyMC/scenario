define(['scenario/eventAggregator'], function (events) {
	function report(type, obj) {
		if (window.callPhantom) {
			window.callPhantom({
                type: type,
                obj: obj
            });
		}
	}

    events.subscribe('scenario.scenario.start', function (e, scenario) {
        report('scenario.scenario.start', scenario);
    });

    events.subscribe('scenario.step.start', function (e, step) {
        report('scenario.step.start', step);
    });

    events.subscribe('scenario.step.fail', function (e, step) {
        report('scenario.step.fail', step);
    });

    events.subscribe('scenario.step.end', function (e, step) {
        report('scenario.step.end', step);
    });

    events.subscribe('scenario.scenario.end', function (e, scenario) {
        report('scenario.scenario.end', scenario);
    });
});