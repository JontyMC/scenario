define(['jquery'],  function ($) {
	var config = {
		interval: 200,
		timeout: 2000
	};
	
	function waitFor(dfd, selector, timeout, interval, time) {
		var $this = $(selector);
		if ($this.length > 0) {
			dfd.resolve($this);
		} else if (time > timeout) {
			dfd.reject('Timed out for selector ' + selector);
		} else {
			window.setTimeout(function () {
				waitFor(dfd, selector, timeout, interval, time + interval);
			}, interval);
		}
	}

	return {
		config: config,
		element: function (selector, timeout, interval) {
			var dfd = $.Deferred();
			waitFor(dfd, selector, timeout || config.timeout, interval || config.interval, 0);
			return dfd.promise();
		}
	};
});