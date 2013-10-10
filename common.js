// 
function drawCircle(selector, center, radius, x, y) {

	var total = $(selector).length;
	var alpha = Math.PI * 2 / total;
	       
	$(selector).each(function(index)
	{
	    var theta = Math.PI/2 - alpha * index;
	    var pointx = Math.floor(Math.cos( theta ) * radius);
	    var pointy = Math.floor(Math.sin( theta ) * radius );


	    $(this).css('margin-left', pointx + x + 'px');
	    $(this).css('margin-top', pointy + y + 'px');
	});
}

// reset variables and DOM elements for a new layout
function resetLayouts() {
	
	// Clear DOM elements
	$('#wired_container').remove();
 	$('#wireless_container').remove();
 	$('#wireless_icon').remove();
 	$('#container_background').hide();
 	$("#controller").hide();							// Hide sidebar for drag-and-drop

	// Break references of old devices
	// TODO: Make sure circular references are broken, too
	$.each(devices, function(index, device) {
		device.die();
	});
	// Remove old connections
	$.each(connections, function(index, connection) {
		connection.die();
	});

	// Clear variables
	devices.length = 0;
	personal_devices.length = 0;
	routing_devices.length = 0;
	connections.length = 0;
	bool_add_last = false;								// used onyl in populateDevicesDefault()
	array_wireless_devices.length = 0;					// used only in populateDevicesGrid()
	array_wireless_devices.length = 0;
	array_level1_wired_devices.length = 0;

}
// generates random number that is greater or equal to low-bound, and smaller than high-bound.
function random(low, high) {
	return Math.floor(Math.random() * (high-low)) + low;
}

function random_item(array) {
	return array[random(0, array.length)];
}

var shading = false;
function toggleShading(indicator) {
	if(shading) {
		$(".device").removeClass("shaded");
		shading = false;
		$(indicator).removeClass("shaded");
	}
	else {
		$(".device").addClass("shaded");
		shading = true;
		$(indicator).addClass("shaded");
	}
}

var current_connection_style = 0;
function toggleConnectors(indicator) {
	current_connection_style++;
	$.each(connections, function(index, conn) {
		console.log(conn);
		conn.changeShape(Connection.shapes[current_connection_style % Connection.shapes.length]);
	});
	// Not necessary for now: display which connector style is currently displayed in button
	// var button_label = 'Toggle Connector Style (' + ((current_connection_style % Connection.shapes.length)+1) + '/' + Connection.shapes.length +')';
	// $('li #toggle-button').text(button_label);
}
function setConnectorStyle(shape) {
	$.each(connections, function(index, conn) {
		conn.changeShape(shape);
	});	
}

// OLD
function buildSketchList() {
	var sketches = [
		{ name: "Layout Options",		file: "layout-options.html"	},
		{ name: "Collapsed Nodes",		file: "collapsed-nodes.html" },		
		{ name: "Drag-and-Drop",		file: "drag-and-drop.html" },		
	];
	var listEl = $("#sketchList");
	listEl.append("<h2>SKETCHES:</h2>");
	if(listEl.length > 0) {
		$.each(sketches, function(i, s) {
			var link = $("<a />");
			link.attr("href", s.file);
			link.text(s.name);

			listEl.append(link);
		});
	}
}
// $(document).ready(buildSketchList);