
function EventReader(fn)  {
  this.onload = fn || function(){console.log("Loaded");};
}
EventReader.prototype.fetch = function() {
  reader = this;
  xhr = new XMLHttpRequest();
  xhr.onload = function() {
    var data = JSON.parse(xhr.responseText);
    console.log(data);
    reader.onload.call(reader, data);
  };
  xhr.open("GET", "/events.json", true);
  xhr.send();
};