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

	this.addToDom();
}
Device.count = 0;
Device.prototype = {
	addToDom: function() {
		// Create an element and add it to the DOM
		this.el = $("<div><div class='badge'>0</div><div class='icon'></div><div class='info'><div class='name'>" + this.name + "</div><div class='status'></div></div></div>");
		this.el.addClass("device " + this.type + " invisible") // Start hidden
		this.el.attr("id", "device_" + this.id);
		this.el.offset(this.anchor);	
		$("#container").append(this.el);

		var thisthis = this;
		this.el.find(".name").click(function() { thisthis.editName(true);});
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