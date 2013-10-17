// to refresh SVG lines when window is resized or scrolled
$( window ).resize(function() {
	$.each(devices, function(index, device) {
	  device.update();
	});
});
$( window ).scroll(function() {
	$.each(devices, function(index, device) {
	  device.update();
	});
});
// 
$(document).bind('click', function (e) {

	// When clicking on anything outside of an open device settings panel, close the panel.
    if( $(".device_advanced_panel").length && !$(e.target).is(".device_advanced_panel") && !$(e.target).closest(".device_advanced_panel").length ) {
        var current_panel_id = $(".device_advanced_panel").attr("id");
		var current_panel_device = $.grep(devices, function(device){ return device.id == current_panel_id; });
		console.log(current_panel_device);
		current_panel_device[0].showDetails(false);
    }
});
// Provide HTML content for a specified device's settings panel.
function getDevicePanelHTML(device) {
	var device_panel_html;
	var device_type = device.type;
	var device_name = device.name;
	// For personal devices
	if ( device_type === "laptop" || device_type === "phone" || device_type === "storage" ) {
		device_panel_html = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + device_name + "</div></div>"
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
	else if ( device_type === "networkbox" ) {
		device_panel_html = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + device_name + "</div></div>"
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
	else if ( device_type === "wireless_icon" ) {
		device_panel_html = "";
	}
	return device_panel_html;
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
	array_wireless_devices.length = 0;					// used only in populateDevicesGrid()
	array_level1_wired_devices.length = 0;				// used only in populateDevicesGrid()

}
// generates random number that is greater or equal to low-bound, and smaller than high-bound.
function random(low, high) {
	return Math.floor(Math.random() * (high-low)) + low;
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