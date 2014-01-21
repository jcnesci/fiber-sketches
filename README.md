Fiber Prototype
=======================================


Usage Tips
---------------------------------------
Use the zoom keys on your keyboard (Ctrl or Cmd +/-) to adapt the size of the prototype to your screen size.


This prototype uses jQuery and a jQuery-SVG library to achieve various prototypical graphical network layouts.  
* *index.html* is the one and only HTML file
* *main.js* is where things begin, and populates our network depending on network type (grid, tree, physics, etc.) and complexity (low, average, high)
* *layout.js* produces the layout based on network type
* *device.js* is the object class for each device in a network and contains all its connections to other devices
* *connection.js* is the object class for connections between devices
* *common.js* contains general purpose functions for the whole thing

For Developers
---------------------------------------

Code legend:

* 'dev_option': Option to use during developement only. Unnecessary for production release.
* 'dev_' + ...: Developement markers by the developpers. Unnecessary for production release.