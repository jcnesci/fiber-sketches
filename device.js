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

	// Advanced Settings Panel html content
	this.advanced_settings = "<div class='icon "+ this.type + "'></div>"
		+ "<h2>Advanced Settings</h2>" 
		+ "<ul>"
		+	"<li>Network SSID 				<span class='right_side'>NetworkName85</span></li>"
		+	"<li>Password 					<span class='right_side'>password1204!</span></li>"
		+	"<li>Status 					<span class='right_side'>Connected - 1000 mbps</span></li>"
		+	"<li>Wireless Network 			<span class='right_side'>Enabled</span></li>"
		+	"<li>Broadcast WiFi SSID 		<span class='right_side'>Disabled</span></li>"
		+	"<li>Dynamic DNS 				<span class='right_side'>Disabled</span></li>"
		+	"<li>DHCP Leases 				<span class='right_side'>Disabled</span></li>"
		+ "</ul>";

	this.addToDom();
}
Device.count = 0;
Device.prototype = {
	addToDom: function() {
		// Create an element and add it to the DOM
		this.el = $("<div><div class='badge'>0</div><div class='icon'></div><div class='info'><div class='name'>" + this.name + "</div><div class='status'></div></div></div>");
		// dev_jc_29/09/2013_1
		this.el.addClass("device " + this.type + " invisible") // Start hidden
		this.el.addClass("device " + this.type) // Start hidden
		this.el.attr("id", "device_" + this.id);
		this.el.offset(this.anchor);	
		$("#container").append(this.el);

		var thisthis = this;
		this.el.find(".name").click(function() { thisthis.editName(true);});
	},
	// to show or hide details of a device in hovering pane on click
	showDetails: function (b_show) {
		console.log(b_show);
		var current_panel = $(".device_advanced_panel");

		if ( b_show === true ) {
			// this.el.find(".name").show();		//OLD
			
			// If the Avanced settings panel doesn't already exist, create it with content for this device.
			if ( !current_panel.length ) {
				console.log("--- New advanced settings panel.");

				var new_panel = $("<div />").addClass("device_advanced_panel " + this.id);		// attach device name to as class so we know what device the panel is for.
				thisthis = this;
				// Bug fix found online: must wait 1 clock cycle (accomplished by the 0ms delay here) so that jQuery can succesfully retrieve the width of this newly created element. Otherwise it returns zero.
				setTimeout(function(){
					new_panel.css({
						"top": thisthis.el.offset().top - $("#container").offset().top,
						"left": (thisthis.el.offset().left - $("#container").offset().left) + thisthis.el.width()/2 - new_panel.width()/2 				//DEV - PROBLEM: cant get the calculation right to left-align panel to the clicked device.
					});
				},0);
				new_panel.html(this.advanced_settings);
				new_panel.click(function() { thisthis.showDetails(false);});
				new_panel.prependTo("#container");

				console.log('Panel OFFSET: '+ new_panel.offset().top);
				console.log('Panel POSITION: '+ new_panel.position().top);
				console.log('This OFFSET: '+ this.el.offset().top);
				console.log('This POSITION: '+ this.el.position().top);
			} else {
				// If it already exists, check if it contains the data for this device already.
				if (current_panel.hasClass(this.id)) {
					console.log("----- Has data already. Don't need to reload data.");
				}
				// If it doesn't, load the new data for this device.
				else {
					console.log("-------- Doesnt have Data already. Load new Data.");
					thisthis = this;
					setTimeout(function(){
						current_panel.css({
							"top": thisthis.el.offset().top - $("#container").offset().top,
							"left": (thisthis.el.offset().left - $("#container").offset().left) + thisthis.el.width()/2 - current_panel.width()/2 				//DEV - PROBLEM: cant get the calculation right to left-align panel to the clicked device.
						});
					},0);
					current_panel.html(this.advanced_settings);
				}
			}
			current_panel.show();

		} else if ( b_show === false ) {
			// this.el.find(".name").hide();		//OLD
			current_panel.hide();
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
	},
	buildStatus: function() {
		this.el.find(".status").html("STATUS: ONLINE<br />IP " + (this.static_ip ? "(static)" : "(DHCP)") + ": <div class='ip_slot'>" + this.ip + "</div>");
	},
	toggleCollapsed: function() {
		console.log("--------- toggleCollapsed !");
		// if opening this node, close other open nodes first
        if ( this.expanded === false ) {
          $.each(routing_devices, function(index, other_dev) {
            if ( other_dev.expanded === true && other_dev.name !== "Network Box" ) {
              other_dev.expanded = false;
              other_dev.update();
            }
          });
        }
        // then open this node
		this.expanded = !this.expanded;
		this.update();
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