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
		    'dragstart': TouchLayer_DragController,
		    'dragend': TouchLayer_DragController,
		    'swipe': TouchLayer_SwipeController
		},
	boundEvents = [];
	
	return {
		bind: function (eventName, targetElem, callback) {

			if (!eventName || !targetElem || !callback) {
				return;
			}
			
			if (EventToClassMap[eventName]) {
				
				boundEvents[boundEvents.length] = new EventToClassMap[eventName]({
					eventName: eventName,
					el: targetElem,
					callback: callback
				});
			}
		}
	};
};