var WP = WP || {};

WP.EventReader = function(fn, map)  {
  this.onload = fn || function(){console.log("Loaded");};
  this.map = map;
  this.events = [];
  this.cluster = new L.MarkerClusterGroup();

};

WP.EventReader.prototype.fetch = function() {
  reader = this;
  xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);
    reader.onload.call(reader, data);
    for (var e in data.events) {
      var ev = data.events[e];
      reader.events.push(new WP.Event( ev, reader, reader.map));
      reader.map.addLayer(reader.cluster);
    }
  };
  xhr.open("GET", "/events.json", true);
  xhr.send();
};
WP.EventReader.prototype.show = function() {
  this.map.addLayer(this.cluster);
};
WP.BlackIcon = L.icon({
    iconUrl: '/assets/icon.png',
    iconRetinaUrl: '/assets/icon.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0,-10],
    shadowUrl: "/assets/icon-shadow.png",
    shadowAnchor: [11, 11],
    shadowSize: [24, 24]
});
WP.GreenIcon = L.icon({
    iconUrl: '/assets/icon-green.png',
    iconRetinaUrl: '/assets/icon-green.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0,-10],
    shadowUrl: "/assets/icon-shadow.png",
    shadowAnchor: [11, 11],
    shadowSize: [24, 24]
});
WP.RedIcon = L.icon({
    iconUrl: '/assets/icon-red.png',
    iconRetinaUrl: '/assets/icon-red.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0,-10],
    shadowUrl: "/assets/icon-shadow.png",
    shadowAnchor: [11, 11],
    shadowSize: [24, 24]
});
WP.YellowIcon = L.icon({
    iconUrl: '/assets/icon-yellow.png',
    iconRetinaUrl: '/assets/icon-yellow.png',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0,-10],
    shadowUrl: "/assets/icon-shadow.png",
    shadowAnchor: [11, 11],
    shadowSize: [24, 24]
});

WP.Event = function(data, reader) {
  this.data = data;
  console.log(data);
  this.hoursUntil = moment(this.data.s_time).diff(moment()) / (1000 * 60 * 60);
  this.time = moment(this.data.s_time).fromNow();
  console.log(this.time);
  if (this.data.place !== undefined) {
    this.latlng = new L.LatLng(this.data.place.lat, this.data.place.lng);
    this.marker = new L.Marker(this.latlng, {icon: WP.BlackIcon});
    if(this.hoursUntil < 12) {
      this.marker.setIcon(WP.RedIcon);
    } else if(this.hoursUntil < 72) {
      this.marker.setIcon(WP.YellowIcon);
    } else {
      this.marker.setIcon(WP.GreenIcon);
    }
    this.marker.bindPopup(this.template());
    this.map = reader.map;
    this.cluster = reader.cluster;
    this.cluster.addLayer(this.marker);
  }
};
WP.Event.prototype.template = function() {
  var result = "";
  result += this.data.name + "<br>";
  var s_date = moment(this.data.s_time);
  var e_date = moment(this.data.e_time);
  result += s_date.format("M/D h:mm a") + " to ";
  result += e_date.format("h:mm a") + "<br>";
  result += this.data.raw_location.toProperCase();
  return result;
};
WP.Event.prototype.hide = function() {
  // this.map.remove(this.marker);
};
WP.Event.prototype.show = function() {
  // this.map.add(this.marker);
};
