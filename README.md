# Pole Vault

A library to simplify working with the Leap Motion detector. http://leapmotion.com

Pole Vault is a basic pubsub/observer. It monitors the Leap Motion detector and throws events when certain things happen.

`polevault.on( event, callback )`

## Events

### Implemented

#### Hand Motions
* `frame` - a frame arrived from the detector.
* `punch` - a closed fist goes forward on a line then stops suddenly.
* `knock` - a closed fist moves down or forward while the wrist stays still
* `dribble` - an open hand goes down then stops, like a basketball.

#### Finger Motions
* `tap` - a finger goes down then stops suddenly.
* `point.start`, `point.end` -  the only finger on a hand holds still for a moment.

### Planned

* `wave` - a vertical hand rotates.
 * `wave.start`
 * `wave.stop`
 
* `shake` - a fist moves back and fourth quickly.
 * `shake.start`
 * `shake.stop`

### Technical Difficulties
* `sweep` - all fingers start to move suddenly in the same direction. _When fingers get too close to the palm the device is unable to detect them._
* `clap` - two hands close in on each other. _When two hands meet they they are detected as one_


### Roadmap

* `pinch`, `spread`, `rotate`.

#### Planes

Create a plane with three points (or two and a direction) and receive events when it is crossed.