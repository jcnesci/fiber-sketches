// Device prototype
// ----------------
function Device(name, type) {
	this.name = name;
	this.type = type;
	this.size = {width: 200, height: 200}
	this.id = Device.count++;

	this.expanded = true;

	this.connections = [];
	this.n_children = 0;

	this.anchor = {
		"left": ($(document).width() / 2 - this.size.width / 2),
		"top": ($(document).height() / 2 - this.size.height / 2) 
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
		this.el = $("<div><div class='badge'>0</div><div class='icon'></div><div class='name'>" + this.name + "</div></div>");
		this.el.addClass("device " + this.type + " invisible") // Start hidden
		this.el.attr("id", "device_" + this.id);
		this.el.offset(this.anchor);	
		$("#container").append(this.el);
	},
	moveTo: function(pos) {

	},
	show: function() {
		this.el.fadeIn(500);
	},
	hide: function() {
		this.el.fadeOut(500);
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
		this.el.find(".badge").text(this.n_children);
	},
	toggleCollapsed: function() {
		this.expanded = !this.expanded;
		this.update();
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