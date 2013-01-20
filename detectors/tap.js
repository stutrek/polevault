define(['../lib/util'], function( util ) {
	exports = {};
	
	var TAP_DIVISOR = 100;
	var comparator = util.createJitteredComparator( TAP_DIVISOR );
	var handComparator = util.createJitteredComparator( 50 );
	var stillComparator = util.createJitteredComparator( 100 );
	
	function isCloseEnoughToZero( number ) {
		return stillComparator( number, 0 ) === 0;
	}
	
	var DEBOUNCE_TIME = util.toMicroseconds( 0.1 );
	var STILL_TIME = util.toMicroseconds( 0.05 );
	
	exports.create = function( controller ) {
		var lastTaps = {};
		var lastFastMotion = {};
		return function( frame ) {
			
			var tappingPointables = [];
			
			frame.pointables.forEach(function( pointable ) {
				
				if (lastTaps[pointable.id] > frame.timestamp - DEBOUNCE_TIME) { return }
				
				var hand = frame.hand(pointable.handId);
				if (hand === undefined || !hand.valid) {
					return;
				}
				
				if (handComparator( pointable.tipVelocity[1], hand.palmVelocity[1]) === 0) {
					return;
				}
							
				if ( pointable.tipVelocity[1] > 0 &&
				     (frame.timestamp-lastFastMotion[pointable.id]) < STILL_TIME 
				   ) {
					lastTaps[pointable.id] = frame.timestamp;
					tappingPointables.push(pointable);
					
				} else if (pointable.tipVelocity[1] < -100) {
					if (isCloseEnoughToZero( pointable.tipVelocity[0] ) && isCloseEnoughToZero( pointable.tipVelocity[2] )) {
						lastFastMotion[pointable.id] = frame.timestamp;
					} else {
						lastFastMotion[pointable.id] = 0;
					}
				}
				
			});
			
			return tappingPointables;
		}
	}
	return exports;
});