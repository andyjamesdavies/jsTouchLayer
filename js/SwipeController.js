/*jslint eqeqeq: true, undef: true */
/*global document, TouchLayer_Controller, setTimeout, clearTimeout */
/*
 * Borrows Heavily from Sencha Touch v1.1.1 Tap.js
 * @author andyjamesdavies
 * @created 2012-02-06 
 */
var TouchLayer_SwipeController = function (options) {

	if (!options.eventName || !options.el || !options.callback) {
		return;
	}

	var mainController = new TouchLayer_Controller(),
	runOnBubble = false,
	startTime = null,
	startX = null,
	startY = null,
	swipeThreshold = 105,
	swipeTime = 1000,
	stopped = false,
	preventDefault = true;

	if (options.preventDefault !== undefined) {
		preventDefault = options.preventDefault;
	}

	var onTouchStart = function (e) {

		if (e.originalEvent) {
			e = e.originalEvent;
		}

		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();		
		}

		if (e.touches) { //e.pageX / pageY give 0 values in android
			startX = e.touches[0].pageX;
			startY = e.touches[0].pageY;
		} else if (e.pageX && e.pageY) {
			startX = e.pageX;
			startY = e.pageY;
		}

		startTime = e.timeStamp;
		stopped = false;
	};

	var onTouchMove = function (e) {
		
		if (startX && startY) {
			if (e.originalEvent) {
				e = e.originalEvent;
			}
	
			if (preventDefault) {
				e.preventDefault();
				e.stopPropagation();
			}
	
			var deltaX = null,
				deltaY = null;
			if (e.touches) { //e.pageX / pageY give 0 values in android
				deltaY = e.touches[0].pageY - startY;
				deltaX = e.touches[0].pageX - startX;	
			} else if (e.pageX && e.pageY) {
				deltaY = e.pageY - startY;
				deltaX = e.pageX - startX;
			}
	
			if (deltaX && deltaY) {
				var absDeltaY = Math.abs(deltaY),
					absDeltaX = Math.abs(deltaX),
					deltaTime = e.timeStamp - startTime;
	
				// If the swipeTime is over, we are not gonna check for it again
				if (absDeltaY - absDeltaX > 3 || deltaTime > swipeTime) {		
					stopped = true;
	
				} else if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
					// If this is a swipe, a scroll is not possible anymore
					var info = {
							direction: (deltaX < 0) ? 'left' : 'right',
							distance: absDeltaX,
							deltaTime: deltaTime,
							deltaX: deltaX,
							deltaY: deltaY
						};	
	
					if (options.eventName === 'swipe') {
						var data = mainController.makeReturnData(e, options.el, info);
						mainController.fire('swipe', options.callback, data);
	
						if (preventDefault) {
							e.preventDefault();
							e.stopPropagation();
						}
					}
					stopped = true;
				}
			}
		}
	};

	var onTouchEnd = function () {
		stopped = true;
		startX = startY = null;
	};
	
	mainController.bind(options.el, 'touchstart', onTouchStart, runOnBubble);
	mainController.bind(options.el, 'touchmove', onTouchMove, runOnBubble);
	mainController.bind(options.el, 'touchend', onTouchEnd, runOnBubble);
	
	return {
		unbind: function  () {
			mainController.unbind(options.el, 'touchstart', onTouchStart);
			mainController.unbind(options.el, 'touchmove', onTouchMove);
			mainController.unbind(options.el, 'touchend', onTouchEnd);
		}
	};
};