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
		case "orbital":

			var radius = 250;

			// Place root node
			devices[0].el.fadeIn({duration: 300, queue: false}).animate({
				left: $('#container').width() / 2 - devices[0].size.width/2,
				top: radius + 100 									// lower by the radius, so a device at the very top of the circle is not higher than the top of the container, then give 100px extra as padding.
			}, {
				step: function(n) {
					devices[0].update();
				}
			});

			// Get direct children to Network Box (does not include subnodes).
			var children = [];
			for(var i=0; i<devices[0].connections.length; i++) {
				// Only select children that are Wired, not Wireless.
				// if(root.connections[i].a == root && root.connections[i].b.is_wireless !== true) {
				if(devices[0].connections[i].a == devices[0]) {
					// then Network Box is the routing device
					children.push(devices[0].connections[i].b);
				}
			}

			// Place direct child devices of Network Box.
			var total = children.length;
			var alpha = Math.PI * 2 / total;
			$.each(children, function(index, device) {

				var theta = Math.PI/2 - alpha * index;
			    var pointx = Math.floor(Math.cos( theta ) * radius );
			    var pointy = Math.floor(Math.sin( theta ) * radius );

				console.log('Children i = '+ index +' | x = '+ pointx +' | y = '+ pointy);

				device.el.fadeIn(500).animate({
					left: pointx - device.el.width()/2 + $("#container").width()/2,
					top: pointy - device.el.height()/2 + devices[0].el.position().top
				}, {
					step: function(n) {
						device.update();
					}
				});

			});

			// Get subchildren
			var subchildren = [];
			for ( var i = 0; i < routing_devices.length; i++ ) {
				console.log("- i : "+ i);
				if ( routing_devices[i] !== devices[0] ) {
					for ( var j = 0; j < routing_devices[i].connections.length; j++ ) {
						console.log("- j : "+ j);
						if(routing_devices[i].connections[j].a == routing_devices[i]) {
							subchildren.push(routing_devices[i].connections[j].b);
						}
					}
				}
			}
			console.log("------ SUBCHILDREN");
			console.log(subchildren);

			// Place subchildren in outer ring.
			var radius = 450;
			var total = subchildren.length;
			var alpha = Math.PI * 2 / total;
			$.each(subchildren, function(index, device) {

				var theta = Math.PI/2 - alpha * index;
			    var pointx = Math.floor(Math.cos( theta ) * radius );
			    var pointy = Math.floor(Math.sin( theta ) * radius );

				console.log('Subchildren i = '+ index +' | x = '+ pointx +' | y = '+ pointy);

				device.el.fadeIn(500).animate({
					left: pointx - device.el.width()/2 + $("#container").width()/2,
					top: pointy - device.el.height()/2 + devices[0].el.position().top
				}, {
					step: function(n) {
						device.update();
					}
				});

			});

			break;
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
		case "grid":
			// Place all Devices.
			gridPlace(devices[0], $('#container').width() / 2 - devices[0].size.width / 2, 0, false, "level1");

			// Once devices placed, fade in devices and show connectors.
			$.each(devices, function(index, device) {
				device.el.animate({
					opacity: 1,
				}, {
					step: function(n) {
						device.update();
					}
				});
				$.each(device.connections, function(index2, connection) {
					connection.el.fadeIn(300);
				});
			});

			// Fade in the root node last. (DONT KNOW WHY I MUST DO IT, but it is necessary...)
			devices[0].el.fadeIn({duration: 300, queue: false});

			break;
		case "physics":
			// Tiny physics simulator
			$.each(devices, function(i, dev) {
				dev.el.fadeIn({duration: 1000, queue: false}).animate({
					left: "+=" + random(-10,10),
					top: "+=" + random(-10,10)
				}, 10);
			});

			console.log('win.height------ ' + $(window).height());
			console.log('win.width------ ' + $(window).width());
			console.log('devices[0].size.height------ ' + devices[0].size.height);
			console.log('devices[0].size.width------ ' + devices[0].size.width);
			console.log('container.height------ ' + $('#container').height());
			console.log('container.width------ ' + $('#container').width());

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

// function for displaying Wired devices under the network box in the Grid layout. Is actually half a treePlace (for direct children of Net Box) and half a gridPlace (for subnodes of those children).
function gridPlace(root, start_x, start_y, hidden, grid_level) {
	if(!root.expanded) hidden = true;

	// Used to recursively place nodes in a tree
	var children = [];

	// Get connections that lead to children
	for(var i=0; i<root.connections.length; i++) {
		// Only select children that are Wired, not Wireless.
		if(root.connections[i].a == root) {
			// root is the routing device
			children.push(root.connections[i].b);
		}
	}
	
	// Wireless vars (Grid)
	var counter_wireless = 0;			// use a counter only for wireless devices instead of the counter for all children, so we are sure we are placing wireless devices in consecutive order.
	var n_columns = 4;
	var n_device_width = n_device_height = 200;
	// Wired vars, general
	var in_between_space_wired_wireless = 100;
	var network_box_y;
	// Wired vars, Level 1 (Tree)
	var counter_wired_l1 = 0;
	// Wired vars, Level 2 (Grid)
	var counter_wired_l2 = 0;

	// Put each child in its place
	$.each(children, function(index, device) {
		
		//  when clicking to hide a device (for collapsable nodes)
		if(hidden) {
			//device.el.addClass("invisible");
			device.el.animate({
				//dev_jc_19/09/2013_b : fix animation of collapsing nodes back to parent properly (with new container they would animate towards the side of the screen)
				// replaced offset() with position()
				top: root.el.position().top,
				left: root.el.position().left
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
		// for displaying nodes
		else {
			if ( device.is_wireless === true ) {
				
				console.log('- - - - WIRELESS - GRID layout');
				
				// OLD : useful code in here, keep it for a while.
				// wrap every row in a div : useful later to center the last row, if it doesnt contain exactly 4 devices.
				// if( counter_wireless % n_columns === 0 && device.el.parent(".wireless_grid_row").length === 0 ) {													// check if we are at the beginning of a row, and if we didn't already create the div last time by calling update(), for example.
			 	// device.el.nextUntil( $("#device_" + (device.id-1 + n_columns) +" + *") ).andSelf().wrapAll("<div class='wireless_grid_row'></div>");			// take this element and the next ones until the next row, and wrap them.
			 	// // device.el.nextAll().andSelf().slice(0,n_columns).wrapAll('<div class="row"></div>');															// other way to do same as above.
			 	// }
				
				var x_starting_pos = $("#container").width()/2 - (n_columns * n_device_width)/2 ;				// considering the number of columns and the width of each item, determine what the starting X position is in order for a row of 4 items to be centered in the container.
				var x = x_starting_pos + ( (counter_wireless % n_columns) * n_device_width );					// each row of devices goes up, ex: row0.y = 0, row1.y = -200, row2.y = -400, etc...
				var y = Math.floor(counter_wireless / n_columns) * -(n_device_height);							// var y = - (Math.floor(index / n_columns) * root.size.height + (root.el.position().top + root.size.height));	

				// console.log('Wireless X = '+ x);
				// console.log('Wireless Y = '+ y);
				// console.log("counter_wireless = "+ counter_wireless);

				counter_wireless++;

				// after we have placed all devices... 
				if ( counter_wireless === array_wireless_devices.length ) {
					// Center the last row of devices horizontally, if it doesnt contain exactly 4 devices. Here, we shift the whole row over, instead of calculating the position of each device one-by-one. We can just do this because they don't animate back towards a root node, which would be broken by positioning this way.
					var cur_row = device.el.parent(".wireless_grid_row");
					if ( cur_row.children().length < n_columns ) {
						var cur_row_left = (n_columns - cur_row.children().length) * n_device_width/2;
						cur_row.css({
							"position": "relative",
							"left": cur_row_left
						});
					}
					// lower the wireless container to align it with top of the main container.
					var n_full_rows = Math.floor((array_wireless_devices.length - 1)/n_columns);				// need to know the number rows we have minus 1, to know by how many rows to lower all wireless devices.
					var n_full_rows_height = n_full_rows * n_device_height;
					$("#wireless_container").css({
						"position": "relative",
						"top": n_full_rows_height
					});
					// Place the Wireless Signal icon
					var n_total_rows = Math.ceil(array_wireless_devices.length/n_columns);						// need to know the total number of rows to know where to wireless icon after the devices.
					var n_total_rows_height = n_total_rows * n_device_height;
					$("#wireless_icon").css("top", n_total_rows_height );			//DEV - PROBLEM: top attribute here is relative to the last wireless device, which is not the lowest one in Y, so it messes up the calculation... need to be able to position icon below container of devices, but container has no height value. Clearfix does not change that. How to fix?
					// console.log('wireless icon TOP: '+ $("#wireless_icon").css("top"));
				}
				
			}
			else if ( device.is_wireless !== true ) {
				
				// Before placing the devices...
				if ( counter_wired_l1 === 0 && counter_wired_l2 === 0 ) {
					// start by placing the Network Box under the wireless devices.
					network_box_y = $("#wireless_icon").position().top + $("#wireless_icon").height() + in_between_space_wired_wireless;			//dev_jc_29/09/2013_3: hack: i would use wireless_container.height instead of what's here...
					devices[0].el.css("top", network_box_y);
					// console.log('Net box TOP: ' + devices[0].el.css("top"));

					// Re-adjust position of Wired Zone background to align with position of Net Box.
					$("#container_background").css({
						"top": $("#container").offset().top + network_box_y - in_between_space_wired_wireless/2,									// DEV_PROBLEM: i think this should work but doens not position top of div exactly between the wireless and network box icons.
						"left": $('#container').width()/2 - $('#container_background').width()/2 + $('#container').offset().left
					});
					// console.log('Container BG TOP: '+ $("#container").offset().top );
				}
				// Place devices based on nesting level.
				if ( grid_level === "level1" ) {

					console.log('- - - - WIRED - LEVEL1 - TREE layout');
					var x = start_x + ( counter_wired_l1 + 1/2 - array_level1_wired_devices.length / 2) * root.size.width;
					var y = network_box_y + devices[0].size.height;

					// console.log('Wired L1 X = '+ x);
					// console.log('Wired L1 Y = '+ y);
					// console.log("counter_wired_l1 = "+ counter_wired_l1);

					counter_wired_l1++;
				}
				if ( grid_level === "level2" ) {

					console.log('- - - - WIRED - LEVEL2 - GRID layout');

					var x_starting_pos = $("#container").width()/2 - (n_columns * root.size.width)/2 ;	// considering the number of columns and the width of each item, determine what the starting X position is in order for a row of 4 items to be centered in the container.
					if ( device.type !== "tv" ) {
						var x = x_starting_pos + ( (counter_wired_l2 % n_columns) * root.size.width );
						var y = Math.floor(counter_wired_l2 / n_columns) * root.size.height + (root.el.position().top + root.size.height);
					} else {
						var x = root.el.css("left");
						var y = root.el.position().top + root.size.height;
					}

					// console.log('Wired L2 X = '+ x);
					// console.log('Wired L2 Y = '+ y);
					// console.log("counter_wired_l2 = "+ counter_wired_l2);
					
					counter_wired_l2++;

					// after we have placed all devices... 
					if ( counter_wired_l2 === children.length ) {
						// Center all devices in the last row horizontally, if there are less than 4. Here we don't shift the whole row over like in Wireless Devices, we instead re-calculate the position of each device like Sam in treePlace(), because if we shift the whole row, then the animation for collapsing devices back to root is shifted too.
						var cur_row = device.el.parent(".wired_grid_row");
						if ( cur_row.children().length < n_columns ) {
							$.each(cur_row.children(), function(index, device) {
								start_x = $('#container').width() / 2 - n_device_width / 2;								// re-init start_x : for some reason this is necessary, dont know why.
								x = start_x + ( index + 1/2 - cur_row.children().length / 2) * n_device_width;			// positioning like in treePlace()
								$(device).css({
									"left": x
								});
							});
						}
					}
				}

			}

			// Move device into place before showing it
			if(!device.el.is(":visible")) {
				device.el.css('display', 'block');
				device.el.css('opacity', 0);
				device.el.css('left', x);
				device.el.css('top', y);
			}

		}
		// Call gridPlace on children
		if ( grid_level === "level1" ) { 
			// var is_level2 = true;
			gridPlace(device, start_x + x, start_y + root.size.height, hidden, "level2");
			// console.log('------B');
		}
		// or, use treePlace for children
		else {
			treePlace(device, start_x + x, start_y + root.size.height, hidden); 
			// console.log('------A'); 
		}

	});
}

// 
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
				//dev_jc_19/09/2013_b : fix animation of collapsing nodes back to parent properly (with new container they would animate towards the side of the screen)
				// replaced offset() with position()
				top: root.el.position().top,
				left: root.el.position().left
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
		// dev_jc_19/09/2013_a : replace offset with position to place items within the container.
		// device.target = [device.el.offset().left, device.el.offset().top];
		device.target = [device.el.position().left, device.el.position().top];
		// console.log('runTinyPhysics----- device.el.offset().left = ' + device.el.offset().left);
		// console.log('runTinyPhysics----- device.el.offset().top = ' + device.el.offset().top);
		// console.log('runTinyPhysics----- device.el.position().left = ' + device.el.position().left);
		// console.log('runTinyPhysics----- device.el.position().top = ' + device.el.position().top);
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
			if(device.target[0] + device.size.width > $(window).width()) 	 F[0] -= BOUNDARY_K;
			if(device.target[1] + device.size.height > $(window).height()) 	 F[1] -= BOUNDARY_K;
			//dev_jc_17/09/2013_a
			// if(device.target[0] + device.size.width > $('#container').width()) 	 F[0] -= BOUNDARY_K;
			// if(device.target[1] + device.size.height > $('#container').height()) 	 F[1] -= BOUNDARY_K;
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