define(['../lib/util'], function( util ) {

	var absSum = util.absSum;
	var DEBOUNCE_TIME = util.toMicroseconds( 0.25 );
	var isZero = util.createIsZero( 300 );

	var exports = {};
	exports.create = function( controller ) {
		var lastKnocks = {};

		return function( frame ) {
			var prevFrame = controller.frame(1);

			var knockingHands = [];
			if (!prevFrame || !prevFrame.valid ) { return knockingHands }


			frame.hands.forEach(function( hand ) {

				if (lastKnocks[hand.id] > frame.timestamp - DEBOUNCE_TIME) { return }
				// knocks are fists, there should be no fingers.
				if (hand.pointables.length > 1) { return }
				// punches go forward, not back.
				if (hand.palmVelocity[2] < 0 || hand.palmVelocity[1] < 0) {
					//nothing
				} else {
					return
				}

				var prevFrameHand = prevFrame.hand(hand.id);

				if (!prevFrameHand.valid) { return }

				if( // either the hand stopped going forward or down
					( isZero(hand.palmVelocity[2]) && 
				      !isZero(prevFrameHand.palmVelocity[2]) 
				    ) ||
				    ( isZero(hand.palmVelocity[1]) &&
				      !isZero(prevFrameHand.palmVelocity[1])
					)
				  ) {

					// the fist should be rotating slightly for a knock.
					Sylvester.precision = 0.01;
					var prevLine = Line.create( prevFrameHand.palmPosition, prevFrameHand.palmNormal );
					var currentLine = Line.create( hand.palmPosition, hand.palmNormal );

					if (!prevLine.isParallelTo(currentLine)) {
						lastKnocks[hand.id] = frame.timestamp;
						knockingHands.push( hand );
					}
				}

			});

			return knockingHands;
		}
	}

	return exports;
});