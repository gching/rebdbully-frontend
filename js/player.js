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

  function populateVideo(key,data){
    console.log('populateVideo',data);
    $(".video-name").text(data.title);
    var playerInstance = jwplayer('myElement');

    playerInstance.setup({
      file: data.src,
      width: '640px',
      height: '360px',
      title: data.title
    });

  }

  var key = $_GET("key");

  var conn = new FirebaseConn();


  conn.getVideo(key,populateVideo);


});