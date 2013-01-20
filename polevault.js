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
	
	var detectPunches = require('detectors/punch').create( controller );
	var detectTaps    = require('detectors/tap').create( controller );
	var detectPoints  = require('detectors/point').create( controller );
	
	function triggerPunch( hand ) {
		trigger('punch', hand);
	}
	function triggerTap( pointable ) {
		trigger('tap', pointable);
	}
	function triggerPoint( pointable ) {
		trigger('point', pointable);
	}
			
	controller.onFrame(function() {
		var frame = controller.lastFrame;
		if (frame.id % 10) {
			//return;
		}
		var punchingHands = detectPunches( frame );
		var tappingPointables = detectTaps( frame );
		var pointingPointables = detectPoints( frame );
		
		punchingHands.forEach(triggerPunch);
		tappingPointables.forEach(triggerTap);
		pointingPointables.forEach(triggerPoint);
	})
		
	controller.connect()
	
});