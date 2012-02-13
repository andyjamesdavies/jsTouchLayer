/*jslint eqeqeq: true, undef: true */
/*global window, document, Tap, $ */
/*
 * Borrows Heavily from Sencha Touch v1.1.1 Manager.js
 * @author andyjamesdavies
 * @created 2012-02-07 
 * @version 0.1
 */
var TouchLayer = window.TouchLayer || {};

TouchLayer = (function (options) {
	
	if (TouchLayer.Tap) {
		TouchLayer.Tap({
			target: options.target
		}).init();
		
		TouchLayer.Swipe({
			target: options.target
		}).init();
		
		TouchLayer.Drag({
			target: options.target
		}).init();
	}

	if (options.onEvent) {
		var onEvent = function (e, data) {
			if (options.onEvent) {
				options.onEvent(e, data);
			}
		};
		
		if (TouchLayer.Tap) {
			TouchLayer.addEventListener('tap', options.target, onEvent);
			TouchLayer.addEventListener('tapstart', options.target, onEvent);
			TouchLayer.addEventListener('taphold', options.target, onEvent);
			TouchLayer.addEventListener('tapcancel', options.target, onEvent);
			TouchLayer.addEventListener('singletap', options.target, onEvent);
			TouchLayer.addEventListener('doubletap', options.target, onEvent);
		}
		
		if (TouchLayer.Swipe) {
			TouchLayer.addEventListener('swipe', options.target, onEvent);
		}
		
		if (TouchLayer.Drag) {
			TouchLayer.addEventListener('drag', options.target, onEvent);
			TouchLayer.addEventListener('dragstart', options.target, onEvent);
			TouchLayer.addEventListener('dragend', options.target, onEvent);
		}

		TouchLayer.addEventListener('click', options.target, onEvent);
		
		TouchLayer.addEventListener('touchstart', options.target, onEvent);
		TouchLayer.addEventListener('touchmove', options.target, onEvent);
		TouchLayer.addEventListener('touchend', options.target, onEvent);
	}
	
	var onTouchStart = function (e) {
		e.preventDefault();
        e.stopPropagation();
	};
	
	var onTouchMove = function (e) {
		e.preventDefault();
        e.stopPropagation();
	};
	
	var onTouchEnd = function (e) {
		e.preventDefault();
        e.stopPropagation();
	};
	
	TouchLayer.addEventListener('touchstart', options.target, onTouchStart);
	TouchLayer.addEventListener('touchmove', options.target, onTouchMove);
	TouchLayer.addEventListener('touchend', options.target, onTouchEnd);
});

TouchLayer.addEventListener = function (eventName, target, callback) {
	var thisCallback = function () { },
		thisData = {};
	
	if (!eventName || !target) {
		return;
	}

	if (callback) {
		thisCallback = function (e, data) {
			if (e.originalEvent) {
				callback(e.originalEvent, data); //turn event object into native js event object
			} else {
				callback(e, data);
			}
		};
	}
	$(target).bind(eventName, thisCallback);
};

TouchLayer.fire = function (name, target, data) {
	var event = {};
	
	if (!name || !target) {
		return;
	}
	if (!TouchLayer.isLocked(name)) {
		$(target).trigger(name, [ data ]);
	}
};

TouchLayer.locks = [];

TouchLayer.lock = function (events) {

	if (events.length > 0) {
		for (var i = 0; i < events.length; i++) {
			if (!TouchLayer.locks[events[i]]) {
				TouchLayer.locks.push(events[i]);
			}
		}
	}
};

TouchLayer.unlock = function (events) {
	var tmp = [];
	if (events.length > 0) {
		for (var i = 0; i < TouchLayer.locks.length; i++) {
			if (!events[TouchLayer.locks[i]]) {
				tmp.push(TouchLayer.locks[i]);
			}
		}
		TouchLayer.locks = tmp;
	}
};

TouchLayer.isLocked = function (event) {
	return (TouchLayer.locks[event] !== undefined);
};