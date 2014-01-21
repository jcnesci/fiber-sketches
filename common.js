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
	} else if (_layout_type === "accordion grid") {
		$("#container_background").css({
			"top": $("#wired_container").offset().top,
			"left": $('#wired_container').width()/2 - $('#container_background').width()/2 + $('#wired_container').offset().left
		});
	}
});
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
	$('svg').height( height * svg_div_height_multiplier );
}
// 
function getDeviceAccordionHTML(device) {
	var device_panel_html;
	var device_id = device.id;
	var device_type = device.type;
	var device_name = device.name;
	var device_name_escapedQuotes = device_name.replace(/'/g, '&#39;');				// html input fields don't accept single quotes directly, they must be escaped.
	var toggle_btn_id = 0;
	// For personal devices
	if ( device_type === "laptop" || device_type === "phone" || device_type === "storage" ) {
		device_panel_html = "<h3 class="+ device_type +"><a href='#' class='header-name'>" + device_name + "</a></h3>"
							+ "<div>"
							+ "<ul>"
							+	"<li class='left'>Device name</li> 															<li class='right'><input class='content-name' value='" + device_name_escapedQuotes + "' size='40' maxlength='40'></li>"
							+	"<li class='left'>Status</li> 																<li class='right'>Connected - 1000 mbps <span class='help'>?</span></li>"
							+ 	"<li></li>"
							+	"<li class='left'>Device icon</li> 															<li class='right change_type' device_id='"+ device_id +"'><span class='change_type_container'><span class='icon laptop' type='laptop'></span><span class='icon phone' type='phone'></span><span class='icon tv' type='tv'></span><span class='icon storage' type='storage'></span></span></li>"
							+ 	"<li></li>"			
							+	"<li class='left'>IPv6 address</li> 														<li class='right'><input value='2001:0db8:3c4d:0015:0000:00'></li>"
							+	"<li class='left'>IPv4 address</li> 														<li class='right'><input value='63.28.214.97'></li>"
							+	"<li class='left'>MAC address</li> 															<li class='right'><input value='1a:2b:3c:4d:5e:6f'></li>"							
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "off") +"</li>"
							+	"<li class='left'></li> 				 													<li class='right'><input value='192.168.1.195'></li>"
							+ 	"<li></li>"					
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "on") +"</li>"
							+ 	"<li></li>"			
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "on") +"</li>"
							+ "</ul>"
							+ "</div>";
	}
	else if ( device_type === "networkbox" ) {
		device_panel_html = "<h3 class="+ device_type +"><a href='#' class='header-name'>" + device_name + "</a></h3>"
							+ "<div>"
							+ "<ul>"
							+	"<li class='left'>Fiber status</li> 														<li class='right'>Connected - 1000 mbps <span class='help'>?</span></li>"
							+	"<li class='left'>						 													<li class='right'><span class='restart'></span></li>"
							+ 	"<li></li>"
							+	"<li class='left'>Router IPv6 address</li> 													<li class='right'>2001:0db8:3c4d:0015:0000:0000:abcd:ef12</li>"
							+	"<li class='left'>Router WAN IPv4 address</li> 												<li class='right'>63.28.214.97</li>"
							+	"<li class='left'>Router LAN MAC address</li> 												<li class='right'>1a:2b:3c:4d:5e:6f</li>"
							+	"<li class='left'>Router LAN IPv4 address</li> 												<li class='right'><input value='192.168.1.1'></li>"
							+	"<li class='left'>Subnet mask</li> 															<li class='right'><input value='255.255.255.0'></li>"
							+	"<li class='left'>DHCP start sddress</li> 													<li class='right'><input value='192.168.1.100'></li>"
							+	"<li class='left'>DHCP end address</li> 													<li class='right'><input value='192.168.1.254'></li>"
							+ 	"<li></li>"
							+	"<li class='left'>Dynamic DNS service</li> 													<li class='right'><input value='DynDNS'></li>"
							+	"<li class='left'>Username</li> 															<li class='right'><input value='JESS3_DNS'></li>"
							+	"<li class='left'>Password</li> 															<li class='right'><input value='myP@$$w0rd!'></li>"
							+	"<li class='left'>Domain/hostname</li> 														<li class='right'><input value='home.jess3.com'></li>"
							+ 	"<li></li>"
							+	"<li class='left accordion_cat_title'>DHCP leases</li><li></li>"
							+ 	"<li class='accordion_full_row'>"+ getAccordionTable("dhcp") +"</li>"
							+ 	"<li></li>"
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "off") +"</li>"
							+ 	"<li class='accordion_full_row'>"+ getAccordionTable("upnp") +"</li>"
							+ "</ul>"
							+ "</div>";
	}
	else if ( device_type === "wireless_network" ) {
		device_panel_html = "<h3 class="+ device_type +"><a href='#' class='header-name'>" + device_name + "</a></h3>"
							+ "<div>"
							+ "<ul>"
							+	"<li class='left'>Wi-Fi name</li> 															<li class='right'><input class='content-name' value='" + device_name_escapedQuotes + "' size='40' maxlength='40'></li>"
							+	"<li class='left'>Wi-Fi password</li> 														<li class='right'><input class='content-password' value='myP@$$w0rd!' size='40' maxlength='40'></li>"
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "off") +"</li>"
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "off") +"</li>"
							+	"<li></li>"
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "off") +"</li>"
							+	"<li class='left'>5GHZ Wi-Fi name</li> 														<li class='right'><input value='JESS3_Guest' size='40' maxlength='40'></li>"
							+ "</ul>"
							+ "</div>";
	}
	else if ( device_type === "tvbox" ) {
		device_panel_html = "<h3 class="+ device_type +"><a href='#' class='header-name'>" + device_name + "</a></h3>"
							+ "<div>"
							+ "<ul>"
							+	"<li class='left'>TV box name</li> 															<li class='right'><input class='content-name' value='" + device_name_escapedQuotes + "' size='40' maxlength='40'></li>"
							+	"<li class='left'>Status</li> 																<li class='right'>Connected - 400 mbps (coaxial) <span class='help'>?</span></li>"
							+	"<li></li>"
							+	"<li class='left'>Reserved IPv4 address</li> 												<li class='right'>"+ getToggleButton(device.id +"_"+ toggle_btn_id++, "off") +"</li>"
							+	"<li></li>"
							+	"<li class='left'>IPv6 address</li> 														<li class='right'><input value='2001:0db8:3c4d:0015:0000:00' size='40' maxlength='40'></li>"
							+	"<li class='left'>IPv4 address</li> 														<li class='right'><input value='63.28.214.97' size='40' maxlength='40'></li>"
							+	"<li class='left'>MAC address</li> 															<li class='right'><input value='1a:2b:3c:4d:5e:6f' size='40' maxlength='40'></li>"
							+ "</ul>"
							+ "</div>";
	}
	return device_panel_html;
}
// 
function getAccordionTable(table) {
	var table_html = "";

	switch (table) {
		case "dhcp":
			table_html = "<table class='tftable' border='1'>"
				+ "<tr><th>Device name</th><th>MAC address</th><th>IP address</th><th>Expiry</th></tr>"
				+ "<tr><td>TV Box Livingroom</td><td>12-34-56-78-9A-BD</td><td>192.168.1.101</td><td>4h15m3s</td></tr>"
				+ "<tr><td>Livingroom TV</td><td>12-34-56-78-9A-BV</td><td>192.168.1.103</td><td>Reserved</td></tr>"
				+ "<tr><td>Matt's Storage</td><td>12-34-56-78-9A-BH</td><td>192.168.1.104</td><td>Reserved</td></tr>"
				+ "<tr><td>Scanner</td><td>12-34-56-78-9A-BG</td><td>192.168.1.107</td><td>Reserved</td></tr>"
				+ "<tr><td>Printer</td><td>12-34-56-78-9A-BF</td><td>192.168.1.108</td><td>10h03m45s</td></tr>"
				+ "</table>";
			break;
		case "upnp":
			table_html = "<table class='tftable' border='1'>"
				+ "<tr><th>Device name</th><th>Port range</th><th>Service</th></tr>"
				+ "<tr><td>Matt's Storage</td><td>80</td><td>HTTP</td></tr>"
				+ "<tr><td>Printer</td><td>6881-6890</td><td>HTTPS</td></tr>"
				+ "<tr><td>Matt's Laptop</td><td>443</td><td>Bittorrent (UPnP)</td></tr>"
				+ "</table>";
			break;	
	}

	return table_html;
}

// 
function getToggleButton(id, starting_state) {
	var toggle_html = "<div class='onoffswitch starts-"+starting_state+"'>"
		+ "    <input type='checkbox' name='onoffswitch' class='onoffswitch-checkbox' id='myonoffswitch_"+id+"' checked>"
		+ "    <label class='onoffswitch-label' for='myonoffswitch_"+id+"'>"
		+ "        <div class='onoffswitch-inner'></div>"
		+ "        <div class='onoffswitch-switch'></div>"
		+ "    </label>"
		+ "</div>";
	return toggle_html;
}

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

 	// Clear DOM elements related to 'accordion grid'.
 	$('#container_final').hide();
 	$('#container').show();
 	$(".row").remove();
 	$("#svg_container svg").css({ top: 0 });

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
			conn.changeShape(Connection.shapes[current_connection_style % Connection.shapes.length]);
		});
	}
}
function setConnectorStyle(shape) {
	$.each(connections, function(index, conn) {
		conn.changeShape(shape);
	});	
}
