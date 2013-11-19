define(function () {
    return {
    	run: function (testId) {
    		var testModules = window.scenarioReporters || ['scenario/consoleReporter'];
    		testId = testId || window.location.hash.substring(1);
            if (testId) {
            	testModules.push(testId);
            	require(testModules);
            } else {
                window.location = 'scenarios.html';
            }
    	}
    };
});