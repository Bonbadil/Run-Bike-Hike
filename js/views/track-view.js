var TrackView = function() {

  var SCREEN_WIDTH = parseInt(window.innerWidth * 0.9,10);
  var SCREEN_HEIGHT = parseInt(SCREEN_WIDTH * 2 / 3,10);
  // console.log("width", SCREEN_WIDTH);
  // console.log("height", SCREEN_HEIGHT);
  var xPadding = 30;
  var yPadding = 30;

  var SPACE_BTW_POINTS = 5;
  var LINE_WIDTH = 1;
  var VALUE_COLOR = "#0560A6";
  var ACCURACY_COLOR = "#FF9200";

  function display(inTrack) {
    //reset old ressources
    document.getElementById("trk-date").innerHTML = "";
    document.getElementById("trk-dist").innerHTML = "";
    document.getElementById("trk-dur").innerHTML = "";
    document.getElementById("map-img").src = "";

    var tr = document.getElementById("tr-name");
    tr.innerHTML = inTrack.name;
    console.log("show track: ", inTrack);

    document.getElementById("trk-date").innerHTML = Config.userDate(inTrack.date);
    document.getElementById("trk-dist").innerHTML = Config.userDistance(inTrack.distance);
    var d = inTrack.duration / 60000;
    document.getElementById("trk-dur").innerHTML = d.toFixed() +" min";
    
    var t = inTrack;
    t.min_alt = null;
    t.max_alt = null;
    t.max_speed = null;
    t.start = null;
    t.end = null;

    //~ get min, max altitude, max speed, start and end time
    for (i=0; i<inTrack.data.length; i++) {
      var row = inTrack.data[i];
      // console.log("row.altitude ", row.altitude);
      // console.log("t.max_alt ", t.max_alt);
      if (t.min_alt === null || row.altitude < t.min_alt) {
        t.min_alt = row.altitude;
      }
      if (t.max_alt === null || row.altitude > t.max_alt) {
        t.max_alt = row.altitude;
      }
      if (t.max_speed === null || row.velocity > t.max_speed) {
        t.max_speed = row.velocity;
      }
      var dt = new Date(inTrack.data[i].date).getTime();
      // console.log("dt ", dt);
      if (t.start === null || dt < t.start) {
        t.start = dt;
      }
      if (t.end === null || dt > t.end) {
        t.end = dt;
      }
    }
    // console.log("t.start", t.start);
    // console.log("t.end", t.end);
    __buildAltitudeGraph(t);
    __buildSpeedGraph(t);
    __buildMap2(inTrack);
  }

  function __buildAltitudeGraph(inData) {
    data = inData.data;
    console.log("data.length", data.length);
    console.log("data", data);

    // calculate the axis values in order to draw the canvas graph
    // max_y: represents the highest altitude value
    // min_y: represents the smallest altitude value
    // max_acc: represents the poorest accuracy on altitude
    var max_acc = 0;
    var max_y = 0;
    var min_y = 0;
    for(i=0;i<data.length;i++) {
      if(parseInt(data[i].altitude, 10) > max_y) {
        max_y = parseInt(data[i].altitude, 10);
      }
      if(parseInt(data[i].altitude, 10) < min_y) {
        min_y = parseInt(data[i].altitude, 10);
      }
      if(parseInt(data[i].vertAccuracy, 10) > max_acc) {
        max_acc = parseInt(data[i].vertAccuracy, 10);
      }
      // console.log("data[i].vertAccuracy", data[i].vertAccuracy);
      max_acc = max_acc / 2;
    }
    // console.log("max_y", max_y);
    // console.log("min_y",min_y);
    // console.log("max_acc",max_acc);
    
    // create a rectangular canvas with width and height depending on screen size
    // var graph = document.getElementById("alt-canvas");
    // var c = graph.getContext("2d");
    // c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // graph.setAttribute("width",SCREEN_WIDTH);
    // graph.setAttribute("height",SCREEN_HEIGHT);
    
    // Write Y Axis text
    // c.textAlign = "right";
    // c.textBaseline = "middle";
    // calculate Y axis size
    var range = max_y - min_y;
    range = range + (range / 3);
    // calculate
    var yspace = parseInt(range / 4, 10);
    console.log("range", range);
    console.log("yspace",yspace);
    // var j = 0;
    // var i = 0;
    // for (t=0;t<4;t++) {
    //   c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, range));
    //   c.beginPath();
    //   //~ c.lineWidth = 1;
    //   c.moveTo(xPadding, __getYPixel(j, range));
    //   c.lineTo(SCREEN_WIDTH, __getYPixel(j, range));
    //   c.stroke();
    //   j += yspace;
    //   i += yspace;
    // }
    var c = __createRectCanvas("alt-canvas", range, yspace);
    
    var espace = parseInt(data.length / (SCREEN_WIDTH - xPadding), 10);
    espace = espace * SPACE_BTW_POINTS; // increase spacing between points so that the chart looks smoother.
    console.log("espace", espace);
    // Draw vertAccuracy lines
    c.strokeStyle = ACCURACY_COLOR;
    c.lineWidth = LINE_WIDTH;
    c.beginPath();
    //~ var z = parseInt(getXPixel(data[0].altitude) - parseInt(data[0].vertAccuracy));
    var alt0 = parseInt(data[0].altitude, 10);
    var acc0 = parseInt(data[0].vertAccuracy, 10);
    var y1 = alt0 - acc0;
    var y2 = alt0 + acc0;
    if(y1<0) {y1=0;} // we don't want the lines to go under 0
    console.log("alt: "+ alt0 +" - acc: "+ acc0);
    console.log("y1: "+y1+" - y2: "+y2);
    c.moveTo(__getXPixel(0,data), __getYPixel(y1, range));
    c.lineTo(__getXPixel(0,data), __getYPixel(y2, range));
    for(i=1;i<data.length;i+=espace) {
      var alti = parseInt(data[i].altitude, 10);
      var acci = parseInt(data[i].vertAccuracy, 10);
      y1 = alti - acci;
      y2 = alti + acci;
      if(y1<0) {y1=0;} // we don't want the lines to go under 0
      c.moveTo(__getXPixel(i,data), __getYPixel(y1, range));
      c.lineTo(__getXPixel(i,data), __getYPixel(y2, range));
      c.stroke();
    }
    
    // Draw Altitude points
    c.strokeStyle = VALUE_COLOR;
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].altitude, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].altitude, range));
      //~ c.arc(getXPixel(i,data), getYPixel(data[i].altitude, range),1,0,1);
      c.stroke();
      //~ console.log("i: " + i + " - x: " + getXPixel(i, data) + " / y: " + getYPixel(data[i].altitude, range));
    }

    c.lineWidth = 1;
    c.strokeStyle = "#333";
    c.font = "italic 6pt sans-serif";
    c.textAlign = "center";
    
    // Draw X and Y Axis
    // c.beginPath();
    // c.moveTo(xPadding, 0);
    // c.lineTo(xPadding, SCREEN_HEIGHT - yPadding);
    // c.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT - yPadding);
    // c.stroke();
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.fillText(date, __getXPixel(i,data), SCREEN_HEIGHT - yPadding + 20);
      c.beginPath();
      c.strokeStyle  = "rgba(150,150,150, 0.5)";
      c.lineWidth = 1;
      c.moveTo(__getXPixel(i,data),0);
      c.lineTo(__getXPixel(i,data),SCREEN_HEIGHT - xPadding);
      c.stroke();
    }

    c.stroke();
    c.closePath();
  }

  function __buildSpeedGraph(data) {
    data = data.data;
    //~ console.log("data.length",data.length);
    //~ console.log("data",data);
    var max_acc = 0;
    var max_y = 0;
    var min_y = 0;
    for(i=0;i<data.length;i++) {
      if(parseInt(data[i].speed, 10) > max_y) {
        max_y = parseInt(data[i].speed, 10);
      }
      if(parseInt(data[i].speed, 10) < min_y) {
        min_y = parseInt(data[i].speed, 10);
      }
      //~ if(data[i].vertAccuracy > max_acc) {
        //~ var max_acc = data[i].vertAccuracy;
      //~ }
      //~ max_acc = max_acc / 2;
    }
    //~ console.log("max_y", max_y);
    //~ console.log("min_y",min_y);
    //~ console.log("max_acc",max_acc);
    
    // var graph = document.getElementById("speed-canvas");
    // var c = graph.getContext("2d");
    // c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    // graph.setAttribute("width",SCREEN_WIDTH);
    // graph.setAttribute("height",SCREEN_HEIGHT);
    
    // Write Y Axis text
    // c.textAlign = "right";
    // c.textBaseline = "middle";
    //~ max_v_acc = 30; // we need to take the vertical accuracy as an input
    var range = max_y - min_y;
    var yspace = parseInt(range / 4, 10);
    //~ console.log("range", (max_y+max_acc) - (min_y-max_acc));
    //~ console.log("yspace",yspace);
    // var j = 0;
    // var i = 0;
    // for (t=0;t<4;t++) {
    //   c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, range));
    //   c.beginPath();
      //~ c.lineWidth = 1;
      // c.moveTo(xPadding, __getYPixel(j, range));
      // c.lineTo(SCREEN_WIDTH, __getYPixel(j, range));
      // c.stroke();
      // j += yspace;
      // i += yspace;
    // }
    var c = __createRectCanvas("speed-canvas", range, yspace);
    
    var espace = parseInt(data.length / (SCREEN_WIDTH - xPadding), 10);
    espace = espace * 5; // increase spacing between points so that the chart looks smoother.
    // Draw line
    c.strokeStyle = "#0560A6";
    c.lineWidth = 1;
    c.beginPath();
    c.moveTo(__getXPixel(0,data), __getYPixel(data[0].speed, range));
    for(i=1;i<data.length;i+=espace) {
      c.lineTo(__getXPixel(i,data), __getYPixel(data[i].speed, range));
      //~ c.arc(getXPixel(i,data), getYPixel(data[i].speed, range),1,0,1);
      c.stroke();
      //~ console.log("i: " + i + " - x: " + getXPixel(i, data) + " / y: " + getYPixel(data[i].altitude, range));
    }

    c.lineWidth = 1;
    c.strokeStyle = "#333";
    c.font = "italic 6pt sans-serif";
    c.textAlign = "center";
    
    // Draw X and Y Axis
    // c.beginPath();
    // c.moveTo(xPadding, 0);
    // c.lineTo(xPadding, SCREEN_HEIGHT - yPadding);
    // c.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT - yPadding);
    // c.stroke();
    
    // Write X Axis text and lines
    var xspace = data.length / 5;
    //~ console.log("xspace",xspace);
    for (i=0;i<data.length;i+=xspace) {
      i = parseInt(i,10);
      //~ console.log("i",i);
      var date = new Date(data[i].date).getHours() + ":" + new Date(data[i].date).getMinutes();
      c.fillText(date, __getXPixel(i,data), SCREEN_HEIGHT - yPadding + 20);
      c.beginPath();
      c.strokeStyle  = "rgba(150,150,150, 0.5)";
      c.lineWidth = 1;
      c.moveTo(__getXPixel(i,data),0);
      c.lineTo(__getXPixel(i,data),SCREEN_HEIGHT - xPadding);
      c.stroke();
    }
    c.stroke();
    c.closePath();
  }

  function __buildMap2(inTrack) {

    // get the min and max longitude/ latitude
    // and build the path
    var minLat, minLon, maxLat, maxLon;
    for (i = 0; i< inTrack.data.length; i++){
      var point = {
        lat: inTrack.data[i].latitude / 1,
        lon: inTrack.data[i].longitude / 1
        };
      if (minLat === undefined || minLat > point.lat) {
        minLat = point.lat;
      };
      if (maxLat === undefined || maxLat < point.lat) {
        maxLat = point.lat;
      };
      if (minLon === undefined || minLon > point.lon) {
        minLon = point.lon;
      };
      if (maxLon === undefined || maxLon < point.lon) {
        maxLon = point.lon;
      };
    };
    console.log("minLat, minLon, maxLat, maxLon", minLat + ","+ minLon + ","+ maxLat + ","+ maxLon);
    // Calculate the Bouncing Box
    var p1 = {lon: minLon, lat: maxLat};
    var p2 = {lon: maxLon, lat: minLat};
    var realHeight = __getDistance(p1.lat, p1.lon, p2.lat, p1.lon);
    var realWidth = __getDistance(p1.lat, p1.lon, p1.lat, p2.lon);
    var larger = realWidth > realHeight ? realWidth : realHeight;
    if (larger < 200) {
      larger = 200;
    };
    console.log("1- realHeight, realWidth, larger", realHeight + ","+ realWidth + ","+ larger);
    // add some borders
    p1 = __movePoint(p1, larger * -0.1, larger * -0.1);
    p2 = __movePoint(p2, larger * 0.1, larger * 0.1);
    console.log("1- p1.lat, p1.lon, p2.lat, p2.lon", p1.lat + ","+ p1.lon + ","+ p2.lat + ","+ p2.lon);
    // make map width always larger
    if (realWidth < realHeight) {
      p1 = __movePoint(p1, (realHeight - realWidth) / -2, 0);
      p2 = __movePoint(p2, (realHeight - realWidth) / +2, 0);
      realHeight = __getDistance(p1.lat, p1.lon, p2.lat, p1.lon);
      realWidth = __getDistance(p1.lat, p1.lon, p1.lat, p2.lon);
      larger = realWidth > realHeight ? realWidth : realHeight;
      console.log("2- realHeight, realWidth, larger", realHeight + ","+ realWidth + ","+ larger);
      console.log("2- p1.lat, p1.lon, p2.lat, p2.lon", p1.lat + ","+ p1.lon + ","+ p2.lat + ","+ p2.lon);
    };
    if (larger === 0) {
      return;
    };

    var paths = "&paths=";
    var j = 0;
    if (inTrack.data.length > 400) {
      var y = parseInt(inTrack.data.length / 400, 10);
      if (y * inTrack.data.length > 400) {
        y = y + 1;
      };
    } else {
      var y = 1;
    };
    console.log("y ", y);
    for (var i = 0; i < inTrack.data.length; i = i + y) {
      if (i === inTrack.data.length - 1) {
        paths = paths + inTrack.data[i].longitude + "," + inTrack.data[i].latitude;
      } else {
        paths = paths + inTrack.data[i].longitude + "," + inTrack.data[i].latitude + ",";
      }
      j++
    };
    console.log("j ", j);
    var magic = 0.00017820;
    var scale = Math.round(larger / (magic * SCREEN_WIDTH));
    scale = "&scale=" + scale;
    var base_url = "http://dev.openstreetmap.org/~pafciu17/?module=map"
    // var base_url = "http://tile.openstreetmap.org/cgi-bin/export?"
    var bbox = "&bbox=" + p1.lon + ","+ p1.lat + ","+ p2.lon + "," + p2.lat;
    var width = "&width=" + SCREEN_WIDTH;
    var loc = base_url + bbox + width + paths;
    // var loc = base_url + bbox + scale + "&format=jpeg";
    // var center = __getCenter(inTrack);
    // var j = 0;
    // var MAX = parseInt(inTrack.data.length / 14, 10);
    // console.log("MAX", MAX);
    // var dw = "&paths=";
    // for (i = 0; i< inTrack.data.length; i = i + MAX) {
    //   if (i === 0) {
    //     lt = inTrack.data[i].latitude + ",";
    //   } else{
    //     lt = "," + inTrack.data[i].latitude + ",";
    //   };
    //   ln = inTrack.data[i].longitude;
    //   dw = dw + lt + ln;
    //   j++;
    // }
    // console.log("dw", dw);

    // var loc = "http://dev.openstreetmap.org/~pafciu17/?module=map&lon=" + center.lon + "&lat=" + center.lat + "&zoom=8&width=" + SCREEN_WIDTH + "&height=" + SCREEN_HEIGHT + dw;
    document.getElementById("map-img").width = SCREEN_WIDTH;
    document.getElementById("map-img").src = loc;
    console.log("loc:", loc);
  }

  function __buildMap(inTrack) {
    // var lat = inTrack.data[0].latitude;
    // var lon = inTrack.data[0].longitude;

    var center = __getCenter(inTrack);
    var j = 0;
    var MAX = parseInt(inTrack.data.length / 14, 10);
    console.log("MAX", MAX);
    var dw = "&d0_colour=00F";
    for (i = 0; i< inTrack.data.length; i = i + MAX) {
      lt = "&d0p"+ j + "lat=" + inTrack.data[i].latitude;
      ln = "&d0p"+ j + "lon=" + inTrack.data[i].longitude;
      dw = dw + ln + lt;
      j++;
    }
    // loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+ lat +"&lon="+ lon +"&mlat0="+ lat +"&mlon0="+ lon + dw + "&z=15&mode=Export&show=1";
    loc = "http://ojw.dev.openstreetmap.org/StaticMap/?lat="+ center.lat +"&lon="+ center.lon + dw + "&z=10&mode=Export&show=1";
    document.getElementById("map-img").onload = alert("removing infos spinner");
    document.getElementById("map-img").width = SCREEN_WIDTH;
    document.getElementById("map-img").src = loc;
    console.log("loc:", loc);
  }

  function __imageLoaded() {
    console.log("removing infos spinner");
    document.getElementById("map-area").removeChild(document.getElementById("infos-spinner"));
  }

  function __createRectCanvas(inElementId, inRange, inSpace) {
    var graph = document.getElementById(inElementId);
    var c = graph.getContext("2d");
    c.clearRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT);
    graph.setAttribute("width",SCREEN_WIDTH);
    graph.setAttribute("height",SCREEN_HEIGHT);

    c.textAlign = "right";
    c.textBaseline = "middle";
    var j = 0;
    var i = 0;
    for (t=0;t<4;t++) {
      c.fillText(parseInt(i,10), xPadding - 10, __getYPixel(j, inRange));
      c.beginPath();
      //~ c.lineWidth = 1;
      c.moveTo(xPadding, __getYPixel(j, inRange));
      c.lineTo(SCREEN_WIDTH, __getYPixel(j, inRange));
      c.stroke();
      j += inSpace;
      i += inSpace;
    }
    c.beginPath();
    c.moveTo(xPadding, 0);
    c.lineTo(xPadding, SCREEN_HEIGHT - yPadding);
    c.lineTo(SCREEN_WIDTH, SCREEN_HEIGHT - yPadding);
    c.stroke();

    return c;
  }
  function __getXPixel(val,data) {
    return ((SCREEN_WIDTH - xPadding) / data.length) * val + xPadding;
  }
  function __getYPixel(val,range) {
    return SCREEN_HEIGHT - (((SCREEN_HEIGHT - yPadding) / range) * val) - yPadding;
  }
  function __getCenter(inTrack) {
    var x = 0;
    var y = 0;
    var z = 0;
    // Convert lat/lon (must be in radians) to Cartesian coordinates for each location
    for (var i = 0; i < inTrack.data.length; i++) {
      //convert to from decimal degrees to radians
      var lat = parseInt(inTrack.data[i].latitude) * Math.PI / 180;
      var lon = parseInt(inTrack.data[i].longitude) * Math.PI / 180;
      var X = Math.cos(lat) * Math.cos(lon);
      var Y = Math.cos(lat) * Math.sin(lon);
      var Z = Math.sin(lat);
      x = x + X;
      y = y + Y;
      z = z + Z;
    };
    // Compute average x, y and z coordinates
    x = x / inTrack.data.length;
    y = y / inTrack.data.length;
    z = z / inTrack.data.length;
    // Convert average x, y, z coordinate to latitude and longitude
    var clon = Math.atan2(y, x);
    var hyp = Math.sqrt(x * x + y * y);
    var clat = Math.atan2(z, hyp);
    // convert from radians to decimal degrees
    console.log("clat, clon", clat + " " + clon);
    clat = clat * 180 / Math.PI;
    clon = clon * 180 / Math.PI;
    console.log("clat, clon", clat + " " + clon);
    return {lat: clat, lon: clon};
  }
  function __getDistance (lat1, lon1, lat2, lon2) {
    var radius = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    
    var lat1Rad = lat1*( Math.PI / 180);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);
    
    var dLat = lat2Rad - lat1Rad;
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1Rad) * Math.cos(lat2Rad) * 
        Math.sin(dLon/2) * Math.sin(dLon/2); 
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
    return radius * c;
  }

  function __movePoint(p, horizontal, vertical) {
    var radius = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    
    var latRad = p.lat*( Math.PI / 180);
    var lonRad = p.lon*( Math.PI / 180);

    var latCircleR = Math.sin( Math.PI/2 - latRad) * radius;
    var horizRad = latCircleR == 0? 0: horizontal / latCircleR;
    var vertRad = vertical / radius;
    
    latRad -= vertRad;
    lonRad += horizRad;
    
    return {
      lat : (latRad / (Math.PI / 180)),
      lon : (lonRad / (Math.PI / 180))
    };
  }

  return {
    display: display
  };

}();