function goWhen() {
  var first = when.defer(), last = first.promise;

  for(var i = 0; i < 100000; i++) {
    last = last.then(function(val) {
      return val + 1;
    });
  }

  var s = new Date();
  first.resolve(0);
  last.then(function(val) {
    document.getElementById("when-time").innerHTML = val + " elapsed ms: " + (new Date()-s);
  });
}
