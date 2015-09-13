/**
* Firebase API Class
* ------------------------
* Enables some simple functions to get and set from the firebase API
* Will fetch single or all videos stored on cloudinary by fetching the URL location stored in Firebase
* Will find documents for videos stored on firebase
*/

/**
 * // Example Data structure in NoSQL
 * 
 * Videos 
 *    src
 *    title
 *    [List of Documents]
 *        Document
 *            owner
 *            [List of Sections]
 *                section
 *                    message
 *                    subject
 * 
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
// Requires the key value for the video
// Requires a callback
FirebaseConn.prototype.getVideo = function (videoKey,callback){
  this.dbRefVids.orderByKey().equalTo(videoKey).limitToFirst(1).on('child_added',function(data){
    console.log("getVideo",data.key(),data.val());
    callback(data.key(),data.val());
  }); 
};

FirebaseConn.prototype.getVideoKeyByUrl = function(url,callback){
  var key = this.orderByChild("src").equalTo(url).key();
  return key;
}

FirebaseConn.prototype.getLiveStream = function(url,title){
  if (this.dbRefVids.orderByChild("src").equalTo(url).length>0){
    return this.getVideoKeyByUrl(url);
  }
  else{
      return this.setVideo(url,title,url+"/1.jpg");
  }
}

// Fetches all Videos
// Requires a callback function
FirebaseConn.prototype.getVideos = function(callback){
  this.dbRefVids.on('child_added',function(data){
    callback(data.key(),data.val());
    console.log("getVideos",data.key(),data.val());
  });
}

// Retrieve a specific document by ID
// Requires a the key value representing the video, as well as the key name for the document
// Requires a callback
FirebaseConn.prototype.getDocument = function(videoKey,documentKey,callback){
  this.dbRefVids.orderByKey().equalTo(videoKey).child("docs").child(documentKey).on("child_added",function(data){
    console.log(data.key(),data.val());
    callback(data.key(),data.val());
  });
}

// Fetch all Documents
// Requires the key value for the video
// Requires a callback
FirebaseConn.prototype.getDocuments = function(videoKey,callback){
  if (this.dbRefVids.child(videoKey).child("docs").length>0){
    this.dbRefVids.orderByKey().equalTo(videoKey).child("docs").on('child_added',function(data){
      console.log("getDocuments",data.key(),data.val());
      callback(data.key(),data.val());
    });
  }
  else{
    console.log("No children elements");
  }


}

// Retrieve a specific section for a specific document by ID
// Requires a the key value representing the video, as well as the key name for the document
// Requires a callback
FirebaseConn.prototype.getSection = function(videoKey,documentKey,sectionKey,callback){
  var videoRef = this.dbRefVids.child(videoKey);
  var docRef = videoRef.child("docs").child(documentKey);
  var section = docRef.child("sections").child(sectionKey).on("child_added",function(data){
    console.log(data.key(),data.val());
    callback(data.key(),data.val());
  });
}

// Retrieves all sections for a specific video and a specific document
FirebaseConn.prototype.getSections = function(videoKey,documentKey,callback){
  var videoRef = this.dbRefVids.child(videoKey);
  var docRef = videoRef.child("docs").child(documentKey);
  var sections = docRef.child("sections").on("child_added",function(data){
    console.log("getSections",data.key(),data.val());
    callback(data.key(),data.val());
  });
}


/**
 * Setters
 * -------------------------------
 */

/**
 * saves a section underneath a document, which is underneath a video
 */
FirebaseConn.prototype.setSection = function(note,title,videoKey,documentKey){
  // Create a new Document
  var videoRef = this.dbRefVids.child(videoKey);
  var docRef = videoRef.child("docs").child(documentKey);
  var section = docRef.child("sections").push({
    note: note,
    title: title
  });

  var sectionKey = section.key();

  console.log(sectionKey);
}

// Create new document, or update
// Stores it under a documents list under a video
FirebaseConn.prototype.setDocument = function(owner,videoKey,documentKey){
  if (videoKey === null || videoKey === ''){
    throw "ERROR: Cannot have undefined video key";
  }

  // By default, assume it's a new document being saved
  documentKey = documentKey || null;

  // Checks!

  // TODO: Find parameters and do checks

  // Update the Document Specific Information
/*  if (documentKey !=null ){
    var videoRef = this.dbRefVids.child(videoKey);
    var documentRef = videoRef.child("docs");
    documentRef.update({
      notes: notes
    });
    return;
  }*/

  // Create a new Document
  var videoRef = this.dbRefVids.child(videoKey);
  var newDocument = videoRef.child("docs").push({
    owner: owner
  });

  var newDocumentKey = newDocument.key();

  console.log(newDocumentKey);

}


// Create new Video, or update
FirebaseConn.prototype.setVideo = function(title,fileLoc,thumbnailLoc, videoKey){
  // By default, assume it's a new video being saved
  videoKey     = videoKey || null;

  // Checks!

  // TODO: Find parameters and do checks

  // By default, assume it's a new video being saved
/*  if (videoKey !=null ){
    var videoRef = this.dbRefVids.child(videoKey);
    videoRef.update({
      title: title
    });
    return;
  }*/

  var newVideo = this.dbRefVids.push({
    title: title,
    src: fileLoc,
    thumbnailLoc: thumbnailLoc
  });

  var newVideoKey = newVideo.key();
  console.log(newVideoKey);

  return newVideoKey;
}

