/*
Often a hand or pointable will appear or disappear for only one or two frames.
This does not yet take that into account; enter and exit events are often thrown falsely.
*/
define(function( require, exports, module ) {
	exports.create = function( controller ) {
		
		return function( frame ) {
			
			var enterExit = {
				hands: {
					enter: [],
					exit: []
				},
				pointables: {
					enter: [],
					exit: []
				}
			};
			
			var previousFrame = controller.frame(1);
			if (!previousFrame) {
				enterExit.hands.enter = frame.hands;
				enterExit.pointables.enter = frame.pointables;
				return enterExit;
			}
			
			var currentHandMap = {};
			for( var i = 0; i < frame.hands.length; i++ ) {
				currentHandMap[frame.hands[i].id] = true;
			}
			
			var previousHandMap = {};
			for( var i = 0; i < previousFrame.hands.length; i++ ) {
				previousHandMap[previousFrame.hands[i].id] = true;
				if (!currentHandMap[previousFrame.hands[i].id]) {
					enterExit.hands.exit.push(previousFrame.hands[i]);
				}
			}
						
			for( var i = 0; i < frame.hands.length; i++ ) {
				if (!previousHandMap[frame.hands[i].id]) {
					enterExit.hands.enter.push(frame.hands[i]);
				}
			}
			
			var currentPointableMap = {};
			for( var i = 0; i < frame.pointables.length; i++ ) {
				currentPointableMap[frame.pointables[i].id] = true;
			}
			
			var previousPointableMap = {};
			for( var i = 0; i < previousFrame.pointables.length; i++ ) {
				previousPointableMap[previousFrame.pointables[i].id] = true;
				if (!currentPointableMap[previousFrame.pointables[i].id]) {
					enterExit.pointables.exit.push(previousFrame.pointables[i]);
				}
			}
						
			for( var i = 0; i < frame.pointables.length; i++ ) {
				if (!previousPointableMap[frame.pointables[i].id]) {
					enterExit.pointables.enter.push(frame.pointables[i]);
				}
			}
			
			return enterExit;
		}
		
	};
})