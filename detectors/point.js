define(['../lib/util'], function( util ) {
	exports = {};

	var isStill = util.isStill;
	var STILL_TIME = util.toMicroseconds( 0.15 );

	exports.create = function( controller ) {
		var alreadyPointing = {};
		var lastMotion = {}
		
		return function( frame ) {
			
			var points = {
				start: [],
				end: []
			}

			frame.pointables.forEach(function( pointable ) {
				var hand = frame.hand(pointable.handId);
				
				// you point with a single finger or a tool not attached to a hand
				if (hand.valid && hand.fingers.length > 1) { return }
				
				if (isStill(pointable)) {
					//var hand = getHandForPointable( pointable, frame.hands );
					if (!alreadyPointing[pointable.id] && (frame.timestamp - lastMotion[pointable.id]) > STILL_TIME) {
						points.start.push(pointable);
						alreadyPointing[pointable.id] = true;
					}
				} else {
					if (alreadyPointing[pointable.id]) {
						points.end.push(pointable);
						alreadyPointing[pointable.id] = false;
					}
					lastMotion[pointable.id] = frame.timestamp;
				}
			});

			return points;
		}
	}
	return exports;
});