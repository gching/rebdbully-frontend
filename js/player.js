$(document).ready(function(){
  function $_GET(variable) {
    var query = window.location.search.substring(1);
    var vars = query.split("&");
    for (var i=0;i<vars.length;i++) {
      var pair = vars[i].split("=");
      if (pair[0] == variable) {
        return pair[1];
      }
    }
    return null;
  }

  var duration;
  var ctx;
  var canvas;
  var playerInstance;

  function populateVideo(key,data){
    console.log('populateVideo',data);
    $(".video-name").text(data.title);
    playerInstance = jwplayer('myElement');

    playerInstance.setup({
      file: data.src,
      width: '640px',
      height: '360px',
      title: data.title,
      image: data.thumbnailLoc
    });


  canvas = document.getElementById("myCanvas");
  ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ECECEC";
  ctx.fillRect(0,0,650,50);
  // ctx.moveTo(30,0);
  // ctx.lineTo(30,50);
  // ctx.stroke();

  // playerInstance.getDuration();

  // playerInstance.on('seek', function(event) {
  //   console.log(playerInstance.getPosition());
  // });

  // playerInstance.on('time', function(event) {
  //   console.log(playerInstance.getPosition());
  // });

  duration = [];
  playerInstance.on('time', function(event) {
    console.log(event.position);
    duration.push(event.position);
   //  ctx.moveTo(event.position, 0);
    // ctx.lineTo(event.position, 50);
    // ctx.stroke();
  });

  playerInstance.on('complete', function(event) {
    console.log(duration);


  })



  }





  var key = $_GET("key");

  var conn = new FirebaseConn();


  conn.getVideo(key,populateVideo);

    var prevLoc = 0;

  $('#timestamp-func').click(function(){timeStamp()});

  /********************* Document stuff ************************/
  var firepad;
  // Create a codeMirror editor on default
  var codeMirror = createCodeMirrorEditor();

  var videoKey = key;
  var docKey;

  var fcon = conn;
  console.log("Heree in")
  fcon.getDocuments(videoKey, function(key, value) {

    console.log("fcon.getDocuments")
    docKey = key;
    console.log(docKey)

    if (docKey === null) {
      // Case when empty document
      // Create a document an a default section
      console.log('before setDocument')
      docKey = fcon.setDocument('random-owner', videoKey);
      changeFirePad(fcon, videoKey, docKey, codeMirror);
    }
    //  Each time a section updates, add or check the time on the bar
    fcon.getSections(videoKey, docKey, function(section_key, section_data){
      console.log('#getSections callback');
      console.log(section_key, section_data);
    });

  });
  function createCodeMirrorEditor(){
    // Creates a code mirror editor on the firepad-container element
    var codeMirror = CodeMirror(document.getElementById('firepad-container'), { lineWrapping: true });
    return codeMirror;
  }
  function changeFirePad(fcon, videoKey, docKey, codeMirror, sectionRef ) {
    // Changes the Firepad ontop of the passed in CodeMirror editor with the
    // given credentials.

    if (sectionRef === undefined){
      console.log('before setSection')
      sectionRef = fcon.setSection(0, videoKey, docKey);
      console.log('after setSection')
    }

    // Use this section reference to setup a new firepad
    var firepad = Firepad.fromCodeMirror(sectionRef, codeMirror, {
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





  /**
    At the current time, create a cursor and a new section in the document.
  */
  function timeStamp(){
    var totalTime = playerInstance.getDuration();
    var currTime = duration[duration.length-1];
    if (currTime <= totalTime-0.2) {
      console.log(duration[duration.length-1]);
      var drawLoc = (650 / totalTime * currTime);
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


});
