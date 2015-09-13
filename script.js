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

var docKey = null;
var docReady = false;

var duration = [];
playerInstance.on('time', function(event) {
  // console.log(event.position);
  duration.push(event.position);
});

playerInstance.on('complete', function(event) {
  console.log(duration);
});

var fcon = new FirebaseConn();

//---------------------------------------------------

  var videoKey = fcon.getLiveStream(url, "Test youtube livestream");
  console.log("Blah")
  fcon.getDocuments(videoKey, function(key, value) {
    console.log("HERE")
    console.log(key, value);
    docKey = key
    if (docKey === null) {
      // Case when empty document
      docKey = fcon.setDocument('random-owner', videoKey);
      console.log("HREREERERE")
    } else {

      //  Get the sections for each of them and show them?
      fcon.getSections(videoKey, docKey, function(section_key, section_data){
        console.log('#getSections callback');
        console.log(section_key, section_data);
      });
    }
    docReady = true;

  });
  // Button click to create header with timestamp
  function buttonClick() {
    console.log(duration[duration.length-1] + "docReady: " + docReady);
     if (docReady && duration[duration.length-1] !== undefined) {
       createSection(duration[duration.length-1]);
     }
  }

  // Creates a new section in the document
  function createSection(timestamp){
    // Given the timestamp we create a section with the given docKey
    // and get a refernece to it.
    var newSectionRef = fcon.setSection(timestamp, videoKey, docKey);

    // Use this section reference to setup a new firepad
    var codeMirror = CodeMirror(document.getElementById('firepad-container'), { lineWrapping: true });
    var firepad = Firepad.fromCodeMirror(newSectionRef, codeMirror, {
      richTextToolbar: true,
      richTextShortcuts: true
    });
    firepad.on('ready', function() {
      if (firepad.isHistoryEmpty()) {
        firepad.setHtml(
              '<headertimestamp timestamp="' + timestamp + '">Header Element</headertimestamp>'
            );
      }
    });

    firepad.registerEntity('headertimestamp', {

      /**
      Renders the element given the info with listener on click.
      */
      render: function(info, entityHandler) {
        console.log('render')
        console.log(entityHandler)

        // Create a header with h2 tag
        var headerWithTimestamp = document.createElement('span');
        headerWithTimestamp.style['fontsize'] = '24px';

        if (info.timestamp){
          headerWithTimestamp.timestamp = info.timestamp;
        }

        headerWithTimestamp.textContent = info.textContent;
        headerWithTimestamp.addEventListener('click', function(){
          console.log('Clicked with timestamp ' + info.timestamp);
        });

        return headerWithTimestamp;

      }.bind(this),

      /**
      Sets default info with timestamp and the actual text inside from the
      actual element inserted.
      */
      fromElement: function(element){
        // Sets a timestamp or a provided with from the element from the
        // provided attribute. As well, gets the text in between the tag and
        // provides it in info.
        // TODO  Set the timestamp attribute
        var timestampEle = element.attributes.timestamp
        console.log(timestampEle)
        var info = {timestamp: '7000', textContent: element.textContent};
        return info;
      },
      /**
      On update from firebase, we update it on the element.
      */
      update: function(info, element) {
        // TODO  Change the text if changed.
        if (info.timestamp){
          element.timestamp = info.timestamp
        } else {
          element.timestamp = '0:00'
        }
      }

    });
  }
