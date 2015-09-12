$(document).ready(function(){
  var myDataRef = new Firebase('https://qh9wny0cxht.firebaseio-demo.com/');


  $("input[name='message']").keypress(function(e){

    if (e.keyCode === 13){
      var name = $("input[name='name']").val();
      var message = $("input[name='message']").val();
      var saveMessage = 'User ' + name + ' says ' + message
      myDataRef.push({message: name, profileId:message, text:"TESTING TEXT"});
      $("input[name='message']").val('');
      console.log(saveMessage);
    }
  });




  var conn = new FirebaseConn();

  conn.setVideo("Grouse Mountain","http://res.cloudinary.com/dtniqc2hg/video/upload/v1442068319/VID_20150813_132528289_zbic2d.mp4");
  // conn.setDocument("ASD NOTES","-Jz0HHtoPqW1F_LrlW2I");

  // conn.getDocuments("-Jz0HHtoPqW1F_LrlW2I");
});