/**
* Firebase API Class
* ------------------------
* Enables some simple functions to get and set from the firebase API
* Will fetch single or all videos stored on cloudinary by fetching the URL location stored in Firebase
* Will find documents for videos stored on firebase
*/


// Constructor
function FirebaseConn(){
  // The property used to actually contain the reference to Firebase
  // Connects to Specific Firebase DB
  this.dbRefVids = new Firebase('https://qh9wny0cxht.firebaseio-demo.com/videos');
}



/**
 * Getters
 * --------------------------------
 */

// Retrieve a specific video by ID
FirebaseConn.prototype.getVideo = function (videoKey,callback){
  this.dbRefVids.orderByKey().equalTo(videoKey).limitToFirst(1).on('child_added',function(data){
    console.log("getVideo",data.key(),data.val());
    callback(data.val());
  }); 

};

// Fetches all Videos
FirebaseConn.prototype.getVideos = function(callback){
  this.dbRefVids.on('child_added',function(data){
    callback(data.key(),data.val());
    console.log("getVideos",data.key(),data.val());
  });
}

// Retrieve a specific document by ID
FirebaseConn.prototype.getDocument = function(videoKey,documentKey,callback){
  this.dbRefVids.orderByKey().equalTo(videoKey).child(documentKey).on("child_added",function(data){
    console.log(data.key(),data.val());
    callback(data.key(),data.val());
  });

}

// Fetch all Documents
FirebaseConn.prototype.getDocuments = function(videoKey,callback){
  this.dbRefVids.orderByKey().equalTo(videoKey).on('child_added',function(data){
    console.log("getDocuments",data.key(),data.val());
    callback(data.key(),data.val());
  });
}


/**
 * Setters
 * -------------------------------
 */

// Create new document, or update
FirebaseConn.prototype.setDocument = function(notes,videoKey,documentKey){
  if (videoKey === null || videoKey === ''){
    throw "ERROR: Cannot have undefined video key";
  }

  // By default, assume it's a new document being saved
  documentKey = documentKey || null;

  // Checks!

  // TODO: Find parameters and do checks

  // Update the Document Specific Information
  if (documentKey !=null ){
    var videoRef = this.dbRefVids.child(videoKey);
    var documentRef = videoRef.child(documentKey);
    documentRef.update({
      notes: notes
    });
    return;
  }

  // Create a new Document
  var videoRef = this.dbRefVids.child(videoKey);
  var newDocument = videoRef.push({
    notes: notes
  });

  var newDocumentKey = newDocument.key();

  console.log(newDocumentKey);

}


// Create new Video, or update
FirebaseConn.prototype.setVideo = function(title,fileLoc,videoKey){
  // By default, assume it's a new video being saved
  videoKey = videoKey || null;

  // Checks!

  // TODO: Find parameters and do checks

  // By default, assume it's a new video being saved
  if (videoKey !=null ){
  // By default, assume it's a new video being saved
    var videoRef = this.dbRefVids.child(videoKey);
    videoRef.update({
      title: title,
      src: fileLoc
    });
    return;
  }

  var newVideo = this.dbRefVids.push({
    title: title,
    src: fileLoc
  });

  var newVideoKey = newVideo.key();

  console.log(newVideoKey);
}

