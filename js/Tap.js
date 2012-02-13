/*jslint eqeqeq: true, undef: true */
/*global window, document, TouchLayer, setTimeout, clearTimeout */
/*
 * Borrows Heavily from Sencha Touch v1.1.1 Tap.js
 * @author andyjamesdavies
 * @created 2012-02-06 
 */
TouchLayer.Tap = function (options) {
	var target = document,
		handles = [
		    'tapstart',
		    'tapcancel',
		    'tap', 
		    'doubletap', 
		    'taphold',
		    'singletap'
		],
	    listeners = [],
		singleTapThreshold = 400,
		doubleTapThreshold = 800,
		holdThreshold = 1000,
		cancelThreshold = 10,
		preventSingleTap = false,
		lastTapTime = null,
		timeout = null,
		startX = null,
		startY = null,
		touchCancelled = false;
	
	if (options.target) {
		target = options.target;
	}
	
	var fireTapEvent = function (e) {
		TouchLayer.fire('tap', target);

		if (e.event) {
			e = e.event;
		}

		var currTarget = (e.changedTouches ? e.changedTouches[0] : e).target;

		if (!currTarget.disabled && this.fireClickEvent) {
			var clickEvent = document.createEvent("MouseEvent");
			clickEvent.initMouseEvent('click', e.bubbles, e.cancelable, document.defaultView, e.detail, e.screenX, e.screenY, e.clientX,
					e.clientY, e.ctrlKey, e.altKey, e.shiftKey, e.metaKey, e.metaKey, e.button, e.relatedTarget);
			clickEvent.isSimulated = true;
			
			currTarget.dispatchEvent(clickEvent);
		}
	};
	
	var isCancel = function (touch) {
        var me = this;
        
        return (
            Math.abs(touch.pageX - startX) >= cancelThreshold ||
            Math.abs(touch.pageY - startY) >= cancelThreshold
        );
    };
	
	return {
		onTouchStart: function (e) {
			
			startX = e.pageX;
			startY = e.pageY;
			touchCancelled = false;
			
			TouchLayer.fire('tapstart', target);
			
			if (listeners.taphold) {    
				timeout = setTimeout(function () {
					TouchLayer.fire('taphold', target);
					timeout = null;
				}, holdThreshold);            
			}
		},
		onTouchMove: function (e) {
			if (isCancel(e) && !touchCancelled) {
				TouchLayer.fire('tapcancel', target);
	            if (timeout) {
	                clearTimeout(timeout);
	                timeout = null;
	            }
	            touchCancelled = true;
	        }
	    },
		onTouchEnd: function (e) {
			
			if (!touchCancelled) {
				fireTapEvent(e);
				
				if (lastTapTime && e.timeStamp - lastTapTime <= doubleTapThreshold) {
					lastTapTime = null;
					e.preventDefault();
					TouchLayer.fire('doubletap', target);
				} else {
					lastTapTime = e.timeStamp;
				}
				
				if (listeners && listeners.singletap && singleTapThreshold && !preventSingleTap) {
					TouchLayer.fire('singletap', target);
					preventSingleTap = true;
					setTimeout(function () {
						preventSingleTap = false;
					}, singleTapThreshold);
				}
	
				if (timeout) {
					clearTimeout(timeout);
					timeout = null;
				}
			}
		},
		init: function () {
			TouchLayer.addEventListener('touchstart', target, this.onTouchStart);
			TouchLayer.addEventListener('touchmove', target, this.onTouchMove);
			TouchLayer.addEventListener('touchend', target, this.onTouchEnd);
		
			for (var i = 0; i < handles.length; i++) {
				listeners[handles[i]] = true;
			}
		}
	};
};