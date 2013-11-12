define(function () {
    return {
    	run: function (testId) {
    		var testModules = window.gwtReporters || ['gwt/consoleReporter'];
    		testId = testId || window.location.hash.substring(1);
    		testModules.push(testId);
    		require(testModules);
    	}
    };
});