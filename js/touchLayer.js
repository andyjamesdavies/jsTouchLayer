/*jslint eqeqeq: true, undef: true */
/*global TouchLayer_TapController, TouchLayer_DragController, TouchLayer_SwipeController */
var TouchLayer = function () {
	
	var EventToClassMap = {
			'tapstart': TouchLayer_TapController,
		    'tapcancel': TouchLayer_TapController,
		    'tap': TouchLayer_TapController, 
		    'doubletap': TouchLayer_TapController, 
		    'taphold': TouchLayer_TapController,
		    'singletap': TouchLayer_TapController,
		    'drag': TouchLayer_DragController,
		    'twofingerdrag': TouchLayer_DragController,
		    'dragstart': TouchLayer_DragController,
		    'dragend': TouchLayer_DragController,
		    'swipe': TouchLayer_SwipeController
		},
	boundEvents = [];
	
	return {
		bind: function (eventName, targetElem, callback, options) {

			if (!eventName || !targetElem || !callback) {
				return;
			}
			
			if (!options) {
				options = {};
			}
			
			if (EventToClassMap[eventName]) {
				
				options.eventName = eventName;
				options.el = targetElem;
				options.callback = callback;
				
				var id = boundEvents.length;
				boundEvents[id] = new EventToClassMap[eventName](options);
				return id;
			}
		},
		unbind: function (id) {
			if (boundEvents[id] !== null) {
				boundEvents[id].unbind();
				boundEvents[id] = null;
			}
		}
	};
};