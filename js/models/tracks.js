// define(function(){
var Tracks = function() {

  var current_track = {};
  var start_date;
  var distance = 0;
  var olat = null;
  var olon = null;

  function open() {
    current_track = {};
    // Get start date
    var d = new Date();
    current_track.date = d.toISOString();
    start_date = d.getTime();
    // Define track ID (= start date)
    current_track.trackid = current_track.date;
    // Build track name
    var year = d.getFullYear();
    var month = d.getMonth();
    var day = d.getDate();
    var hour = d.getHours();
    var min = d.getMinutes();
    var sec = d.getSeconds();
    current_track.name = "TR-"+year+month+day+"-"+hour+min+sec;
    // Initiate the rest
    current_track.duration = 0;
    current_track.distance = 0;
    current_track.data = [];
    // Set the number of gps point
    nb_point = 0;

    return current_track;
  }

  function addNode(inNode, inDistance, inDuration) {
    current_track.data.push(inNode);
    current_track.distance = inDistance;
    current_track.duration = inDuration;
    nb_point =+ 1;
  }

  function getDistance(lat, lon) {
    if (olat != null) {      
      distance += __distanceFromPrev(olat, olon, lat, lon);
      console.log("distance: ", distance);
    };
    olat = lat;
    olon = lon;
    return distance;
  }

  function getDuration(time) {
    return time - start_date;
  }

  function close() {
    return current_track;
  }

  function reset() {
    distance = 0;
    
  }

  function __distanceFromPrev(lat1, lon1, lat2, lon2) {
    var lat1Rad = lat1*( Math.PI / 180);
    // console.log("lat1Rad: ", lat1Rad);
    var lon1Rad = lon1*( Math.PI / 180);
    var lat2Rad = lat2*( Math.PI / 180);
    var lon2Rad = lon2*( Math.PI / 180);

    var dLat = lat2Rad - lat1Rad;
    // console.log("dLat: ", dLat);
    var dLon = lon2Rad - lon1Rad;

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(lat1Rad) * Math.cos(lat2Rad) * Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var R = 6371 * 1000; // Earth radius (mean) in metres {6371, 6367}
    // console.log("R*c: ", R*c);
    return R * c;
  }

  return {
    open: open,
    addNode: addNode,
    getDuration: getDuration,
    getDistance: getDistance,
    close: close
  };
}();
// });