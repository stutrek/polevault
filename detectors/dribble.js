define(['../lib/util'], function( util ) {

	var absSum = util.absSum;
	var DEBOUNCE_TIME = util.toMicroseconds( 0.25 );
	var isZero = util.createIsZero( 300 );

	var exports = {};
	exports.create = function( controller ) {
		var lastDribbles = {};

		return function( frame ) {
			var prevFrame = controller.frame(1);

			var dribblingHands = [];
			if (!prevFrame || !prevFrame.valid ) { return dribblingHands }


			frame.hands.forEach(function( hand ) {

				if (lastDribbles[hand.id] > frame.timestamp - DEBOUNCE_TIME) { return }
				
				// Dribbles are open hands. Those have fingers.
				if (hand.pointables.length < 2) { return }
				// dribbles go down.
				if (hand.palmVelocity[1] > 0) {
					return
				}

				var prevFrameHand = prevFrame.hand(hand.id);

				if (!prevFrameHand.valid) { return }

				if (isZero(hand.palmVelocity[1]) && !isZero(prevFrameHand.palmVelocity[1])) {

					// the fist should be rotating slightly for a knock.
					Sylvester.precision = 0.01;
					var prevLine = Line.create( prevFrameHand.palmPosition, prevFrameHand.palmNormal );
					var currentLine = Line.create( hand.palmPosition, hand.palmNormal );

					if (!prevLine.isParallelTo(currentLine)) {
						lastDribbles[hand.id] = frame.timestamp;
						dribblingHands.push( hand );
					}
				}

			});

			return dribblingHands;
		}
	}

	return exports;
});