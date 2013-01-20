# Pole Vault

A library to simplify working with the Leap Motion detector. http://leapmotion.com

Pole Vault is a basic pubsub/observer. It monitors the Leap Motion detector and throws events when certain things happen.

`polevault.on( event, callback )`

## Events

### Implemented

* `punch` - a closed fist stopped suddenly.
* `tap` - a finger stopped suddenly.

### Planned

* `point` - an extended finger held still for longer than a tap.
* `slap` - an open hand stops suddenly.
* `sweep` - all fingers start to move suddenly in the same direction.
* `clap` - two hands close in on each other.
* `shake` - a hand moves back and fourth quickly.

### Roadmap

* `pinch`, `spread`, `rotate`.

#### Planes

Create a plane with three points (or two and a direction) and receive events when it is crossed.