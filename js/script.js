var playerInstance = jwplayer('myElement');

playerInstance.setup({
  file: 'pageinfo-close-window.mp4',
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
})

function timeStamp(){
  console.log(duration[duration.length-1]);
}