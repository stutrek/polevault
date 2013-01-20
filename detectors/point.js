define(['../lib/util'], function( util ) {
	exports = {};

	var isStill = util.isStill;
	var STILL_TIME = util.toMicroseconds( 0.15 );

	exports.create = function( controller ) {
		var alreadyPointing = {};
		var lastMotion = {}
		
		return function( frame ) {
			
			var pointingPointables = [];

			frame.pointables.forEach(function( pointable ) {
				var hand = frame.hand(pointable.handId);
				
				// you point with a single finger or a tool not attached to a hand
				if (hand.valid && hand.fingers.length > 1) { return }
				
				if (isStill(pointable)) {
					//var hand = getHandForPointable( pointable, frame.hands );
					if (!alreadyPointing[pointable.id] && (frame.timestamp - lastMotion[pointable.id]) > STILL_TIME) {
						pointingPointables.push(pointable);
						alreadyPointing[pointable.id] = true;
					}
				} else {
					alreadyPointing[pointable.id] = false;
					lastMotion[pointable.id] = frame.timestamp;
				}
			});

			return pointingPointables;
		}
	}
	return exports;
});