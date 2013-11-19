define(['gwt/eventAggregator'], function (events) {
	function report(type, obj) {
		if (window.callPhantom) {
			window.callPhantom({
                type: type,
                obj: obj
            });
		}
	}

    events.subscribe('gwt.scenario.start', function (e, scenario) {
        report('gwt.scenario.start', scenario);
    });

    events.subscribe('gwt.step.start', function (e, step) {
        report('gwt.step.start', step);
    });

    events.subscribe('gwt.step.fail', function (e, step) {
        report('gwt.step.fail', step);
    });

    events.subscribe('gwt.step.end', function (e, step) {
        report('gwt.step.end', step);
    });

    events.subscribe('gwt.scenario.end', function (e, scenario) {
        report('gwt.scenario.end', scenario);
    });
});