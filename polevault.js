/* 
Copyright 2013 Stu Kabakoff
https://github.com/sakabako/polevault
MIT Licensed
*/
define(function( require, exports, module ) {
	
	var paperboy = require('lib/paperboy');
	var Leap = window.Leap;

	var trigger = paperboy.mixin(exports);
	
	var controller = new Leap.Controller();
	var detectEnterExit = require('detectors/enterExit').create( controller );
	var detectPunches   = require('detectors/punch').create( controller );
	var detectTaps      = require('detectors/tap').create( controller );
	var detectPoints    = require('detectors/point').create( controller );
	
	function createTriggerer( eventName ) {
		return function( arg ) {
			trigger( eventName, arg );
		}
	}
	var triggerPunch = createTriggerer( 'punch' );
	var triggerTap = createTriggerer( 'tap' );
	var triggerPointStart = createTriggerer( 'point.start' );
	var triggerPointEnd = createTriggerer( 'point.end' );
	var triggerHandEnter = createTriggerer( 'hand.enter' );
	var triggerHandExit = createTriggerer( 'hand.exit' );
	var triggerPointableEnter = createTriggerer( 'pointable.enter' );
	var triggerPointableExit = createTriggerer( 'pointable.exit' );
			
	controller.onFrame(function() {
		var frame = controller.lastFrame;
		
		var enterExit = detectEnterExit( frame );
		var punchingHands = detectPunches( frame );
		var tappingPointables = detectTaps( frame );
		var point = detectPoints( frame );
		
		exports.currentFrame = frame;
		
		trigger('frame', frame);
		
		enterExit.pointables.exit.forEach(triggerPointableExit);
		enterExit.hands.exit.forEach(triggerHandExit);
		enterExit.hands.enter.forEach(triggerHandEnter);
		enterExit.pointables.enter.forEach(triggerPointableEnter);
		
		punchingHands.forEach(triggerPunch);
		tappingPointables.forEach(triggerTap);
		
		point.start.forEach(triggerPointStart);
		point.end.forEach(triggerPointEnd);
		
	})
		
	controller.connect()
	
});