var
	stream = require('stream')
	, util = require('util')
	, mdns = require('mdns')
;

function disco(opts) {
		
	this.opts = opts || { };
	stream.call(this);

	var services = { };

	this.getService = function getService(type, tag) {

		if(!services[type]) { return false; }

		// TODO: return parsed info
		return services[type][tag] || null;
	};

	this.addService = function addService(type, tag, port) {

		if(!type || !port) { return false; }
		// my type and tag are stored in the services object
		// and then we initialize the ad!
		if (!services[type]) {

			services[type] = { };
		}
		return services[type][tag] = this.createService(type, tag, port);
	};

	this.deleteService = function deleteService(type, tag) {

		var svc;

		if(!type || !port || !services[type]) { return false; }
		if(svc = services[type][tag]) {

			delete services[type][tag];
			svc.stop();
		}
	};

	this.stopService = function stopService(type, tag) {

		if(!services[type]) {

			return null;
		}

		var svc = services[type][tag] || null;
		if(!svc) { return false; }

		svc.stop();
		return svc; 
	};

	this.startService = function startService(type, tag) {

		if(!service[type]) {

			return null;
		}
		var svc = service[type][tag] || null;
		if(!svc) { return false; }

		svc.start();
		return svc;
	};

	this.watchService = function watchService(type, tag, listener) {

		if(!type) { return false; }


		var 
			watcher = this.createWatcher(type, tag)
			, upHandler = function(svc) {

				this.emit('serviceUp', svc);
			}
			, downHandler = function(svc) {

				this.emit('serviceDown', svc);
			}
		;

		watcher.on('serviceUp', upHandler.bind(listener));
		watcher.on('serviceDown', downHandler.bind(listener));

		return watcher;
	};
};


util.inherits(disco, stream);

disco.prototype.createService = function(type, tag, port) {
	
	if(!type || !tag) {

		console.log("invalid createService request.");
		return false;
	}

	var service = new mdns.Advertisement(mdns.tcp(type), port, { 

		name : tag || 'default'
	});

	service.on('error', function(e) {

		svcError(service, e);
	});

	return service;
};

disco.prototype.createWatcher = function createWatcher(type, tag) {
	
	if(!type || !tag) {

		return false;
	}

	var watcher = new mdns.Browser(mdns.tcp(type));
	
	watcher.on('error', function(e) {

		svcError(watcher, e);
	});

	return watcher;
};

function svcError(service, e) {

	if (e) {

		console.log("service error: %s (%s)", e, service.type);
	}
}

module.exports = disco;
