Fiber Prototype
=======================================

This prototype uses jQuery and a jQuery-SVG library to achieve various prototypical graphical network layouts.  
* *index.html* is the one and only HTML file
* *main.js* is where things begin, and populates our network depending on network type (accordion+grid, grid, tree, physics, etc.) and complexity (low, average, high)
* *layout.js* produces the layout based on network type
* *device.js* is the object class for each device in a network and contains all its connections to other devices
* *connection.js* is the object class for connections between devices
* *common.js* contains general purpose functions for the entire prototype

Usage Tips
---------------------------------------
* This prototype was originally designed for large screens. Use your browser's zoom keys (Ctrl or Cmd +/-) to adapt the size of the prototype to your screen size.

Notes
---------------------------------------
* This repository is only a copy of the final state of the development repository, found here: https://github.com/jcnesci/fiber-sketches