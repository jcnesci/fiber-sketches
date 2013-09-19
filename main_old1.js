var devices = [];     // All devices
var personal_devices = [];  // Computers/laptops and mobile devices
var routing_devices = [];   // Network boxes, tv boxes, or other routers/switches
var connections = [];
var max_tv_devices = 2;
var max_personal_devices_per_router = 4;
// Drag-and-drop specific stuff
var dragging = null; // item that is being dragged
var hovering = null; // item currently hovering over

$(document).ready(function() {
  $("#svg_container").svg();  // Initialize the SVG canvas

  populateDevicesDefault();
  layoutDevices("tree");

});

function populateDevicesDefault() {
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

  // Create 1 Network Box
  devices.push(new Device("Network Box", "networkbox"));  // devices[0] is always the network box
  routing_devices.push(devices[0]);
  devices[0].mass = 100;

  // Setup children devices of the Network Box. Maximum is 4 children max, per router. 
  var random_names = ["Ralph", "Elena", "Rex", "Mordecai", "Betty White", "Nancy", "Jamilah", "Jim", "Judy", "Francine"];
  var random_rooms = ["Office", "Poolside", "Living Room", "Bedroom", "Upstairs", "Downstairs", "Basement", "War Room"];
  // maximum 2 TV boxes (each with a TV)
  var n_tv_devices = Math.round(Math.random() * max_tv_devices);
  if ( n_tv_devices <= 1 ) {
    // number of possible personal devices 4 max per router: 2-to-4 for Network Box, and 0-to-3 for each TV Box (max is 4-1=3 since they already have 1 TV each).
    var n_personal_devices = Math.round(random(2, max_personal_devices_per_router)) + ((Math.round(Math.random() * (max_personal_devices_per_router - 1))) * n_tv_devices);
  } else if ( n_tv_devices > 1 ) {
    // if we have 2 TV Boxes, limit its max number of children to 2 personal devices (ie. 3 total with the TV) to avoid overlap in the grid.
    var n_personal_devices = Math.ceil(Math.random() * max_personal_devices_per_router) + ((Math.round(Math.random() * (max_personal_devices_per_router - 2))) * n_tv_devices);
  }
  console.log('n_tv_devices : ' + n_tv_devices);                                  //DEV
  console.log('n_personal_devices : ' + n_personal_devices);                      //DEV

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

  // Connect each device to a router, only 4 devices can be connected directly to the Network Box.
  $.each(personal_devices, function(index, device) {
    
    // choose which type to make this device
    var type = Math.random() < 0.5 ? "wired" : "wireless";

    // choose which router to connect to
    // connect only 4 devices to the main Network Box. If it already has 4 children, choose another random router to connect to, besides Net Box.
    if ( devices[0].connections.length < max_personal_devices_per_router ) {
      var router = Math.random() < 0.8 ? devices[0] : routing_devices[random(0, routing_devices.length)]; // Favor network box
    } else {
      var router = routing_devices[random(1, routing_devices.length)];
    }
    
    connections.push(new Connection(router, device, type, 1));  

    // 
    console.log('routing_devices: ');                                                               //DEV
    console.log(routing_devices);                                                                   //DEV
    console.log('connections.length: '+ devices[0].connections.length);                             //DEV
    console.log('n_children: '+ devices[0].n_children);                                             //DEV

  });
}

function populateDevicesCollapsedNodes() {
  // Break references of old devices
  $.each(devices, function(index, device) {
    device.die();
  });

  $.each(connections, function(index, connection) {
    connection.die();
  });

  // Clear lists
  devices.length = 0;
  personal_devices.length = 0;
  routing_devices.length = 0;
  connections.length = 0;

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
      box_device.el.click((function(dev) { return function() { dev.toggleCollapsed(); layoutDevices('tree'); } })(box_device));

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

function populateDevicesDragAndDrop() {
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
  $.each(devices, function(index, device) {
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