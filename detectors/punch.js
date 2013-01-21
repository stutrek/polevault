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
							
				if ( isZero(hand.palmVelocity[2]) && !isZero(prevFrameHand.palmVelocity[2]) ) {
					
					// a punch is when a hand moves forward in a line.
					Sylvester.precision = 0.012;
					var prevLine = Line.create( prevFrameHand.palmPosition, prevFrameHand.palmNormal );
					var currentLine = Line.create( hand.palmPosition, hand.palmNormal );
					
					if (prevLine.isParallelTo(currentLine)) {
						lastPunches[hand.id] = frame.timestamp;
						punchingHands.push( hand );
					}
				}
				
			});
			
			return punchingHands;
		}
	}
	
	return exports;
});