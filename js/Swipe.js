/*jslint eqeqeq: true, undef: true */
/*global window, document, TouchLayer, setTimeout, clearTimeout */
/*
 * Borrows Heavily from Sencha Touch v1.1.1 Swipe.js
 * @author andyjamesdavies
 * @created 2012-02-07 
 * @version 0.1
 */
TouchLayer.Swipe = function (options) {
	var target = document,
		startTime = null,
		startX = null,
		startY = null,
		swipeThreshold = 35,
		swipeTime = 1000,
		stopped = false;

	if (options.target) {
		target = options.target;
	}

	return {
		onTouchStart: function (e) {
			startTime = e.timeStamp;
			startX = e.pageX;
			startY = e.pageY;
			stopped = false;
			TouchLayer.lock(['scroll', 'scrollstart', 'scrollend']);
		},
		onTouchMove: function (e) {
			if (!stopped) {
				var deltaY = e.pageY - startY,
				deltaX = e.pageX - startX,
				absDeltaY = Math.abs(deltaY),
				absDeltaX = Math.abs(deltaX),
				deltaTime = e.timeStamp - startTime;

				// If the swipeTime is over, we are not gonna check for it again
				if (absDeltaY - absDeltaX > 3 || deltaTime > swipeTime) {
					TouchLayer.unlock(['drag', 'dragstart', 'dragend']);			
					stopped = true;

				} else if (absDeltaX > swipeThreshold && absDeltaX > absDeltaY) {
					// If this is a swipe, a scroll is not possible anymore

					TouchLayer.fire('swipe', target, {
						direction: (deltaX < 0) ? 'left' : 'right',
						distance: absDeltaX,
						deltaTime: deltaTime,
						deltaX: deltaX           
					});
					stopped = true;
				}
			}
		},
		init: function () {
			TouchLayer.addEventListener('touchstart', target, this.onTouchStart);
			TouchLayer.addEventListener('touchmove', target, this.onTouchMove);
		}
	};
};