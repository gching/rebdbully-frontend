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

  function populateVideo(data){
    console.log(data);  
    var $source = $("<source>");
    $source.attr("type","video/mp4");
    $source.attr("src",data.src);
    $("video").append($source);

    $source = $("<source>");
        $source.attr("type","video/webm");
        $source.attr("src",data.src);
        $("video").append($source);

    $source = $("<source>");
        $source.attr("type","video/ogg");
        $source.attr("src",data.src);
        $("video").append($source);

  }

  var key = $_GET("key");

  var conn = new FirebaseConn();


  conn.getVideo(key,populateVideo);


});