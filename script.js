var playerInstance = jwplayer('myElement');

playerInstance.setup({
  file: 'pageinfo-close-window.mp4',
  width: 1000,
  height: 600
});

// playerInstance.on('seek', function(event) {
//   console.log(playerInstance.getPosition());
// });

// playerInstance.on('time', function(event) {
//   console.log(playerInstance.getPosition());
// });

var duration = [];
playerInstance.on('time', function(event) {
  // console.log(event.position);
  duration.push(event.position);
});

playerInstance.on('complete', function(event) {
  console.log(duration);
});



//---------------------------------------------------

  //// Initialize Firebase.
  var firepadRef = getExampleRef();
  // TODO: Replace above line with:
  // var firepadRef = new Firebase('<YOUR FIREBASE URL>');
  //// Create CodeMirror (with lineWrapping on).
  var codeMirror = CodeMirror(document.getElementById('firepad-container'), { lineWrapping: true });
  //// Create Firepad (with rich text toolbar and shortcuts enabled).
  var firepad = Firepad.fromCodeMirror(firepadRef, codeMirror,
      { richTextToolbar: true, richTextShortcuts: true });
  //// Initialize contents.
  firepad.on('ready', function() {
    if (firepad.isHistoryEmpty()) {
      firepad.setHtml(
            '<header-timestamp>Header Element</header-timestamp>'
          );
    }
  });

  // Button click to create header with timestamp
  function buttonClick() {
    console.log(duration[duration.length-1]);
    firepad.makeHeaderDialog_(duration[duration.length-1]);
  }
  // An example of a complex custom entity.

  firepad.registerEntity('header-timestamp', {

    /**
    Renders the element given the info with listener on click.
    */
    render: function(info, entityHandler) {
      console.log('render')
      console.log(entityHandler)

      // Create a header with h2 tag
      var headerWithTimestamp = document.createElement('span');
      headerWithTimestamp.style['font-size'] = '24px';

      // Set the timestamp on the element
      if (info.timestamp){
        headerWithTimestamp.timestamp = info.timestamp;
      }

      // Set the text content from the information
      headerWithTimestamp.textContent = info.textContent;


      // When clicked, return information on what the time is
      headerWithTimestamp.addEventListener('click', function(){
        console.log('Clicked with timestamp ' + info.timestamp);
      });

      console.log(headerWithTimestamp)
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
      // TODO - Set the timestamp attribute
      var info = {timestamp: '0:00', textContent: element.textContent};
      return info;
    },
    /**
    On update from firebase, we update it on the element.
    */
    update: function(info, element) {
      // TODO - Change the text if changed.
      if (info.timestamp){
        element.timestamp = info.timestamp
      } else {
        element.timestamp = '0:00'
      }
    }
    /**
    Possibly exports to firebase and saves it this way
    TODO - Fallbacks to render so don't need it
    */
    /*
    export: function (info) {

      var inputElement = document.createElement('checkbox');
      if(info.checked) {
        inputElement.setAttribute('checked', true);
      }
      console.log("blah" + inputElement)
      return inputElement;
    }
    */

  });
  firepad.registerEntity('checkbox', {
    render: function (info, entityHandler) {
      var inputElement = document.createElement('input');
      inputElement.setAttribute('type', 'checkbox');
      if(info.checked) {
        inputElement.checked = 'checked';
      }
      inputElement.addEventListener('click', function () {
        entityHandler.replace({checked:this.checked});
      });
      return inputElement;
    }.bind(this),
    fromElement: function (element) {
      var info = {};
      if(element.hasAttribute('checked')) {
        info.checked = true;
      }
      return info;
    },
    update: function (info, element) {
      console.log(info)
      console.log('here')
      if (info.checked) {
        element.checked = 'checked';
      } else {
        element.checked = null;
      }
    },
    export: function (info) {
      var inputElement = document.createElement('checkbox');
      if(info.checked) {
        inputElement.setAttribute('checked', true);
      }
      console.log("blah" + inputElement)
      return inputElement;
    }
  });

  // Helper to get hash from end of URL or generate a random one.
  function getExampleRef() {
  var ref = new Firebase('https://radiant-fire-7825.firebaseio.com/');
  var hash = window.location.hash.replace(/#/g, '');
  if (hash) {
    ref = ref.child(hash);
  } else {
    ref = ref.push(); // generate unique location.
    window.location = window.location + '#' + ref.key(); // add it as a hash to the URL.
  }
  if (typeof console !== 'undefined')
    console.log('Firebase data: ', ref.toString());
  return ref;
}