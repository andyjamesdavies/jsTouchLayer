/*jslint eqeqeq: true, undef: true */
/*global window, document, TouchLayer, setTimeout, clearTimeout */
/*
 * Borrows Heavily from Sencha Touch v1.1.1 Drag.js
 * @author andyjamesdavies
 * @created 2012-02-09 
 * @version 0.1
 */
TouchLayer.Drag = function (options) {
	var target = document,
		handles = [
		    'dragstart',
		    'drag',
		    'dragend'
		],
		dragThreshold = 5,
		direction = 'both',
		horizontal = true,
		vertical = true,
		startX = 0,
		previousX = 0,
		startY = 0,
		previousY = 0,
		startTime = '',
		previousTime = '',
		dragging = false;
	
	if (options.target) {
		target = options.target;
	}
	
	var isDragging = function (info) {
        return ((horizontal && info.absDeltaX >= dragThreshold) || (vertical && info.absDeltaY >= dragThreshold));
    };

	return {
		onTouchStart: function (e) {
			startX = previousX = e.pageX;
			startY = previousY = e.pageY;
			startTime = previousTime = e.timeStamp;
			console.log('touchstart');
			dragging = false;
		},
		onTouchMove: function (e) {
			var info = {
					deltaY: e.pageY - startY,
					deltaX: e.pageX - startX,
					absDeltaY: 0,
					absDeltaX: 0,
					deltaTime: e.timeStamp - startTime
				};
				
			info.absDeltaY = Math.abs(info.deltaY);
			info.absDeltaX = Math.abs(info.deltaX);
			
			if (!dragging) {
				if ((!e.touches || e.touches.length < 2) && isDragging(info)) {
					dragging = true;
					
					TouchLayer.fire('dragstart', target, e);
					TouchLayer.fire('drag', target, e);
				}
			} else {
				TouchLayer.fire('drag', target, e);
			}
		},
		onTouchEnd: function (e) {
			if (dragging) {
				TouchLayer.fire('dragend', target, e);
	        }
			dragging = false;
		},
		init: function () {
			TouchLayer.addEventListener('touchstart', target, this.onTouchStart);
			TouchLayer.addEventListener('touchmove', target, this.onTouchMove);
			TouchLayer.addEventListener('touchend', target, this.onTouchEnd);
		}
	};
};