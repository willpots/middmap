var WP = WP || {};

WP.EventReader = function(fn, map)  {
  this.onload = fn || function(){console.log("Loaded");};
  this.map = map;
  this.events = [];
  this.cluster = new L.MarkerClusterGroup({
    spiderfyOnMaxZoom:true
  });

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
      reader.showBetween(moment().toDate(), moment().add('days', 7).toDate());
      reader.map.addLayer(reader.cluster);
    }
  };
  xhr.open("GET", "/events.json", true);
  xhr.send();
};
WP.EventReader.prototype.show = function() {
  this.map.addLayer(this.cluster);
};
WP.EventReader.prototype.showBetween = function(start, end) {
  for(var x in this.events) {
    var ev = this.events[x];
    var count = 0;
    if(moment(ev.getStart()).isAfter(start) && moment(ev.getStart()).isBefore(end)) {
      if(ev.latlng !== undefined && !this.cluster.hasLayer(ev.marker)) {
        this.cluster.addLayer(ev.marker);
      }
      count += 1;
    } else if(ev.latlng !== undefined) {
      this.cluster.removeLayer(ev.marker);
    }
  }
};
WP.icon = L.Icon.extend({
  options: {
    iconUrl: '/assets/icon.png',
    iconRetinaUrl: '/assets/icon.png',
    iconSize: [50, 50],
    iconAnchor: [14, 43],
    popupAnchor: [0,-40]
    // shadowUrl: "/assets/icon-shadow.png",
    // shadowAnchor: [14, 14],
    // shadowSize: [30, 30]
  }
});
WP.Icon1 = new WP.icon({
    iconUrl: '/assets/priority-1.png',
    iconRetinaUrl: '/assets/priority-1.png'
});
WP.Icon2 = new WP.icon({
    iconUrl: '/assets/priority-2.png',
    iconRetinaUrl: '/assets/priority-2.png'
});
WP.Icon3 = new WP.icon({
    iconUrl: '/assets/priority-3.png',
    iconRetinaUrl: '/assets/priority-3.png'
});
WP.Icon4 = new WP.icon({
    iconUrl: '/assets/priority-4.png',
    iconRetinaUrl: '/assets/priority-4.png'
});
WP.Icon5 = new WP.icon({
    iconUrl: '/assets/priority-5.png',
    iconRetinaUrl: '/assets/priority-5.png'
});
WP.Icon6 = new WP.icon({
    iconUrl: '/assets/priority-6.png',
    iconRetinaUrl: '/assets/priority-6.png'
});
WP.Icon7 = new WP.icon({
    iconUrl: '/assets/priority-7.png',
    iconRetinaUrl: '/assets/priority-7.png'
});

WP.Event = function(data, reader) {
  this.data = data;
  this.hoursUntil = moment(this.data.s_time).diff(moment()) / (1000 * 60 * 60);
  this.time = moment(this.data.s_time).fromNow();
  if (this.data.place !== undefined) {
    this.latlng = new L.LatLng(this.data.place.lat, this.data.place.lng);
    this.marker = new L.Marker(this.latlng, {icon: WP.BlackIcon});
    if(this.hoursUntil < 4) {
      this.marker.setIcon(WP.Icon1);
    } else if(this.hoursUntil < 8) {
      this.marker.setIcon(WP.Icon2);
    } else if(this.hoursUntil < 12) {
      this.marker.setIcon(WP.Icon3);
    } else if(this.hoursUntil < 48) {
      this.marker.setIcon(WP.Icon4);
    } else if(this.hoursUntil < 96) {
      this.marker.setIcon(WP.Icon5);
    } else if(this.hoursUntil < 192) {
      this.marker.setIcon(WP.Icon6);
    } else {
      this.marker.setIcon(WP.Icon7);
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
WP.Event.prototype.getStart = function() {
  return moment(this.data.s_time);
}