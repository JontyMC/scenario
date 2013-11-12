define(['jquery'], function ($) {
    var o = $({});

    return {
        subscribe: function () {
            o.on.apply(o, arguments);
        },
        unsubscribe: function () {
            o.off.apply(o, arguments);
        },
        publish: function () {
            o.trigger.apply(o, arguments);
        }
    };
});