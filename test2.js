$.cloudinary.config({cloud_name: 'dtniqc2hg', api_key: '774811675961835'});
$(document).ready(function(){



  var jsonObj = {
    "timestamp": new Date().getTime(),
    "callback":"upload.html",
    "signature": "qH-Vz69oOpp50d0VS7LPHJWeyc4",
    "api_key":"774811675961835"
  };

  $("input[name='file']").data("form-data",JSON.stringify(jsonObj));
  console.log($.cloudinary.config());


});