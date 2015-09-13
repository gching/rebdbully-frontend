// $(document).ready(function(){

	var playerInstance = jwplayer('myElement');

	playerInstance.setup({
	  file: 'pageinfo-close-window.mp4',
	  width: '640px',
	  height: '360px'
	});

	var canvas = document.getElementById("myCanvas");
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "#ECECEC";
	ctx.fillRect(0,0,650,50);
	// ctx.moveTo(30,0);
	// ctx.lineTo(30,50);
	// ctx.stroke();

	// playerInstance.getDuration();

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

	var prevLoc = 0; 

	function timeStamp(){
		var totalTime = playerInstance.getDuration();
		var currTime = duration[duration.length-1];
		if (currTime <= totalTime-0.2) {
			console.log(duration[duration.length-1]);
			var drawLoc = (650 / totalTime * currTime);
			ctx.moveTo(drawLoc, 0);
			ctx.lineTo(drawLoc, 50);
			ctx.stroke();

			$('<div/>', {
			    class: 'timeline-thumb',
			}).css({"margin-left": drawLoc-prevLoc-5, "display": "inline-block"}).appendTo('#timeline-marks');

			Materialize.toast('Note added at ' + currTime + '!', 800);
		}
		else {

		}

		prevLoc = drawLoc;


		
	}


	


// });
