var _layout_type = "tree"
function layoutDevices(type) {
	if(!type) type = _layout_type;
	_layout_type = type;

	// Fade everything out
	$.each(devices, function(index, device) {
		device.el.stop();
		//device.hide();
		device.update();
	});
	
	switch (type) {
		case "random":
			$.each(devices, function(index, device) {
				
				//dev_jc_17/09/2013_a
				// positions devices very far from container edges, thats because the size of device is set to 200px by default....
				var iUsableHalfHeight = $('#container').height()/2 - device.size.height/2;
				var iUsableHalfWidth = $('#container').width()/2 - device.size.width/2;

				device.el.fadeIn(500).animate({
					// top: $(document).height()/2 - device.size.height / 2 + random(-500, 500),
					// left: $(document).width()/2 - device.size.width / 2 + random(-500, 500),
					//dev_jc_17/09/2013_a
					top: iUsableHalfHeight + random( -iUsableHalfHeight, iUsableHalfHeight ),
					left: iUsableHalfWidth + random( -iUsableHalfWidth, iUsableHalfWidth ),
				}, {
					step: function(n) {
						device.update();
					}
				});
			});		
			break;
		case "random grid":
			// Place the devices randomly within a grid layout
			// -----------------------------------------------
			var grid_width = 6;
			var grid_height = 4;
			var grid_interval = 200;

			// Create grid structure
			var grid = [];
			for(var i=0; i<grid_height; i++) {
				grid[i] = [];
				for(var j=0; j<grid_width; j++) {
					grid[i][j] = null; // Empty cell
				}
			}

			$.each(devices, function(index, device) {
				var target_i = -1;
				var target_j = -1;

				var found_space = false;
				while(!found_space) {
					target_i = random(0, grid_height);
					target_j = random(0, grid_width);					
					if(grid[target_i][target_j] == null) found_space = true;
				}

				grid[target_i][target_j] = device;

				var x = (target_j - grid_width/2 + 1/2) * grid_interval;
				var y = (target_i - grid_height/2 + 1/2) * grid_interval;

				//dev_jc_17/09/2013_a
				// positions devices very far from container edges, thats because the size of device is set to 200px by default....
				var iUsableHalfHeight = $('#container').height()/2 - device.size.height/2;
				var iUsableHalfWidth = $('#container').width()/2 - device.size.width/2;

				device.el.fadeIn(500).animate({
					// top: $(document).height()/2 - device.size.height / 2 + y,
					// left: $(document).width()/2 - device.size.width / 2 + x,
					//dev_jc_17/09/2013_a
					top: iUsableHalfHeight + random( -iUsableHalfHeight, iUsableHalfHeight ),
					left: iUsableHalfWidth + random( -iUsableHalfWidth, iUsableHalfWidth ),
				}, {
					step: function(n) {
						device.update();
					}
				});
			});

			break;
		case "tree":
			// Place root node
			devices[0].el.fadeIn({duration: 300, queue: false}).animate({
				top: 0,
				//left: $(document).width() / 2 - devices[0].size.width / 2
				//dev_jc_17/09/2013_a
				left: $('#container').width() / 2 - devices[0].size.width / 2
			}, {
				step: function(n) {
					devices[0].update();
				}
			});

			// treePlace(devices[0], $(document).width() / 2 - devices[0].size.width / 2, devices[0].size.height, false);
			//dev_jc_17/09/2013_a
			treePlace(devices[0], $('#container').width() / 2 - devices[0].size.width / 2, devices[0].size.height, false);

			break;

		case "physics":
			// Tiny physics simulator
			$.each(devices, function(i, dev) {
				dev.el.fadeIn({duration: 1000, queue: false}).animate({
					left: "+=" + random(-10,10),
					top: "+=" + random(-10,10)
				}, 10);
			});

			devices[0].el.animate({
				// top: $(window).height()/2-devices[0].size.height/2,
				// left: $(window).width()/2-devices[0].size.width/2
				//dev_jc_17/09/2013_a
				top: $('#container').height()/2-devices[0].size.height/2,
				left: $('#container').width()/2-devices[0].size.width/2
			}, function() {
				runTinyPhysics(false);
			});
			break;
	}
}

function treePlace(root, start_x, start_y, hidden) {
	if(!root.expanded) hidden = true;

	// Used to recursively place nodes in a tree
	var children = [];

	// Get connections that lead to children
	for(var i=0; i<root.connections.length; i++) {
		if(root.connections[i].a == root) {
			// root is the routing device
			children.push(root.connections[i].b);
		}
	}

	// Put each child in its place
	$.each(children, function(index, device) {
		if(hidden) {
			//device.el.addClass("invisible");
			device.el.animate({
				top: root.el.offset().top,
				left: root.el.offset().left
			}, {
				step: function(n) {
					device.update();
				}
			}).fadeOut({duration: 300, complete: function() {
				// Fade out connectors
				$.each(device.connections, function(index, connection) {
					connection.el.fadeOut(300);
				});
			}});
		}
		else {
			var x = (index + 1/2 - children.length / 2) * root.size.width;

			// Fade in connectors
			$.each(device.connections, function(index, connection) {
				connection.el.fadeIn(300);
			});

			// Move device into place
			if(!device.el.is(":visible")) {
				device.el.css('display', 'block');
				device.el.css('opacity', 0);
				device.el.offset(root.el.offset());
			}

			device.el.animate({
				opacity: 1,
				top: start_y,
				left: start_x + x
			}, {
				step: function(n) {
					device.update();
				}
			});
		}
		// Call treePlace on each child
		treePlace(device, start_x + x, start_y + root.size.height, hidden);

	});
}

function runTinyPhysics(snapToGrid) {
	// TUNING PARAMETERS
	// -------------------------------------------------------------------------------------------------------
	var SPRING_K = 0.1;		// Spring force constant
	var SPRING_REST = 100;	// Spring resting distance
	var REPULSION_K = 2;	// Repulsion force between nodes to keep things spaced out
	var BOUNDARY_K = 10; 	// Repulsion force to keep everything constrained to the screen
	var DAMPING = 0.5;		// Percent of velocity to retain between steps (higher numbers are bouncier)
	var STEPS = 500;		// Steps to run towards convergence. Higher numbers are slower but more stable.
	var GRID_K = 0.1;		// Force to pull things towards grid points
	var GRID_SIZE = 100;		// Size of grid units


	// Set target to current position
	$.each(devices, function(index, device) {
		device.target = [device.el.offset().left, device.el.offset().top];

	});
	for(var step = 0; step<STEPS; step++) {
		$.each(devices, function(index, device) {
			var F = [0,0];	// force summation
			// Calculate spring force on each device
			$.each(device.connections, function(idx, connection) {
				var sign = device == connection.a ? 1 : -1;
				var m = (connection.getPhysicsLength() - SPRING_REST) * connection.strength * sign;
				var v = connection.getPhysicsUnitVector();
				F[0] += v[0] * m * SPRING_K;
				F[1] += v[1] * m * SPRING_K;
			});

			// Calculate repulsive force on each device (SLOW AND STUPID WAY I KNOW)
			$.each(devices, function(idx, other) {
				if(other == device) return; // Don't repell self
				if(other.physicsDistanceToSquared(device) < 1000000) {
					var v = other.physicsVectorTo(device);
					var l = Math.max(other.physicsDistanceTo(device), 0.001);
					var m = 1/l;
					F[0] += v[0]* m * REPULSION_K;
					F[1] += v[1]* m * REPULSION_K;
				}
			});

			// Calculate force to keep device on screen
			// if(device.target[0] + device.size.width > $(window).width()) 	 F[0] -= BOUNDARY_K;
			// if(device.target[1] + device.size.height > $(window).height()) 	 F[1] -= BOUNDARY_K;
			//dev_jc_17/09/2013_a
			if(device.target[0] + device.size.width > $('#container').width()) 	 F[0] -= BOUNDARY_K;
			if(device.target[1] + device.size.height > $('#container').height()) 	 F[1] -= BOUNDARY_K;
			if(device.target[0] < 0)					 					 F[0] += BOUNDARY_K;
			if(device.target[1] < 1)					 					 F[1] += BOUNDARY_K;

			if(snapToGrid) {
				// Calculate force to snap things to grid
				// First, find the nearest grid point
				var grid_x = Math.floor(device.target[0] / GRID_SIZE) * GRID_SIZE;
				var grid_y = Math.floor(device.target[1] / GRID_SIZE) * GRID_SIZE;
				var v = [device.target[0] - grid_x, device.target[1] - grid_y];
				F[0] -= v[0] * GRID_K;
				F[1] -= v[1] * GRID_K;
			}


			// Add (force/mass = accelration) to velocity
			device.velocity[0] += F[0] / device.mass;
			device.velocity[1] += F[1] / device.mass;

			// Add damping to velocity
			device.velocity[0] *= DAMPING;
			device.velocity[1] *= DAMPING;
			
			device.target[0] += device.velocity[0];
			device.target[1] += device.velocity[1];
		});
	}

	$.each(devices, function(index, device) {
		device.el.animate({
			left: device.target[0],
			top: device.target[1],
		}, {
			step: function(n) {
				device.update();
			}})
	});
}