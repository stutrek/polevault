define(['../lib/util'], function( util ) {
	exports = {};
	
	var TAP_DIVISOR = 100;
	var comparator = util.createJitteredComparator( TAP_DIVISOR );
	var handComparator = util.createJitteredComparator( 50 );
	
	var DEBOUNCE_TIME = util.toMicroseconds( 0.25 );
	var STILL_TIME = util.toMicroseconds( 0.05 );
	
	exports.create = function( controller ) {
		var lastTaps = {};
		var lastFastMotion = {};
		return function( frame ) {
			
			var tappingPointables = [];
			
			frame.pointables.forEach(function( pointable ) {
				
				// only tap once every 2.5/10 second
				if (lastTaps[pointable.id] > frame.timestamp - DEBOUNCE_TIME) { return }
				// taps go down.
				
				var hand = frame.hand(pointable.handId);
				if (hand === undefined || !hand.valid) {
					return;
				}
				
				if (handComparator( pointable.tipVelocity[1], hand.palmVelocity[1]) === 0) {
					return;
				}
							
				if (pointable.tipVelocity[1] > 0 && (frame.timestamp-lastFastMotion[pointable.id]) < STILL_TIME ) {
					lastTaps[pointable.id] = frame.timestamp;
					tappingPointables.push(pointable);
				} else if (pointable.tipVelocity[1] < -100) {
					lastFastMotion[pointable.id] = frame.timestamp;
				}
				
			});
			
			return tappingPointables;
		}
	}
	return exports;
});