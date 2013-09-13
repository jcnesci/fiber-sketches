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

var current_connection_style = 1;
function toggleConnectors(indicator) {
	current_connection_style++;
	$.each(connections, function(index, conn) {
		conn.changeShape(Connection.shapes[current_connection_style % Connection.shapes.length]);
	});
}

function buildSketchList() {
	var sketches = [
		{
			name: "Layout Options",
			file: "layout-options.html"
		},
		{
			name: "Collapsed Nodes",
			file: "collapsed-nodes.html"
		},		
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
$(document).ready(buildSketchList);