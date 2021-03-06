/*jslint eqeqeq: true, undef: true */
/*global document */
var TouchLayer_Controller = function () {
	
	var lockedEvents = [];
	
	var isLocked = function (event) {
		return (lockedEvents[event] !== undefined);
	};
	
	var touchHandlers = {
	        touchstart  : 'ontouchstart' in document.documentElement ? 'touchstart' : 'mousedown',
	        touchmove   : 'ontouchmove' in document.documentElement ? 'touchmove' : 'mousemove',
	        touchend    : 'ontouchend' in document.documentElement ? 'touchend' : 'mouseup'
		};
	
	return {
		bind: function (thisEl, eventName, callback, callOnBubble) {
			var callThisOnBubble = false;
			
			if (!thisEl || !eventName || !callback) {
				return;
			}
			
			if (callOnBubble !== undefined) {
				callThisOnBubble = callOnBubble;
			}
			
			if (touchHandlers[eventName] !== undefined) {
				thisEl.addEventListener(touchHandlers[eventName], callback, callThisOnBubble);
			}
		},
		unbind: function (thisEl, eventName, callback) {
			if (!thisEl || !eventName || !callback) {
				return;
			}
			
			if (touchHandlers[eventName] !== undefined) {
				thisEl.removeEventListener(touchHandlers[eventName], callback);
			}
		},
		fire: function (eventName, callback, data) {
			if (!eventName || !callback) {
				return;
			}
			
			data.type = eventName;
			
			if (!isLocked(eventName)) {
				callback(data);
			}
		},
		lock: function (events) {
			if (events.length > 0) {
				for (var i = 0; i < events.length; i++) {
					if (!lockedEvents[events[i]]) {
						lockedEvents.push(events[i]);
					}
				}
			}
		},
		unlock: function (events) {
			var tmp = [];
			if (events.length > 0) {
				for (var i = 0; i < lockedEvents.length; i++) {
					if (!events[lockedEvents[i]]) {
						tmp.push(lockedEvents[i]);
					}
				}
				lockedEvents = tmp;
			}
		},
		makeReturnData: function (e, targetEl, data) {
			return {
				originalEvent: e,
				target: targetEl,
				data: data
			};
		}
	};
};