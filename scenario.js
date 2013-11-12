define(['gwt/eventAggregator'], function (events) {
	var currentSteps = [];

	function Step(title, action) {
		this.title = title;
		this.action = action;
	}

	Step.prototype.run = function (previousResult) {
		var that = this,
			result = this.action(previousResult);

		if (result && result.then) {
			// result is a promise
			return result.fail(function (result) {
				throw new Error(result);
			});
		}

		if (!result) {
			result = previousResult;
		}

		return {
			// fake a promise
			then: function (action) {
				action(result);
			}
		};
	};

	function Scenario(title, action) {
		action();
		this.title = title;
		this.steps = currentSteps;
	}

	Scenario.prototype.runStep = function (index, previousResult) {
		var step, that = this;

		if (this.steps.length <= index) {
			events.publish('gwt.scenario.end', this);
			return;
		}
		
		step = this.steps[index];
		events.publish('gwt.step.start', step);
		step.run(previousResult).then(function (result) {
			events.publish('gwt.step.end', step);
			that.runStep(index + 1, result);
		});
	};

	Scenario.prototype.run = function () {
		events.publish('gwt.scenario.start', this);
		this.runStep(0);
	};

	String.prototype.given =
	String.prototype.when =
	String.prototype.then =
	String.prototype.and =
	String.prototype._ = function (action) {
		currentSteps.push(new Step(this.toString(), action));
	};

	return function (title, action) {
		var scenario = new Scenario(title, action);
		scenario.run();
	}
});