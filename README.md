# discomesh
## easy network service discovery and advertising in Node.js

__require:__ 	`var disco = require('discomesh')`


__add a service:__ 	`disco.addService(type, tag, port)`
_i.e.:_	`disco.addService('riak', 'default', 8896)`

__delete a service:__ `disco.deleteService(type, tag)`

__start a service:__ 	`disco.startService(type, tag)`
_or, start upon add:_ 	`disco.addService(type, tag).start()`

__stop a service:__ `disco.stopService(type, tag)`

__watch for services:__ `disco.watchService(type, tag, listener)`
_tag is optional. will emit all new services of type if not specified_
