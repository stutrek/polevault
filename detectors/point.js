define(['../lib/util'], function( util ) {
	exports = {};

	var isStill = util.isStill;
	var getHandForPointable = util.getHandForPointable;

	exports.create = function( controller ) {
		var alreadyPointing = {};
		var lastMotion = {}
		
		return function( frame ) {
			
			var pointingPointables = [];

			frame.pointables.forEach(function( pointable ) {
				if (isStill(pointable)) {
					//var hand = getHandForPointable( pointable, frame.hands );
					if (!alreadyPointing[pointable.id] && (frame.timestamp - lastMotion[pointable.id]) > 100000) {
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