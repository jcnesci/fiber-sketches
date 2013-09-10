// Connection prototype
// --------------------
function Connection(a, b, type, strength) {
	this.a = a;	// Device A
	this.b = b; // Device B
	this.type = type;
	this.strength = strength;

	this.a.connections.push(this)
	this.b.connections.push(this)

	this.addToDom();
}
Connection.prototype = {
	addToDom: function() {
		// Create the DOM elements needed to draw this connection
		if(this.type == "wired" || this.type == "wireless") {
			//this.el = $("<line x1='0' y1='0' x2='100' y2='100' class='connector' />");
			var svg = $("#svg_container").svg('get');
			var x1 = this.a.anchor.left;
			var y1 = this.a.anchor.top;
			var x2 = this.b.anchor.left;
			var y2 = this.b.anchor.top;
			this.el = $(svg.line(x1, y1, x2, y2));
			this.el.addClass("connector");

			if(this.type == "wireless") this.el.addClass("wireless");
		}
	},
	update: function() {
		// Update enpoints
		var x1 = this.a.anchor.left;
		var y1 = this.a.anchor.top;
		var x2 = this.b.anchor.left;
		var y2 = this.b.anchor.top;

		this.el.attr("x1", x1);
		this.el.attr("y1", y1);
		this.el.attr("x2", x2);
		this.el.attr("y2", y2);

		if(this.a.el.is(":visible") && this.b.el.is(":visible")) {
			this.el.show();
		}
		else {
			this.el.hide();
		}
	},
	die: function() {
		this.el.remove();
		// Remove references from devices
		var i = this.a.connections.indexOf(this);
		if(i >= 0)
			this.a.connections.splice(i, 1);
		i = this.a.connections.indexOf(this);
		if(i >= 0)
			this.b.connections.splice(i, 1);
	}

}
