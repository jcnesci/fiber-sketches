// Device prototype
// ----------------
function Device(name, type) {
	this.name = name;
	this.type = type;
	this.size = {width: 200, height: 200};
	this.id = Device.count++;

	this.expanded = true;
	this.ip = "192.168.0." + (this.id+1);
	this.static_ip = false;

	this.connections = [];
	this.n_children = 0;

	this.anchor = {
		// "left": ($(document).width() / 2 - this.size.width / 2),
		// "top": ($(document).height() / 2 - this.size.height / 2)
		//dev_jc_17/09/2013_a
		"left": ($('#container').width() / 2 - this.size.width / 2),
		"top": ($('#container').height() / 2 - this.size.height / 2)
	}

	// Physics properties
	this.velocity = [0,0];
	this.mass = 1;
	this.target = [0,0];

	// Content of device settings panel
	// For personal devices
	if ( this.type === "laptop" || this.type === "phone" || this.type === "storage" ) {
		this.advanced_settings = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + this.name + "</div></div>"
			+ "<ul>"
			+	"<li class='left_side'>Device Name</li> 										<li class='text_box'>" + this.name + "</li>"
			+	"<li class='left_side'>Status</li> 												<li>Connected - 100 mbps <span class='help'>?</span></li>"
			+ 	"<li class='left_side'></li><li></li>"
			+	"<li class='left_side'>Device Icon</li> 										<li><span class='device_icons'></span></li>"
			+ 	"<li class='left_side'></li><li></li>"
			+	"<li class='left_side'>IPv6 address</li> 										<li class='text_box'>2001:0db8:3c4d:0015:0000:00</li>"
			+	"<li class='left_side'>IPv4 address</li> 										<li class='text_box'>63.28.214.97</li>"
			+	"<li class='left_side'>MAC address</li> 										<li class='text_box'>1a:2b:3c:4d:5e:6f</li>"
			+	"<li class='left_side'>Reserved IPv4 address</li> 								<li><span class='toggle_off'></span></li>"
			+	"<li class='left_side'></li> 				 									<li class='text_box'>192.168.1.195</li>"
			+ 	"<li class='left_side'></li><li></li>"
			+ 	"<li class='left_side'>Demilitarized Zone (DNS)</li>							<li><span class='toggle_on'></span></li>" 
			+ 	"<li class='left_side'></li><li></li>"
			+ 	"<li class='left_side'>UPnP Port Forwarding</li>								<li><span class='toggle_on'></span></li>" 
			+ "</ul>";
	} // For network box
	else if ( this.type === "networkbox" ) {
		this.advanced_settings = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + this.name + "</div></div>"
			+ "<ul>"
			+	"<li class='left_side'>Fiber Status</li> 										<li>Connected - 100 mbps <span class='help'>?</span></li>"
			+	"<li class='left_side'></li>					 								<li><span class='restart'></span></li>"
			+ 	"<li class='left_side'></li><li></li>"
			+	"<li class='left_side'>Router IPv6 address</li> 								<li>2001:0db8:3c4d:0015:0000:0000:abcd:ef12</li>"
			+	"<li class='left_side'>Router WAN IPv4 address</li> 							<li>63.28.214.97</li>"
			+	"<li class='left_side'>Router LAN MAC address</li> 								<li>1a:2b:3c:4d:5e:6f</li>"
			+	"<li class='left_side'>Router LAN IPv4 address</li> 							<li class='text_box'>192.168.1.1</li>"
			+	"<li class='left_side'>Subnet Mask</li> 										<li class='text_box'>255.255.255.0</li>"
			+	"<li class='left_side'>DHCP Start Address</li> 									<li class='text_box'>192.168.1.100</li>"
			+	"<li class='left_side'>DHCP End Address</li> 									<li class='text_box'>192.168.1.254</li>"
			+ 	"<li class='left_side'></li><li></li>"
			+	"<li class='left_side'>Dynamic DNS service</li> 								<li class='text_box'>DynDNS</li>"
			+	"<li class='left_side'>Username</li> 											<li class='text_box'>BransonFamily</li>"
			+	"<li class='left_side'>Password</li> 											<li class='text_box'>branson11235</li>"
			+	"<li class='left_side'>Domain/hostname</li> 									<li class='text_box'>home.bransonfamily.com</li>"
			+ 	"<li class='left_side'></li><li></li>"
			+	"<li class='left_side'>DHCP Leases</li><li></li>"
			+ 	"<li class='row_dhcp'><span class='dhcp'></span></li>"
			+ 	"<li class='left_side'></li><li></li>"
			+ 	"<li class='left_side'>UPnP Port Forwarding</li>								<li><span class='toggle_off'></span></li>" 
			+ 	"<li class='row_upnp'><span class='upnp'></span></li>"
			+ "</ul>";
	} 																																						// For network box : TODO !!!!!
	else if ( this.type === "wireless_icon" ) {
		this.advanced_settings = "";
	}


	//  for routers
	this.router_visibility = true;

	this.addToDom();
}
Device.count = 0;
Device.prototype = {
	addToDom: function() {
		// Create an element and add it to the DOM
		this.el = $("<div><div class='badge'>0</div><div class='icon'></div><div class='info'><div class='name'>" + this.name + "</div><div class='status'></div></div></div>");
		// dev_jc_29/09/2013_1
		this.el.addClass("device " + this.type + " invisible") // Start hidden
		// this.el.addClass("device " + this.type) // Start hidden
		this.el.attr("id", "device_" + this.id);
		this.el.offset(this.anchor);	
		$("#container").append(this.el);

		var thisthis = this;
		this.el.find(".name").click(function() { thisthis.editName(true);});
	},
	// to show or hide details of a device in hovering pane on click
	showDetails: function (b_show) {
		console.log(b_show);
		
		if ( b_show === true ) {
			
			console.log("--- Show advanced settings panel.");

			// If panel exists already for another device, then remove it first.
			var current_panel = $(".device_advanced_panel");
			if ( current_panel.length ) {
				var current_panel_id = current_panel.attr("id");
				var current_panel_device = $.grep(devices, function(device){ return device.id == current_panel_id; });
				console.log(current_panel_device);
				current_panel_device[0].showDetails(false);
			}

			var new_panel = $("<div />").addClass("device_advanced_panel " + this.type);		// attach device name to as class so we know what device the panel is for.
			new_panel.attr("id", this.id);
			thisthis = this;
			var padding_topAndBottom = 20;
			var padding_leftAndRight = 50;

			// Bug fix found online: must wait 1 clock cycle (accomplished by the 0ms delay here) so that jQuery can succesfully retrieve the width of this newly created element. Otherwise it returns zero.
			setTimeout(function(){
				new_panel.css({
					"top": thisthis.el.offset().top - $("#container").offset().top,// - padding_topAndBottom,
					"left": ( (thisthis.el.offset().left - $("#container").offset().left) + thisthis.el.width()/2 - new_panel.width()/2 ) - padding_leftAndRight,				//DEV - PROBLEM: cant get the calculation right to left-align panel to the clicked device.
					// "padding-top": padding_topAndBottom,
					// "padding-bottom": padding_topAndBottom,
					"padding-left": padding_leftAndRight,
					"padding-right": padding_leftAndRight
				});
			},0);
			new_panel.html(this.advanced_settings);
			new_panel.click(function() { thisthis.showDetails(false);});
			new_panel.prependTo("#container");
			new_panel.fadeIn( 400 );

			// console.log('------ ------ ------ thisthis.top: '+ thisthis.el.offset().top);
			// console.log('------ ------ ------ container.top: '+ $("#container").offset().top);
			// console.log('------ ------ ------ new_panel.top: '+ new_panel.offset().top);
			// console.log('------ ------ ------ new_panel.padding-top: '+ new_panel.css("padding-top"));
			// console.log('------ ------ ------');
			// console.log('------ ------ ------ thisthis.left: '+ thisthis.el.offset().left);
			// console.log('------ ------ ------ thisthis.left: '+ thisthis.el.position().left);
			// console.log('------ ------ ------ container.left: '+ $("#container").offset().left);
			// console.log('------ ------ ------ new_panel.left: '+ new_panel.offset().left);
			// console.log('------ ------ ------ new_panel.padding-left: '+ new_panel.css("padding-left"));

		} else if ( b_show === false ) {
			var current_panel = $(".device_advanced_panel");
			current_panel.fadeOut( 400, function() {
				current_panel.remove();
			} );
		}
	},
	showName: function (b_show) {
		if ( b_show === true ) {
			this.el.find(".name").show();
		} else {
			this.el.find(".name").hide();
		}
	},
	moveTo: function(pos) {

	},
	show: function() {
		this.el.fadeIn(500);
	},
	hide: function() {
		this.el.fadeOut(500);
	},
	changeType: function(t) {
		//if(t == this.type) return;

		var thisthis = this;
		this.el.find(".icon").fadeOut({duration: 200, complete: function() {
			thisthis.el.removeClass(thisthis.type);
			thisthis.el.addClass(t);
			thisthis.el.find(".icon").fadeIn({duration: 200});
			thisthis.type = t;
		}});
	},
	highlight: function(state) {
		if(state == true) {
			this.el.addClass("highlight");
		}
		else {
			this.el.removeClass("highlight");
		}
	},
	toggleStatus: function() {
		var stat = this.el.find(".status");
		if(stat.is(":visible"))
			stat.slideUp();
		else {
			this.buildStatus();
			stat.slideDown();		
		}
	},
	update: function() {
		if(this.el) {
			// Update anchor position based on actual icon position
			var e = this.el.find(".icon");

			this.anchor = {left: e.offset().left + e.width() / 2,
						   top: e.offset().top + e.height() / 2};
		   // this.anchor = {left: e.position().left + e.width() / 2,
					// 	   top: e.position().top + e.height() / 2};

			// Set class based on whether this is expanded or not
			if(this.expanded) this.el.removeClass("collapsed");
			else this.el.addClass("collapsed");

		}

		// Update connections and count children
		this.n_children = 0;
		for(var i=0; i<this.connections.length; i++) {
			this.connections[i].update();
			if(this.connections[i].a == this) this.n_children++;
		}
		// display number of children nodes in this element's badge
		this.el.find(".badge").text(this.n_children);
		
		// hide this node if its a router
		if ( this.router_visibility === false ) {
			this.el.children().css("opacity", 0);
		} else {
			this.el.children().css("opacity", 1);
		}

	},
	buildStatus: function() {
		this.el.find(".status").html("STATUS: ONLINE<br />IP " + (this.static_ip ? "(static)" : "(DHCP)") + ": <div class='ip_slot'>" + this.ip + "</div>");
	},
	expandSubnodes: function() {
		console.log("--------- expandSubnodes !");
		// if opening this node... 
        if ( this.expanded === false ) {
        	// close other open nodes first
        	$.each(routing_devices, function(index, other_dev) {
	            if ( other_dev.expanded === true && other_dev.name !== "Network Box" ) {
	              other_dev.expanded = false;
	              if ( other_dev.type === "router" ) this.router_visibility = true;				// re-display router nodes that we are collapsing back.
	              other_dev.update();
	            }
	        });
        	// hide this node if it is a router
        	if ( this.type === "router" ) this.router_visibility = false;
	        // then show my subnodes
			this.expanded = true;
			this.update();
        }
        
	},
	editName: function(state) {
		if(state == true) {
			var name_el = this.el.find(".name");
			name_el.after("<input type='text' class='edit_name' />");
			var edit_el = this.el.find(".edit_name");

			name_el.hide();

			edit_el.attr("value", this.name);
			edit_el.focus();

			var thisthis = this;
			edit_el.blur(function() {
				thisthis.editName(false);
			});
			edit_el.keydown(function(event) {
				if(event.keyCode == 13)
					thisthis.editName(false);
			});
		}
		if(state == false) {
			this.name = this.el.find(".edit_name").val();
			console.log(this);
			console.log(this.name);
			this.el.find(".name").text(this.name);
			this.el.find(".edit_name").hide();
			this.el.find(".name").show();
		}
	},
	distanceTo: function(b) {
		var dx = b.anchor.left - this.anchor.left;
		var dy = b.anchor.top - this.anchor.top;
		return Math.sqrt(dx*dx + dy*dy);
	},
	physicsDistanceTo: function(b) {
		var dx = b.target[0] - this.target[0];
		var dy = b.target[1] - this.target[1];
		return Math.sqrt(dx*dx + dy*dy);
	},
	physicsDistanceToSquared: function(b) {
		var dx = b.target[0] - this.target[0];
		var dy = b.target[1] - this.target[1];
		return Math.abs(dx*dx + dy*dy);
	},
	physicsVectorTo: function(b) {
		var dx = b.target[0] - this.target[0];
		var dy = b.target[1] - this.target[1];
		return [dx, dy];
	},

	die: function() {
		this.el.remove();
		$.each(this.connections, function(i, conn) {
			if(conn)
				conn.die();
		});

		this.connections.length = 0;
	}
}