$(document).ready(function(){
  var conn = new FirebaseConn();

  var addVideo = function(key,data){
    var $a = $("<a href='#'>");
    $a.text(data.title);
    $a.data("src",data.src);
    $a.data("id",key);
    $("ul").append($a);
    $("ul").append($("<br/>"));
  }

  conn.getVideos(addVideo);

  $("body").on("click","a",function(e){
    e.preventDefault();
    conn.getVideo($(this).data("id"),loadVideo);
  });


  var loadVideo = function(key,data){
    console.log(data);
    var src = data.src;

    var $source = $("<source>");
    $source.attr("type","video/mp4");
    $source.attr("src",src);
    $("video").append($source);
  };


});