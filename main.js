var devices = [];     // All devices
var personal_devices = [];  // Computers/laptops and mobile devices
var routing_devices = [];   // Network boxes, tv boxes, or other routers/switches
var array_wireless_devices = [];

var connections = [];
var max_tv_devices = 2;
var bool_add_last = false;
// Drag-and-drop specific stuff
var dragging = null; // item that is being dragged
var hovering = null; // item currently hovering over

$(document).ready(function() {
  $("#svg_container").svg();  // Initialize the SVG canvas
  $("#controller").hide();    // Hide the Controller div for the Drag-and-Drop feature
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
  // create and display network
  
  // DEV - TEMPORARY - - - - - - - - - - - - - - - - - - - - - - - - 
  // populateDevicesGrid();
  // layoutDevices("grid");
  populateDevicesOrbital();
  layoutDevices("orbital");
  
  // populateDevicesDefault();
  // layoutDevices("tree");

  // Not necessary for now: display which connector style is currently displayed in button
  // var button_label = 'Toggle Connector Style (' + ((current_connection_style % Connection.shapes.length)+1) + '/' + Connection.shapes.length +')';
  // $('li #toggle-button').text(button_label);

});

// For Orbital layout
function populateDevicesOrbital() {
  resetLayouts();

  devices.push(new Device("Network Box", "networkbox"));  // devices[0] is always the network box
  routing_devices.push(devices[0]);
  devices[0].mass = 100;

  var random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine"];
  var random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room"];
  var n_personal_devices = Math.round(Math.random() * 8 + 2);
  var n_tv_devices = Math.round(Math.random() * 3);

  // Create personal devices (phones, laptops, etc)
  for(var i=0; i<n_personal_devices; i++) {
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var propertype = type.charAt(0).toUpperCase() + type.slice(1);

    var unique_name = false;
    var name = ""; 
    while(!unique_name) {
      name = random_names[Math.round(Math.random() * (random_names.length-1))] + "'s " + propertype;
      // Check all devices to see if this name is taken
      var taken = false;
      for(var j=0; j<devices.length; j++) {
        if(devices[j].name == name) taken = true;
      }
      if(!taken) unique_name = true;
    }

    var dev = new Device(name, type);
    devices.push(dev);
    personal_devices.push(dev);
  }

  // Create TV devices which always come in a pairs with a TV box
  for(var i=0; i<n_tv_devices; i++) {
    var room = random_rooms[Math.round(Math.random() * (random_rooms.length-1))];
    var box_device = new Device(room + " TV Box", "tvbox");
    var tv_device = new Device(room + " TV", "tv");
    devices.push(box_device);
    routing_devices.push(box_device);
    devices.push(tv_device);

    // Connect TVs to TV Box
    var connectionTV = new Connection(box_device, tv_device, "wired", 1);
    connectionTV.changeShape("straight");
    connections.push(connectionTV);

    // Connect TV Box to Network Box
    var connectionTVBox = new Connection(devices[0], box_device, "wired", 1);
    connectionTVBox.changeShape("straight");
    connections.push(connectionTVBox);
  }


  // Connect each device to a router
  $.each(personal_devices, function(index, device) {
    var router = Math.random() < 0.8 ? devices[0] : routing_devices[random(0, routing_devices.length)]; // Favor network box

    var type = Math.random() < 0.5 ? "wired" : "wireless";
    var connection = new Connection(router, device, type, 1);
    connection.changeShape("straight");
    connections.push(connection);
  });
}

// For 2 Zone layout for Wireless and Wired devices, featuring a 4-column grid.
function populateDevicesGrid() {
  console.log('- - - - - - - - - - -');
  console.log('populateDevicesGrid() ENTER');
  console.log('- - - - - - - - - - -');

  // - - - - - - - - - - - - - - - SETUP - - - - - - - - - - - - - - - - - 

  resetLayouts();
  $('#container_background').show();

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Create the main Network Box
  $("#container").append("<div id='wired_container'></div>");
  var network_box = new Device("Network Box", "networkbox");
  devices.push(network_box);  // devices[0] is always the network box
  network_box.el.appendTo( $('#wired_container') );
  // TODO: make Net Box icon bigger.

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Wireless devices
  var n_wireless_devices = 6;  //random(1, 10);
  $("#container").append("<div id='wireless_container'></div>");
  for ( var i = 0; i < n_wireless_devices; i++ ) {
    // create a wireless device
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var wireless_device = new Device("Wireless Device "+ i, type );
    wireless_device.isWireless = true;   // add custom attribute for layout positioning
    devices.push(wireless_device);
    array_wireless_devices.push(wireless_device);
    wireless_device.el.appendTo( $('#wireless_container') );
    // connections
    var connection = new Connection(devices[0], wireless_device, "wireless", 1 );
    connection.shape = "invisible";
    connections.push( connection );
    // dev
    // console.log(' WIRELESS --------');
    // console.log(wireless_device);
  }
  $("#container").append("<div id='wireless_icon'></div>");
  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 

  // Create 1st level of wired connections: maximum is 4 devices total.
  var n_level1_tv_box = random(0, 2); // either 0 or 1
  var n_level1_routing_devices = random(1, ( 5 - n_level1_tv_box ) ); // generate routing devices/switches: 1 to 4, minus TV Box if any
  var n_level1_personal_devices = random(0, ( 5 - n_level1_tv_box - n_level1_routing_devices) );  // generate personal devices: 1 to 4, minus TV Box & routing devices
  // var n_level1_total_devices = n_level1_tv_box + n_level1_routing_devices + n_level1_personal_devices;     // UNUSED as of yet.
  var array_level1_wired_devices = [];  // push devices in this storage array ; will be useful to collapse them all with one function
  // Initialize TV Box + TV : these are the only nodes that start uncollapsed (we see the TV under the TV Box) whereas all other nodes with children hide them at start.
  for ( var i = 0; i < n_level1_tv_box; i++ ) {
    var box_device = new Device("TV Box", "tvbox");
    var tv_device = new Device("TV", "tv");
    devices.push(box_device);
    array_level1_wired_devices.push(box_device);
    devices.push(tv_device);
    box_device.el.appendTo( $('#wired_container') );
    tv_device.el.appendTo( $('#wired_container') );
    // In advance, connect TV to TV Box (but it wont display until TV Box is connected to Network Box).
    var connection = new Connection(box_device, tv_device, "wired", 1);
    connection.shape = "90s";
    connections.push(connection);
    // click function to collapse/uncollapse TV Box : it always starts uncollapsed, showing its TV
    box_device.el.click((function(dev) { return function() { 
      if ( dev.expanded === false ) {
        // close other routing devices
        $.each(routing_devices, function(index, other_dev) {
          if ( other_dev.expanded === true && other_dev.name !== "Network Box" ) {
            other_dev.expanded = false;
            other_dev.update();
          }
        });
      }
      // open this clicked node
      dev.toggleCollapsed(); 
      layoutDevices('grid');
    } })(box_device));
  } 
  // Initialize Routing Devices/Switches
  for ( var i = 0; i < n_level1_routing_devices; i++ ) {
    var routing_device = new Device("Routing Device " + i, "router");
    devices.push(routing_device);
    routing_devices.push(routing_device);
    array_level1_wired_devices.push(routing_device);
    routing_device.el.appendTo( $('#wired_container') );

    // collapse router so we don't see it's children at start.
    routing_device.expanded = false;  // Start off closed
    // Same as above. Closures are weird.
    routing_device.el.click((function(dev) { return function() { 
      // if opening this node, close other open nodes first
      if ( dev.expanded === false ) {
        // close other routing devices
        $.each(routing_devices, function(index, other_dev) {
          if ( other_dev.expanded === true && other_dev.name !== "Network Box" ) {
            other_dev.expanded = false;
            other_dev.update();
          }
        });
        // close TV Box too
        if ( n_level1_tv_box > 0 ) {
          // get all tv boxes
          var tv_boxes = $.grep(array_level1_wired_devices, function( dev, i ) {
            return dev.type === "tvbox";
          });
          // collapse them to hide its children
          $.each(tv_boxes, function(index, dev) {
            dev.expanded = false;
            dev.update();
          });
        }
      }
      // open this clicked node
      dev.toggleCollapsed(); 
      layoutDevices('grid');
    } })(routing_device));
  }
  // Initialize Personal Devices
  for ( var i = 0; i < n_level1_personal_devices; i++ ) {
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var personal_device = new Device("Personal Device " + i, type);
    devices.push(personal_device);
    array_level1_wired_devices.push(personal_device);
    personal_device.el.appendTo( $('#wired_container') );
  }
  // Display all level 1 devices by creating connections for each to Network Box.
  for ( var i = 0; i < array_level1_wired_devices.length; i++ ) {
    var connection = new Connection(devices[0], array_level1_wired_devices[i], "wired", 1);
    connection.shape = "90s";
    connections.push(connection);
  }
  // 
  console.log('n_level1_tv_box = ' + n_level1_tv_box);
  console.log('n_level1_routing_devices = ' + n_level1_routing_devices);
  console.log('n_level1_personal_devices = ' + n_level1_personal_devices);
  console.log('array_level1_wired_devices.length = ' + array_level1_wired_devices.length);
  console.log(array_level1_wired_devices);
  console.log('- - - - - - - - - - -');


  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - 


  // For each Routing Device in Level1, create a random number of children devices in Level2
  var array_level2_wired_devices = [];
  $("#wired_container").append("<div id='level2'></div>");
  for ( var i = 0; i < routing_devices.length; i++ ) {
    var n_subdevices = random(1, 10);
    for ( var j = 0; j < n_subdevices; j++ ) {
      // create a personal device
      var type = Math.random() < 0.5 ? "phone" : "laptop";
      var personal_device_level2 = new Device("Personal Device "+ (n_level1_personal_devices + j), type );
      devices.push(personal_device_level2);
      array_level2_wired_devices.push(personal_device_level2);
      // move device to level2 div container, to position them centrally in #container
      personal_device_level2.el.appendTo( $('#level2') );
      // create a connection to its routing device
      var connection = new Connection(routing_devices[i], personal_device_level2, "wired", 1 );
      connection.shape = "invisible";
      connections.push( connection );
      // 
      console.log('New Level2 device '+ j + ': ' + type + ', on Router ' + i );
    }
  }
  

  // - - - - - - - - - - - - - - - LAST - - - - - - - - - - - - - - - - - 

  // Do stuff to all devices...
  for ( var i = 0; i < devices.length; i++ ) {
    // Hide devices names for this layout.
    devices[i].showName(false);
    // Clicking a device (except placeholder wired routers) reveals the device's settings.
    if ( devices[i].type !== "router" ) {
      devices[i].el.click((function(clickedDevice) { return function() { clickedDevice.showDetails(true); } })(devices[i]));
    }
  }

}

// 
function populateDevicesCollapsedNodes() {
  resetLayouts();

  devices.push(new Device("Network Box", "networkbox"));  // devices[0] is always the network box
  routing_devices.push(devices[0]);
  devices[0].mass = 100;

  var random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine"];
  var random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room"]
  var n_personal_devices = Math.round(Math.random() * 8 + 2);
  var n_tv_devices = Math.round(Math.random() * 3);
  var n_routers = random(1,4);

  // Create a few routers
  for(var i=0; i<n_routers; i++) {
    var is_TV = Math.random() < 0.5;
    var room = random_rooms[random(0,random_rooms.length)];
    if(!is_TV) {
      var router = new Device(room + " Router", "router");
      router.expanded = false;  // Start off closed
      router.el.parent = router;
      console.log(router.el);
      // Closures are weird. A function that returns a function is needed to make sure the context of router is correct
      router.el.click((function(dev) { return function() { dev.toggleCollapsed(); layoutDevices('tree'); } })(router));
      //router.el.click(function() { router.toggleCollapsed() });

      devices.push(router);
      routing_devices.push(router);

      // Connect to an existing router or the Network box
      var parent = Math.random() < 0.5 ? devices[0] : routing_devices[random(0,routing_devices.length)];
      connections.push(new Connection(parent, router, "wired", 1));

    }
    else {
      var box_device = new Device(room + " TV Box", "tvbox");
      var tv_device = new Device(room + " TV", "tv");

      box_device.expanded = false;  // Start off closed

      // Same as above. Closures are weird.
      box_device.el.click((function(dev) { return function() { 
        // dev_jc_19/09/2013_c : if opening this node, close other open nodes first
        if ( dev.expanded === false ) {
          $.each(routing_devices, function(index, other_dev) {
            if ( other_dev.expanded === true && other_dev.name !== "Network Box" ) {
              other_dev.expanded = false;
              other_dev.update();
            }
          });
        }

        // open this
        dev.toggleCollapsed(); 
        layoutDevices('tree'); 

      } })(box_device));

      devices.push(box_device);
      routing_devices.push(box_device);
      devices.push(tv_device);

      // Connect TVs to TV Box
      connections.push(new Connection(box_device, tv_device, "wired", 1));

      // Connect TV Box to Network Box
      connections.push(new Connection(devices[0], box_device, "wired", 1));
    }
  }

  // Create personal devices (phones, laptops, etc)
  for(var i=0; i<n_personal_devices; i++) {
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var propertype = type.charAt(0).toUpperCase() + type.slice(1);

    var unique_name = false;
    var name = ""; 
    while(!unique_name) {
      name = random_names[Math.round(Math.random() * (random_names.length-1))] + "'s " + propertype;
      // Check all devices to see if this name is taken
      var taken = false;
      for(var j=0; j<devices.length; j++) {
        if(devices[j].name == name) taken = true;
      }
      if(!taken) unique_name = true;
    }
    
    var dev = new Device(name, type);
    devices.push(dev);
    personal_devices.push(dev);
  }

  // Connect each device to a router
  $.each(personal_devices, function(index, device) {
    //var router = Math.random() < 0.8 ? devices[0] : routing_devices[random(0, routing_devices.length)]; // Favor network box
    var router = routing_devices[random(0, routing_devices.length)];

    var type = Math.random() < 0.5 ? "wired" : "wireless";
    connections.push(new Connection(router, device, type, 1));  
  });

  // Expand routers with only 1 device
  $.each(routing_devices, function(index, device) {
    device.update();
    if(device.n_children <= 1) device.expanded = true;
  });
}

function populateDevicesDefault() {
  resetLayouts();

  // Create 1 Network Box
  devices.push(new Device("Network Box", "networkbox"));  // devices[0] is always the network box
  routing_devices.push(devices[0]);
  devices[0].mass = 100;
  
  // Setup children devices of the Network Box. Total maximum of Network Box devices is 4, minimum is 2.
  var random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine"];
  var random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room"];
  // maximum 2 TV boxes (each with a TV)
  var n_tv_devices = Math.round(Math.random() * max_tv_devices);
  // number of minimum & maximum personal devices depends on amount of TV Boxes
  if ( n_tv_devices === 0 ) var n_personal_devices_network_box = Math.round(random(2, 5));
  if ( n_tv_devices === 1 ) var n_personal_devices_network_box = Math.round(random(1, 4));
  if ( n_tv_devices === 2 ) var n_personal_devices_network_box = Math.round(random(1, 3));
  // var n_personal_devices_network_box = Math.round(random( (2 - n_tv_devices) , (5 - n_tv_devices) ));      //OLD
  console.log('A------ ' + n_tv_devices);
  console.log('B------ ' + n_personal_devices_network_box);
  console.log('C------ ' + (n_tv_devices + n_personal_devices_network_box));     // total should never be more than 4
  
  // Create TV Boxes with their TVs for Network Box.
  for ( var i = 0; i < n_tv_devices; i++ ) {
    var room = random_rooms[Math.round(Math.random() * (random_rooms.length-1))];
    var box_device = new Device(room + " TV Box", "tvbox");
    var tv_device = new Device(room + " TV", "tv");
    devices.push(box_device);
    routing_devices.push(box_device);
    devices.push(tv_device);

    // Connect TVs to TV Box
    connections.push(new Connection(box_device, tv_device, "wired", 1));

    // Connect TV Box to Network Box
    // if we have 2 TV Boxes, add the second one after all personal devices, to the right completely.
    if ( i === 1 ) {
      console.log('--------HELLO 1')
      bool_add_last = true;
    } else {
      bool_add_last = false;
      console.log('--------HELLO 0')
      connections.push(new Connection(devices[0], box_device, "wired", 1));
    }

    // For each TV Box, create Personal Devices
    var n_personal_devices_tv_box = Math.round(random(0, 3));      // range is 0 to 2
    console.log('D------ ' + n_personal_devices_tv_box);
    for ( var j = 0; j < n_personal_devices_tv_box; j++ ) {
      var device_type = Math.random() < 0.5 ? "phone" : "laptop";
      var propertype = device_type.charAt(0).toUpperCase() + device_type.slice(1);
      //  give the device a unique name
      var unique_name = false;
      var name = ""; 
      while(!unique_name) {
        name = random_names[Math.round(Math.random() * (random_names.length-1))] + "'s " + propertype;
        // Check all devices to see if this name is taken
        var taken = false;
        for(var w=0; w<devices.length; w++) {
          if(devices[w].name == name) taken = true;
        }
        if(!taken) unique_name = true;
      }
      // create the device
      var personal_device = new Device(name, device_type);
      devices.push(personal_device);
      personal_devices.push(personal_device);
      // choose which connection type to make this device
      var connection_type = Math.random() < 0.5 ? "wired" : "wireless";
      // Connect Personal Device to TV Box.
      connections.push(new Connection(box_device, personal_device, connection_type, 1));
    }
  }
  
  // Create Personal Devices for Network Box.
  for ( var i = 0; i < n_personal_devices_network_box; i++ ) {
    var device_type = Math.random() < 0.5 ? "phone" : "laptop";
    var propertype = device_type.charAt(0).toUpperCase() + device_type.slice(1);
    //  give the device a unique name
    var unique_name = false;
    var name = ""; 
    while(!unique_name) {
      name = random_names[Math.round(Math.random() * (random_names.length-1))] + "'s " + propertype;
      // Check all devices to see if this name is taken
      var taken = false;
      for(var j=0; j<devices.length; j++) {
        if(devices[j].name == name) taken = true;
      }
      if(!taken) unique_name = true;
    }
    // create the device
    var personal_device = new Device(name, device_type);
    devices.push(personal_device);
    personal_devices.push(personal_device);
    // choose which connection type to make this device
    var connection_type = Math.random() < 0.5 ? "wired" : "wireless";
    // Connect Personal Device to Network Box.
    connections.push(new Connection(devices[0], personal_device, connection_type, 1));
  }
  

  if (bool_add_last === true) {
    console.log('--------HELLO 2')
    connections.push(new Connection(devices[0], box_device, "wired", 1));
  }
}
// 
function populateDevicesDragAndDrop() {
  resetLayouts();

  $("#controller").show();

  devices.push(new Device("Network Box", "networkbox"));  // devices[0] is always the network box
  routing_devices.push(devices[0]);
  devices[0].mass = 100;

  var random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah"];
  var random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs"]
  var n_personal_devices = Math.round(Math.random() * 8 + 2);
  var n_tv_devices = Math.round(Math.random() * 3);

  // Create personal devices (phones, laptops, etc)
  for(var i=0; i<n_personal_devices; i++) {
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var propertype = type.charAt(0).toUpperCase() + type.slice(1);

    var unique_name = false;
    var name = ""; 
    while(!unique_name) {
      name = random_names[Math.round(Math.random() * (random_names.length-1))] + "'s " + propertype;
      // Check all devices to see if this name is taken
      var taken = false;
      for(var j=0; j<devices.length; j++) {
        if(devices[j].name == name) taken = true;
      }
      if(!taken) unique_name = true;
    }
    
    var dev = new Device(name, type);
    devices.push(dev);
    personal_devices.push(dev);
  }

  // Create TV devices which always come in a pairs with a TV box
  for(var i=0; i<n_tv_devices; i++) {
    var room = random_rooms[Math.round(Math.random() * (random_rooms.length-1))];
    var box_device = new Device(room + " TV Box", "tvbox");
    var tv_device = new Device(room + " TV", "tv");
    devices.push(box_device);
    routing_devices.push(box_device);
    devices.push(tv_device);

    // Connect TVs to TV Box
    connections.push(new Connection(box_device, tv_device, "wired", 1));

    // Connect TV Box to Network Box
    connections.push(new Connection(devices[0], box_device, "wired", 1));
  }


  // Connect each device to a router
  $.each(personal_devices, function(index, device) {
    var router = Math.random() < 0.8 ? devices[0] : routing_devices[random(0, routing_devices.length)]; // Favor network box

    var type = Math.random() < 0.5 ? "wired" : "wireless";
    connections.push(new Connection(router, device, type, 1));  
  });

  // Assign drop event handler for each device
  // dev_jc_19/09/2013_c : make only personal device icons customizable by drag-n-dropping new icons over them.
  // $.each(devices, function(index, device) {
  $.each(personal_devices, function(index, device) {
    device.el.mouseup((function(dev) { return function() {
      // DROPPED
      if(dragging != null) {
        if($(dragging).hasClass("device"))
          dev.changeType($(dragging).data("type")); 
        else if($(dragging).hasClass("ip")) {
          dev.ip = $(dragging).text();
          dev.static_ip = true;
          dev.toggleStatus();

          //$(dragging).appendTo(dev.el.find(".ip_slot"));
          $(dragging).remove();
        }
        dev.highlight(false);
      }
    } })(device));

    device.el.mouseenter((function(dev) { return function(ev) {
      if(dragging != null) {
        dev.highlight(true);  
      }
    } })(device));
    device.el.mouseleave((function(dev) { return function(ev) {
      if(dragging != null) {
        dev.highlight(false); 
      }
    } })(device));
    

    device.el.find(".icon").click((function(dev) { return function(ev) {
      dev.toggleStatus();
      return true;
    }})(device));
    
  });
  // Clear dragging when mouseup anywhere else
  $(document).mouseup(function() {
    $(dragging).removeAttr("style");
    $(dragging).removeClass("dragging");

    dragging = null;
    //return false;
  });

  // Assign drag handlers for icon palette items
  $.each($("#icon_palette > .device"), function(item, el) {
    $(el).mousedown(function() {
      dragging = this;
      return false;
    });   

  });

  // Assign drag handlers for static IP address items
  $.each($("#ip_palette > .ip"), function(item, el) {
    $(el).mousedown(function() {
      dragging = this;
      return false;
    });   

  });

  $(document).mousemove(function(ev) {
    if(!dragging) return true;
    else {
      var w = $(dragging).width();
      var h = $(dragging).height();
      $(dragging).offset({left: ev.pageX-w/2, top: ev.pageY-h/2});
      $(dragging).addClass("dragging");
    }
    return true;
  });

  setConnectorStyle("90s");
}
// Sam's original function
function populateDevicesOriginal() {

  // Clear out old lists. TODO: Make sure circular references are broken, too
  $.each(devices, function(index, device) {
    device.die();
  });

  $.each(connections, function(index, connection) {
      connection.die();
  });

  devices.length = 0;
  personal_devices.length = 0;
  routing_devices.length = 0;
  connections.length = 0;

  devices.push(new Device("Network Box", "networkbox"));  // devices[0] is always the network box
  routing_devices.push(devices[0]);
  devices[0].mass = 100;

  var random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine"];
  var random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room"];
  var n_personal_devices = Math.round(Math.random() * 8 + 2);
  var n_tv_devices = Math.round(Math.random() * 3);

  // Create personal devices (phones, laptops, etc)
  for(var i=0; i<n_personal_devices; i++) {
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var propertype = type.charAt(0).toUpperCase() + type.slice(1);

    var unique_name = false;
    var name = ""; 
    while(!unique_name) {
      name = random_names[Math.round(Math.random() * (random_names.length-1))] + "'s " + propertype;
      // Check all devices to see if this name is taken
      var taken = false;
      for(var j=0; j<devices.length; j++) {
        if(devices[j].name == name) taken = true;
      }
      if(!taken) unique_name = true;
    }

    var dev = new Device(name, type);
    devices.push(dev);
    personal_devices.push(dev);
  }

  // Create TV devices which always come in a pairs with a TV box
  for(var i=0; i<n_tv_devices; i++) {
    var room = random_rooms[Math.round(Math.random() * (random_rooms.length-1))];
    var box_device = new Device(room + " TV Box", "tvbox");
    var tv_device = new Device(room + " TV", "tv");
    devices.push(box_device);
    routing_devices.push(box_device);
    devices.push(tv_device);

    // Connect TVs to TV Box
    connections.push(new Connection(box_device, tv_device, "wired", 1));

    // Connect TV Box to Network Box
    connections.push(new Connection(devices[0], box_device, "wired", 1));
  }


  // Connect each device to a router
  $.each(personal_devices, function(index, device) {
    var router = Math.random() < 0.8 ? devices[0] : routing_devices[random(0, routing_devices.length)]; // Favor network box

    var type = Math.random() < 0.5 ? "wired" : "wireless";
    connections.push(new Connection(router, device, type, 1));  
  });
}