define(['../lib/util'], function( util ) {
	
	var absSum = util.absSum;
	var PUNCH_DIVISOR = 300;
	var comparator = util.createJitteredComparator( PUNCH_DIVISOR );
	var DEBOUNCE_TIME = util.toMicroseconds( 0.25 );
	var isZero = util.createIsZero( 300 );
	
	var exports = {};
	exports.create = function( controller ) {
		var lastPunches = {};
		
		return function( frame ) {
			var prevFrame = controller.frame(1);
			
			var punchingHands = [];
			if (!prevFrame || !prevFrame.valid ) { return punchingHands }
			
					
			frame.hands.forEach(function( hand ) {
				
				if (lastPunches[hand.id] > frame.timestamp - DEBOUNCE_TIME) { return }
				// punches are fists, there should be no fingers.
				if (hand.fingers.length) { return }
				// punches go forward, not back.
				if (hand.palmVelocity[2] > 0) { return }
				
				var prevFrameHand = prevFrame.hand(hand.id);
				
				if (!prevFrameHand.valid) { return }
							
				var currentVelocity = Math.floor( Math.abs(hand.palmVelocity[2]) / PUNCH_DIVISOR );
				var prevFrameVelocity = Math.floor( Math.abs(prevFrameHand.palmVelocity[2]) / PUNCH_DIVISOR );
				
				if ( isZero(hand.palmVelocity[2]) && !isZero(prevFrameHand.palmVelocity[2]) ) {
					lastPunches[hand.id] = frame.timestamp;
					punchingHands.push( hand );
				} else {
					//console.log( currentVelocity, prevFrameVelocity)
				}
				
			});
			
			return punchingHands;
		}
	}
	
	return exports;
});