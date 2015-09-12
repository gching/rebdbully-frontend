$(document).ready(function(){

  $.cloudinary.config({cloud_name: 'dtniqc2hg', api_key: '774811675961835'});

  var jsonObj = {
    "timestamp": new Date(),
    "callback":"upload.html",
    "signature": "qH-Vz69oOpp50d0VS7LPHJWeyc4",
    "api_key":"774811675961835"
  };
  $("input[name='video']").data("form-data",jsonObj);

  $("form").submit(function(e){
    console.log("Submitted file");
    var video = document.getElementById("video");
    var file = video.files[0];
  });
});