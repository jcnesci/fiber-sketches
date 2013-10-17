var devices = [];                       // All devices
var personal_devices = [];              // Computers/laptops and mobile devices
var routing_devices = [];               // Network boxes, tv boxes, or other routers/switches
var array_wireless_devices = [];
var array_level1_wired_devices = [];    // push devices in this storage array ; will be useful to collapse them all with one function
var connections = [];
var max_tv_devices = 2;
var bool_add_last = false;
// Drag-and-drop specific stuff
var dragging = null; // item that is being dragged
var hovering = null; // item currently hovering over

// for network complexities
var n_tv_boxes;
var n_wireless_devices;
var n_wired_devices;

var a_random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine", "Mom", "Dad", "Steve", "Kengo", "Kumar"];
var a_random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room", "Den", "Library", "Man Cave", "Garage", "Gameroom"];

$(document).ready(function() {
  $("#svg_container").svg();  // Initialize the SVG canvas
  $("#controller").hide();    // Hide the Controller div for the Drag-and-Drop feature
  
  // set network complexity
  setNetworkComplexity( "high" );

  // create and display network
  // DEV - TEMPORARY - - - - - - - - - - - - - - - - - - - - - - - - 
  populateDevicesGrid();
  layoutDevices("grid");
  // populateDevicesOrbital();
  // layoutDevices("orbital");
  
  // populateDevicesDefault();
  // layoutDevices("tree");

  // Not necessary for now: display which connector style is currently displayed in button
  // var button_label = 'Toggle Connector Style (' + ((current_connection_style % Connection.shapes.length)+1) + '/' + Connection.shapes.length +')';
  // $('li #toggle-button').text(button_label);

});

// Choose one of three prototypical networks, based on Google's specifications.
function setNetworkComplexity( cur_network_complexity ) {
  switch( cur_network_complexity ) {
    case "low": 
      n_tv_boxes = 1;
      n_wireless_devices = 1;
      n_wired_devices = 0;
      break;
    case "average": 
      n_tv_boxes = 2;
      n_wireless_devices = 4;
      n_wired_devices = 1;
      break;
    case "high":
      n_tv_boxes = 6;
      n_wireless_devices = 10;
      n_wired_devices = 5;
      break;
  }
}

// For 2 Zone layout for Wireless and Wired devices, featuring a 4-column grid.
function populateDevicesGrid() {
  // console.log('- - - - - - - - - - -');
  // console.log('populateDevicesGrid() ENTER');
  // console.log('- - - - - - - - - - -');

  // - - - - - - - - - - - - - - - SETUP - - - - - - - - - - - - - - - - - 

  resetLayouts();
  $('#container_background').show();
  var n_columns = 4;
  var a_random_names_grid = a_random_names;
  var a_random_rooms_grid = a_random_rooms;

  // - - - - - - - - - - - - - - - NETWORK BOX - - - - - - - - - - - - - - - - - 

  // Create the main Network Box
  $("#container").append("<div id='wired_container'></div>");
  var network_box = new Device("Network Box", "networkbox");
  devices.push(network_box);  // devices[0] is always the network box
  network_box.el.appendTo( $("#wired_container") );
  // TODO: make Net Box icon bigger.

  // - - - - - - - - - - - - - - - WIRELESS DEVICES - - - - - - - - - - - - - - - - - 

  // Wireless devices
  
  // var n_wireless_devices = random(1, 10);
  $("#container").append("<div id='wireless_container'></div>");
  for ( var i = 0; i < n_wireless_devices; i++ ) {
    // place items in rows, each row of the grid contains up to the number of columns. Useful for positioning the last row horizontally in the center.
    if ( i % n_columns === 0 ) {
      var cur_row = $("<div class='wireless_grid_row'></div>");
      cur_row.appendTo( $('#wireless_container') );
    }

    // create a wireless device
    var type = Math.random() < 0.5 ? "phone" : "laptop";
    var name = a_random_names_grid.splice( random(0, a_random_names_grid.length), 1 ) + "'s " + type.charAt(0).toUpperCase() + type.slice(1);
    var wireless_device = new Device(name, type );
    wireless_device.is_wireless = true;   // add custom attribute for layout positioning
    devices.push(wireless_device);
    array_wireless_devices.push(wireless_device);
    
    wireless_device.el.appendTo( cur_row );
    // wireless_device.el.appendTo( $('#wireless_container') );
    
    // connections
    var connection = new Connection(devices[0], wireless_device, "wireless", 1 );
    connection.shape = "invisible";
    connections.push( connection );
    // dev
    // console.log(' WIRELESS --------');
    // console.log(wireless_device);
  }
  $("#container").append("<div id='wireless_icon'></div>");
  
  // - - - - - - - - - - - - - - - WIRED DEVICES - - - - - - - - - - - - - - - - - 

  // WIRED - TV Boxes and TVs
  if (n_tv_boxes > 3) {
    // we need to place surplus TV Boxes in level 2
    var n_tv_boxes_level1 = 3;
    var n_tv_boxes_level2 = n_tv_boxes - 3;
  } else {
    var n_tv_boxes_level1 = n_tv_boxes;
    var n_tv_boxes_level2 = 0;
  }
  var n_remaining_slots_level1 = 4 - n_tv_boxes_level1;
  // Create Level1 TV Boxes
  for ( var i = 0; i < n_tv_boxes_level1; i++ ) {
    var name = a_random_rooms_grid.splice( random(0, a_random_rooms_grid.length), 1 ) + " TV Box";
    var box_device = new Device(name, "tvbox");
    var tv_device = new Device("TV", "tv");
    devices.push(box_device);
    routing_devices.push(box_device);
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
      
      // open this clicked node
      dev.expandSubnodes(); 
      layoutDevices('grid');
    } })(box_device));
  } 
  
  // WIRED - Personal Devices and Routers
  // Create remaining Level 1 devices and their Level2 children, if any.
  var array_level2_wired_devices = [];
  $("#wired_container").append("<div id='level2'></div>");
  var n_personal_devices = 0;

  //  if there are more devices than empty slots on Level1...
  if ( n_wired_devices > n_remaining_slots_level1 ) {
    console.log("t- WIRED - Personal devices --------------- MORE THAN slots : "+ n_wired_devices);

    // need routers
    var n_cur_wired = 0;
    var n_so_far = 0;

    for (var i = 0; i < n_remaining_slots_level1; i++) {

      // Determine how many devices go in each slot.
      if (i != n_remaining_slots_level1-1) {
        n_cur_wired = Math.floor( n_wired_devices / n_remaining_slots_level1 );
      } else {
        n_cur_wired = n_wired_devices - n_so_far;
      }
      n_so_far += n_cur_wired;

      console.log("----- i = "+ i);
      console.log("n_cur_wired = "+ n_cur_wired);
      console.log("n_so_far = "+ n_so_far);

      // If this slot has more than 1 device, create a router then connect those devices to it.
      if ( n_cur_wired > 1 ) {
        var is_last_row = false;
        var routing_device = new Device("Router", "router");
        devices.push(routing_device);
        routing_devices.push(routing_device);
        array_level1_wired_devices.push(routing_device);
        routing_device.el.appendTo( $('#wired_container') );
        routing_device.expanded = false;  // Start off closed
        routing_device.el.click((function(dev) { return function() {
          // open this clicked node
          dev.expandSubnodes(); 
          layoutDevices('grid');
        } })(routing_device));
        
        // LEVEL 2 personal devices
        for ( var j = 0; j < n_cur_wired; j++ ) {
          // place items in rows, each row of the grid contains up to the number of columns. Useful for positioning the last row horizontally in the center.
          if ( j % n_columns === 0 ) {
            var cur_row = $("<div class='wired_grid_row'></div>");
            cur_row.appendTo( $('#level2') );                             // move device to level2 div container, to position them centrally in #container
            // if this is the last row, set bool to true
            if ( j + n_columns >= n_cur_wired ) is_last_row = true;
          }
          // create a personal device
          n_personal_devices++;   //unused : for sequentially numbering devices correctly below...
          var type = Math.random() < 0.5 ? "storage" : "laptop";
          if (type === "laptop") var name = a_random_names_grid.splice( random(0, a_random_names_grid.length), 1 ) + "'s " + type.charAt(0).toUpperCase() + type.slice(1);
          if (type === "storage") var name = a_random_rooms_grid.splice( random(0, a_random_rooms_grid.length), 1 ) + " " + type.charAt(0).toUpperCase() + type.slice(1);
          var personal_device_level2 = new Device(name, type );
          devices.push(personal_device_level2);
          array_level2_wired_devices.push(personal_device_level2);
          personal_device_level2.el.appendTo( cur_row );
          // create a connection to its routing device
          var connection = new Connection(routing_device, personal_device_level2, "wired", 1 );
          // if this is the last row, use a special type of connector: 90s_level2
          if (is_last_row) { 
            connection.shape = "90s_level2"; 
          } else {
            connection.shape = "90s"; 
          }
          connections.push( connection );
          // 
          console.log("************** j = "+ j);
          console.log(personal_device_level2);
          console.log(array_level2_wired_devices);
          console.log('New Level2 device '+ j + ': ' + type + ', on Router ' + i );
        }
        // LEVEL 2 extra tv boxes : if we have more than 3 tv boxes, place remanining ones under the last router.
        if ( n_tv_boxes_level2 > 0 ) {
          for ( var w = 0; w < n_tv_boxes_level2; w++ ) {
            var name = a_random_rooms_grid.splice( random(0, a_random_rooms_grid.length), 1 ) + " TV Box";
            var box_device = new Device(name, "tvbox");
            devices.push(box_device);
            routing_devices.push(box_device);
            array_level2_wired_devices.push(box_device);
            box_device.el.appendTo( cur_row );
            // In advance, connect TV to TV Box (but it wont display until TV Box is connected to Network Box).
            var connectionTVBox = new Connection(routing_device, box_device, "wired", 1 );
            // if this is the last row, use a special type of connector: 90s_level2
            if (is_last_row) { 
              connectionTVBox.shape = "90s_level2"; 
            } else {
              connectionTVBox.shape = "90s"; 
            }
            connections.push( connectionTVBox );
          }
        }
      } 
      // If only 1 device for this Level1 slot, make it a personal device, not a router.
      else {
        var type = Math.random() < 0.5 ? "storage" : "laptop";
        if (type === "laptop") var name = a_random_names_grid.splice( random(0, a_random_names_grid.length), 1 ) + "'s " + type.charAt(0).toUpperCase() + type.slice(1);
        if (type === "storage") var name = a_random_rooms_grid.splice( random(0, a_random_rooms_grid.length), 1 ) + " " + type.charAt(0).toUpperCase() + type.slice(1); 
        var wired_device_level1 = new Device(name, type);
        devices.push(wired_device_level1);
        array_level1_wired_devices.push(wired_device_level1);
        wired_device_level1.el.appendTo( $('#wired_container') );
      }
    }
  //  else, there are enough open slots for our devices in Level1...
  } else {
    // add wired devices to Level1 directly...
    console.log("t- WIRED - Personal devices ----- LESS THAN or EQUAL to slots.");

    for ( var i = 0; i < n_wired_devices; i++ ) {
      var type = Math.random() < 0.5 ? "storage" : "laptop";
      if (type === "laptop") var name = a_random_names_grid.splice( random(0, a_random_names_grid.length), 1 ) + "'s " + type.charAt(0).toUpperCase() + type.slice(1);
      if (type === "storage") var name = a_random_rooms_grid.splice( random(0, a_random_rooms_grid.length), 1 ) + " " + type.charAt(0).toUpperCase() + type.slice(1);
      var wired_device_level1 = new Device(name, type);
      devices.push(wired_device_level1);
      array_level1_wired_devices.push(wired_device_level1);
      wired_device_level1.el.appendTo( $('#wired_container') );

    }
  }

  // Create connections for each Level1 device to Network Box.
  for ( var i = 0; i < array_level1_wired_devices.length; i++ ) {
    var connection = new Connection(devices[0], array_level1_wired_devices[i], "wired", 1);
    connection.shape = "90s";
    connections.push(connection);
  }

  // - - - - - - - - - - - - - - - LAST - - - - - - - - - - - - - - - - - 

  // Do stuff to all devices...
  for ( var i = 0; i < devices.length; i++ ) {
    // Clicking on a device's icon display its settings panel. Stop propagation so the event doesn't go to the document.click fct in common.js which would immediately close the panel.
    if ( devices[i].type !== "router" && devices[i].type !== "tvbox"  &&  devices[i].type !== "tv" ) {
      devices[i].el.find(".icon").click((function(clickedDevice) { return function(e) { e.stopPropagation(); clickedDevice.showDetails(true); } })(devices[i]));
    }
  }

}

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
      router.el.click((function(dev) { return function() { dev.expandSubnodes(); layoutDevices('tree'); } })(router));
      //router.el.click(function() { router.expandSubnodes() });

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

      // Same as above. Closures are weird. Open/close node if clicked on.
      box_device.el.click((function(dev) { return function() { dev.expandSubnodes(); layoutDevices('tree'); } })(box_device));

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

// 
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