/*jslint eqeqeq: true, undef: true */
/*global document, TouchLayer_Controller, setTimeout, clearTimeout */
/*
 * Borrows Heavily from Sencha Touch v1.1.1 Tap.js
 * @author andyjamesdavies
 * @created 2012-02-06 
 */
var TouchLayer_DragController = function (options) {

	if (!options.eventName || !options.el || !options.callback) {
		return;
	}

	var mainController = new TouchLayer_Controller(),
	runOnBubble = false,
	dragThreshold = 5,
	horizontal = true,
	vertical = true,
	startX = 0,
	previousX = 0,
	startY = 0,
	previousY = 0,
	startTime = '',
	previousTime = '',
	dragging = false;
	
	var isDragging = function (info) {
		return (
				(horizontal && info.absDeltaX >= dragThreshold) || 
				(vertical && info.absDeltaY >= dragThreshold)
		);
	};
	
	var onTouchStart = function (e) {
		if (e.originalEvent) {
			e = e.originalEvent;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		if (e.touches[0]) {
			startX = previousX = e.touches[0].pageX; 
			startY = previousY = e.touches[0].pageY;
			startTime = previousTime = e.timeStamp; 
			previousTime = e.timeStamp;
			dragging = false;
		}
	};
	
	var onTouchMove = function (e) {
		if (e.originalEvent) {
			e = e.originalEvent;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		if (e.touches[0]) { //e.pageY / e.pageX returns 0 in android 
			var info = {
					startX: startX,
					startY: startY,
					prevX: previousX,
					prevY: previousY,
					deltaY: e.touches[0].pageY - startY,
					deltaX: e.touches[0].pageX - startX,
					absDeltaY: 0,
					absDeltaX: 0,
					deltaTime: e.timeStamp - startTime
				};

			info.absDeltaY = Math.abs(info.deltaY);
			info.absDeltaX = Math.abs(info.deltaX);
	
			if (!dragging) {
				if ((!e.touches || e.touches.length < 2) && isDragging(info)) {
					dragging = true;
	
					if (options.eventName === 'dragstart') {
						var dataStart = mainController.makeReturnData(e, options.el, info);
						mainController.fire('dragstart', options.callback, dataStart);
					}
				}
			}

			if (options.eventName === 'drag') {
				var dataDrag = mainController.makeReturnData(e, options.el, info);
				mainController.fire('drag', options.callback, dataDrag);
				
				previousX = e.touches[0].pageX;
				previousY = e.touches[0].pageY;
			}
		}
	};
	
	var onTouchEnd = function (e) {
		if (e.originalEvent) {
			e = e.originalEvent;
		}
		
		e.preventDefault();
		e.stopPropagation();
		
		if (dragging) {
			if (options.eventName === 'dragend') {
				var dataDrag = mainController.makeReturnData(e, options.el);
				mainController.fire('dragend', options.callback, dataDrag);
			}
		}
		dragging = false;
	};
	
	mainController.bind(options.el, 'touchstart', onTouchStart, runOnBubble);
	mainController.bind(options.el, 'touchmove', onTouchMove, runOnBubble);
	mainController.bind(options.el, 'touchend', onTouchEnd, runOnBubble);
};