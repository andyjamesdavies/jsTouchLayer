

var TouchLayer_Controller = function () {
	
	var lockedEvents = [];
	
	var isLocked = function (event) {
		return (lockedEvents[event] !== undefined);
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
			
		    thisEl.addEventListener(eventName, callback, callThisOnBubble);
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