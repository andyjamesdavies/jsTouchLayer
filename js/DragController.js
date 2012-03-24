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
	dragThreshold = 100,
	horizontal = true,
	vertical = true,
	startX = 0,
	previousX = 0,
	startY = 0,
	previousY = 0,
	startTime = '',
	previousTime = '',
	dragging = false,
	touchStart = false,
	preventDefault = true;
	
	if (options.preventDefault !== undefined) {
		preventDefault = options.preventDefault;
	}
	
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
		
		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();		
		}
		
		if (e.touches) {
			startX = previousX = e.touches[0].pageX; 
			startY = previousY = e.touches[0].pageY;
		} else if (e.startX && e.startY) {
			startX = previousX = e.pageX;
			startY = previousY = e.pageY;
		}
		
		startTime = previousTime = e.timeStamp; 
		previousTime = e.timeStamp;
		dragging = false;
		touchStart = true;
	};
	
	var onTouchMove = function (e) {
		if (touchStart) {
			if (e.originalEvent) {
				e = e.originalEvent;
			}
			
			if (preventDefault) {
				e.preventDefault();
				e.stopPropagation();		
			}
			
			var info = {
					startX: startX,
					startY: startY,
					prevX: previousX,
					prevY: previousY,
					deltaY : 0,
					deltaX : 0,
					absDeltaY: 0,
					absDeltaX: 0,
					deltaTime: e.timeStamp - startTime
				};
			if (e.touches) { //e.pageY / e.pageX returns 0 in android 
	
				info.deltaY = e.touches[0].pageY - startY;
				info.deltaX = e.touches[0].pageX - startX;
			} else if (e.pageX && e.pageY) {
				info.deltaY = e.pageY - startY;
				info.deltaX = e.pageX - startX;
			}
			
			if (info !== undefined) {
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
					
					if (e.touches) {
						previousX = e.touches[0].pageX;
						previousY = e.touches[0].pageY;
					} else if (e.pageX && e.pageY) {
						previousX = e.pageX;
						previousY = e.pageY;
					}
				}
			}
		}
	};
	
	var onTouchEnd = function (e) {
		if (e.originalEvent) {
			e = e.originalEvent;
		}
		
		if (preventDefault) {
			e.preventDefault();
			e.stopPropagation();		
		}
		
		if (dragging) {
			if (options.eventName === 'dragend') {
				var dataDrag = mainController.makeReturnData(e, options.el);
				mainController.fire('dragend', options.callback, dataDrag);
			}
		}
		dragging = false;
		touchStart = false;
	};
	
	mainController.bind(options.el, 'touchstart', onTouchStart, runOnBubble);
	mainController.bind(options.el, 'touchmove', onTouchMove, runOnBubble);
	mainController.bind(options.el, 'touchend', onTouchEnd, runOnBubble);
};