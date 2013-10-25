// 
$( window ).resize(function() {

	$.each(devices, function(index, device) {
	  device.update();
	});
	// For Grid layout, re-position the Wired background div (grey container) when user resizes window.
	if (_layout_type === "grid") {
		$("#container_background").css({
			"top": $(".device.networkbox").offset().top - $(".device.wireless_network").attr("spacing")/2,
			"left": $('#container').width()/2 - $('#container_background').width()/2 + $('#container').offset().left
		});
	}
});
// Was used to update SVG lines so they draw lines below edge of screen when user scrolls. Stopped working somehow.
// $( window ).scroll(function() {
// 	$.each(devices, function(index, device) {
// 	  device.update();
// 	});
// });
// 
$(document).bind('click', function (e) {

	// When clicking on anything outside of an open device settings panel, close the panel.
    if( $(".device_advanced_panel").length && !$(e.target).is(".device_advanced_panel") && !$(e.target).closest(".device_advanced_panel").length ) {
        var current_panel_id = $(".device_advanced_panel").attr("id");
		var current_panel_device = $.grep(devices, function(device){ return device.id === Number(current_panel_id); });
		current_panel_device[0].showDetails(false);
    }
});
// Sometimes expanding nodes will make the page longer, and SVG lines won't draw below the edge of the screen unless we reset the document height on the SVG div.
function resetSvgDivHeight() {
	// Get the height of the document by choosing the largest number of all possible height document attributes.
	var body = document.body,
    	html = document.documentElement;
	var height = Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight );	
	// use the global multiplier var
	if (svg_div_height_multiplier === undefined) svg_div_height_multiplier = 1;
	// console.log(" * * * * * height * "+svg_div_height_multiplier+" = "+ height * svg_div_height_multiplier);
	$('svg').height( height * svg_div_height_multiplier );
}
// Provide HTML content for a specified device's settings panel.
function getDevicePanelHTML(device) {
	var device_panel_html;
	var device_type = device.type;
	var device_name = device.name;
	// console.log("device_type: "+ device_type +" | device_name: "+ device_name);
	// For personal devices
	if ( device_type === "laptop" || device_type === "phone" || device_type === "storage" ) {
		device_panel_html = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + device_name + "</div></div>"
			+ "<ul>"
			+	"<li>Device name</li> 															<li class='text_box'>" + device_name + "</li>"
			+	"<li>Status</li> 																<li>Connected - 1000 mbps <span class='help'>?</span></li>"
			+ 	"<li></li><li></li>"
			+	"<li>Device icon</li> 															<li><span class='device_icons'></span></li>"
			+ 	"<li></li><li></li>"
			+	"<li>IPv6 address</li> 															<li class='text_box'>2001:0db8:3c4d:0015:0000:00</li>"
			+	"<li>IPv4 address</li> 															<li class='text_box'>63.28.214.97</li>"
			+	"<li>MAC address</li> 															<li class='text_box'>1a:2b:3c:4d:5e:6f</li>"
			+	"<li>Reserved IPv4 address</li> 												<li><span class='toggle_off'></span></li>"
			+	"<li></li> 				 														<li class='text_box'>192.168.1.195</li>"
			+ 	"<li></li><li></li>"		
			+ 	"<li>Demilitarized Zone (DNS)</li>												<li><span class='toggle_on'></span></li>" 
			+ 	"<li></li><li></li>"
			+ 	"<li>UPnP port forwarding</li>													<li><span class='toggle_on'></span></li>" 
			+ "</ul>";
	} // For network box
	else if ( device_type === "networkbox" ) {
		device_panel_html = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + device_name + "</div></div>"
			+ "<ul>"
			+	"<li>Fiber status</li> 															<li>Connected - 1000 mbps <span class='help'>?</span></li>"
			+	"<li></li>					 													<li><span class='restart'></span></li>"
			+ 	"<li></li><li></li>"
			+	"<li>Router IPv6 address</li> 													<li>2001:0db8:3c4d:0015:0000:0000:abcd:ef12</li>"
			+	"<li>Router WAN IPv4 address</li> 												<li>63.28.214.97</li>"
			+	"<li>Router LAN MAC address</li> 												<li>1a:2b:3c:4d:5e:6f</li>"
			+	"<li>Router LAN IPv4 address</li> 												<li class='text_box'>192.168.1.1</li>"
			+	"<li>Subnet mask</li> 															<li class='text_box'>255.255.255.0</li>"
			+	"<li>DHCP start sddress</li> 													<li class='text_box'>192.168.1.100</li>"
			+	"<li>DHCP end address</li> 														<li class='text_box'>192.168.1.254</li>"
			+ 	"<li></li><li></li>"
			+	"<li>Dynamic DNS service</li> 													<li class='text_box'>DynDNS</li>"
			+	"<li>Username</li> 																<li class='text_box'>JESS3_DNS</li>"
			+	"<li>Password</li> 																<li class='text_box'>myP@$$w0rd!</li>"
			+	"<li>Domain/hostname</li> 														<li class='text_box'>home.jess3.com</li>"
			+ 	"<li></li><li></li>"
			+	"<li>DHCP leases</li><li></li>"
			+ 	"<li class='row_dhcp'><span class='dhcp'></span></li>"
			+ 	"<li></li><li></li>"
			+ 	"<li>UPnP port forwarding</li>													<li><span class='toggle_off'></span></li>" 
			+ 	"<li class='row_upnp'><span class='upnp'></span></li>"
			+ "</ul>";
	}
	else if ( device_type === "wireless_network" ) {
		device_panel_html = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + device_name + "</div></div>"
			+ "<ul>"
			+	"<li>Wi-Fi name</li> 															<li class='text_box'>JESS3_Network</li>"
			+	"<li>Wi-Fi password</li> 														<li class='text_box'>myP@$$w0rd!</li>"
			+	"<li>Wireless network</li> 														<li><span class='toggle_off'></span></li>"
			+	"<li>Broadcast SSID</li> 														<li><span class='toggle_off'></span></li>"
			+ 	"<li></li><li></li>"
			+	"<li>Other 5GHZ wireless network</li> 											<li><span class='toggle_off'></span></li>"
			+	"<li>5GHZ Wi-Fi name</li> 														<li class='text_box'>JESS3_Guest</li>"
			+ "</ul>";
	}
	else if ( device_type === "tvbox" ) {
		device_panel_html = "<div class='icon'></div>"
			+ "<div class='info'><div class='name'>" + device_name + "</div></div>"
			+ "<ul>"
			+	"<li>TV box name</li> 															<li class='text_box'>"+ device.name +"</li>"
			+	"<li>Status</li>		 														<li>Connected - 400 mbps (coaxial) <span class='help'>?</span></li>"
			+ 	"<li></li><li></li>"
			+	"<li>Wi-Fi radio</li> 															<li><span class='toggle_off'></span></li>"
			+ 	"<li></li><li></li>"
			+	"<li>IPv6 address</li> 															<li class='text_box'>2001:0db8:3c4d:0015:0000:00</li>"
			+	"<li>IPv4 address</li> 															<li class='text_box'>63.28.214.97</li>"
			+	"<li>MAC address</li> 															<li class='text_box'>1a:2b:3c:4d:5e:6f</li>"
			+ "</ul>";
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
		device.showDetails(false);
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
	svg_div_height_multiplier = 1;						// used for resize the SVG div so lines are rendered completely even if they are beneath the bottom of the screen cut-off point. Goes with the zoom operations below.

	// Reset these menu items that are greyed-out for certain layouts.
	$('#menu li ul li a').filter(function(){ return $(this).text() === 'Toggle Connector Style';}).css("color", "");
  	$('#menu li a').filter(function(){ return $(this).text() === 'Complexity';}).parent("li").contents().find("a").css("color", "");

	// reset zooms caused by certain layouts (physics>high complexity)
	$("#container").css("zoom", 1);
	$("#svg_container").css("zoom", 1);
	resetSvgDivHeight();

	// Re-populate name arrays
	a_random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine", "Mom", "Dad", "Steve", "Kengo", "Kumar"];
	a_random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room", "Den", "Library", "Man Cave", "Garage", "Gameroom"];

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
	if ( _layout_type !== "grid" ) {
		current_connection_style++;
		$.each(connections, function(index, conn) {
			console.log(conn);
			conn.changeShape(Connection.shapes[current_connection_style % Connection.shapes.length]);
		});
	}
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