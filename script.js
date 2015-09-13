var playerInstance = jwplayer('myElement');

var url = "http://www.youtube.com/watch?v=u4rizXqsmdc";

playerInstance.setup({
  file: "http://www.youtube.com/watch?v=u4rizXqsmdc",
  width: 1000,
  height: 600
});

// playerInstance.on('seek', function(event) {
//   console.log(playerInstance.getPosition());
// });

// playerInstance.on('time', function(event) {
//   console.log(playerInstance.getPosition());
// });

var docReady = false;

var duration = [];
playerInstance.on('time', function(event) {
  // console.log(event.position);
  duration.push(event.position);
});

playerInstance.on('complete', function(event) {
  console.log(duration);
});

//---------------------------------------------------

  var fcon = new FirebaseConn();
  var videoKey = fcon.getLiveStream(url, "Test youtube livestream");
  console.log("Blah")
  fcon.getDocuments(videoKey, function(key, value) {
    console.log("HERE")
    console.log(key, value);
    var documentKey = key;
    if (documentKey === null) {
      // Case when empty document
      documentKey = fcon.setDocument('random-owner', videoKey);
      console.log("HREREERERE")
    } else {

      //  Get the sections for each of them and show them?
      fcon.getSections(videoKey, documentKey, function(section_key, section_data){
        console.log('#getSections callback');
        console.log(section_key, section_data);
      });
    }
    docReady = true;

  });
  // Button click to create header with timestamp
  function buttonClick() {
    console.log(duration[duration.length-1] + "firepadRef: " + firepadReady);
     if (docReady) {
       createSection(duration[duration.length-1]);
     }
  }

  // Creates a new section in the document
  function createSection(timestamp)