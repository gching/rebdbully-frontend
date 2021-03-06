var playerInstance = jwplayer('myElement');

// var url = "http://www.youtube.com/watch?v=u4rizXqsmdc";

playerInstance.setup({
  file: "https://www.youtube.com/watch?v=zpqKpWNCdJ0",
  width: 640,
  height: 360,
  title: "temp title",
});

  var duration;
  var ctx;
  var canvas;
  var playerInstance;
  var vidStart;
  var initialTime = 0;

  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ECECEC";
  ctx.fillRect(0,0,650,50);


  duration = [];
  playerInstance.on('time', function(event) {
    console.log(event.position);
    duration.push(event.position);
    initialTime = duration[0];

  });

  playerInstance.on('complete', function(event) {
    console.log(duration);


  });

  var prevLoc = 0;

    $('#timestamp-func').click(function(){timeStamp()});


  function timeStamp(){
    console.log(initialTime);
    var totalTime = playerInstance.getDuration();
    var currTime = duration[duration.length-1];
    if (currTime <= totalTime-0.2) {
      console.log(currTime);
      var drawLoc = (currTime - initialTime)*5;
      ctx.moveTo(drawLoc, 0);
      ctx.lineTo(drawLoc, 50);
      ctx.stroke();

      $('<div/>', {
          class: 'timeline-thumb',
      }).css({"margin-left": drawLoc-prevLoc-5, "display": "inline-block"}).appendTo('#timeline-marks');

      Materialize.toast('Note added at ' + (currTime/60).toFixed(2) + ' minutes!', 800);
    }
    else {

    }

    prevLoc = drawLoc;

  }

var docKey = null;
var docReady = false;
var annotatedNotes = [];

// var duration = [];
// playerInstance.on('time', function(event) {
//   // console.log(event.position);
//   duration.push(event.position);
// });

// playerInstance.on('complete', function(event) {
//   console.log(duration);
// });

//Set up firebase connection
var fcon = new FirebaseConn();
var firepad;

var videoKey = fcon.getLiveStream(url, "Test youtube livestream");
fcon.getDocuments(videoKey, function(key, value) {
  docKey = key;
  if (docKey === null) {
    // Case when empty document
    docKey = fcon.setDocument('random-owner', videoKey);
  } else {

    //  Get the sections for each of them and show them?
    fcon.getSections(videoKey, docKey, function(section_key, section_data){
      console.log('#getSections callback');
      console.log(section_key, section_data);
    });
  }
  firepad = createFirePad(fcon, videoKey, docKey);
  docReady = true;
});

// Button click to create header with timestamp
function buttonClick() {
  timestamp = duration[duration.length-1];
  console.log(timestamp + "docReady: " + docReady);
  if (docReady && timestamp !== undefined) {
    firepad.makeHeaderDialog_(timestamp);

    //Create buttons that take you to different parts of the video
    var button = document.createElement("input");
    button.type = "button";
    button.value = timestamp.toFixed(2)+"s";
    button.onclick = function() {
      playerInstance.seek(timestamp);
    };
    document.querySelector("#annotatedNotes").appendChild(button);
  }
}

function createFirePad(fcon, videoKey, docKey) {
  var newSectionRef = fcon.setSection(0, videoKey, docKey);

  // Use this section reference to setup a new firepad
  var codeMirror = CodeMirror(document.getElementById('firepad-container'), { lineWrapping: true });
  var firepad = Firepad.fromCodeMirror(newSectionRef, codeMirror, {
    richTextToolbar: true,
    richTextShortcuts: true
  });

  console.log(firepad);

  firepad.registerEntity('header-timestamp', {
    /**
    Renders the element given the info with listener on click.
    */
    render: function(info, entityHandler) {
      console.log('render');
      console.log(entityHandler);

      // Create span with class name.
      var headerWithTimestamp = document.createElement('span');
      headerWithTimestamp.className = 'header-timestamp';


      if (info.timestamp){
        headerWithTimestamp.timestamp = info.timestamp;
      }

      headerWithTimestamp.textContent = info.textContent;
      headerWithTimestamp.addEventListener('click', function(){
        console.log('Clicked with timestamp ' + info.timestamp);
        // Jumping to part in video
        playerInstance.seek(info.timestamp);
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
      var timestampEle = element.attributes.timestamp;
      console.log(timestampEle);
      var info = {timestamp: timestampEle.value, textContent: element.textContent};
      return info;
    },
    /**
    On update from firebase, we update it on the element.
    */
    update: function(info, element) {
      // TODO  Change the text if changed.
      if (info.timestamp){
        element.timestamp = info.timestamp;
      } else {
        element.timestamp = '0:00';
      }
    }
  });

  return firepad;
}
