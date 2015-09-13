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
  var videoKey = key;
  var docKey;
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

      Materialize.toast('Note added at ' + currTime + '!', 800);
    }
    else {

    }

    prevLoc = drawLoc;

  }


});
