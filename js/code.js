$(document).ready(function(){
	var busy = false, 			//Indicates if an animation is currently in progress
		curtainSpeed = 4,		//Duration in seconds for curtain opening
		state = '1_0', 			//Current state in timeline. 1_0 means Scene 1, Sub-Scene 0
		$body = $('body'),
		$window = $(window),
		windowHeight,
		windowWidth;

	$body.click(sceneHandler);

	function sceneHandler(){		//Handler for scene
		if(!busy){
			switch(state){
				case '1_0':
					scene1._0();
					break;
				case '1_1':
					scene1._1();
					break;
				case '1_2':
					break;
			}
		}
	};	

	var scene1 = {
		//SCENE 1.0
		_0 : function(){
			busy = true;
			getWindowSize();

			var $curtainB = $('#curtainBottom'),
				$curtainM = $('#curtainMiddle'),
				$curtainT = $('#curtainTop'),
				$dialogue = $('.dialogue'),
				$dusk = $('#dusk'),
				$ship = $('#shipContainer'),
				$sun = $('#sun'),
				$wave1 = $('#wave1'),
				$wave2 = $('#wave2'),
				$wave3 = $('#wave3'),
				curtainHeight = $curtainB.height(),
				scene1_0 = {
					timeline  : new TimelineMax(),
					waveShift : windowWidth*.1,
					waveSpeed : 4
				};

			scene1_0.timeline
				.to($curtainB, curtainSpeed, {y : -(windowHeight*.44 + curtainHeight), ease: Power2.easeInOut})		 
				.to($curtainM, curtainSpeed, {y : -(windowHeight*.22 + curtainHeight), ease: Power2.easeInOut}, 0)
				.to($curtainT, curtainSpeed, {y : -curtainHeight, ease: Power2.easeInOut}, 0)
				.to($dusk, 4, {opacity : 0, ease:Power1.easeInOut}, 4.5)
				.to($ship, 10, {x : -windowWidth*.6, ease: Power1.easeOut}, 4)
				.to($ship, 2, {y : -windowHeight*.025, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)	
				.to($sun, 4, {y : -windowHeight*.5}, 4)
				.to($wave1, scene1_0.waveSpeed, {x : scene1_0.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)
				.to($wave2, scene1_0.waveSpeed, {x : -scene1_0.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)
				.to($wave3, scene1_0.waveSpeed*1.2, {x : scene1_0.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 3.8)
				.call(writeDialogue, ["Welcome to the story.~DThis tale begins like many other ones, with a hero. Yes, the hero is a bird pirate. His name is Captain Squawkers. No, he\'s not actually a hero. He\'s a friggin\' pirate. He robs people and stuff! Just look how he gets along with the other birds of the sea."], this, 10)
				.call(function(){ state = "1_1"; busy = false;}, [], this, 10);

			//scene1_0.timeline.progress(10);
		},
		//SCENE 1.1
		_1 : function(){
			var	$cannonBarrel = $('#cannonBarrel'),
				$cannonContainer = $('#cannonContainer'),
				$cpt = $('#cpt'),
				$egret = $('#egret'),
				$speedboat = $('#speedboatContainer'),
				aimingCannon = false,
				mouseOrigin,
				scene1_1 = { timeline : new TimelineMax() };	

			getWindowSize(); //Recalculate window size in case it changed

			$('.dialogue').remove();

			busy = true;
			
			scene1_1.timeline
			.to($speedboat, 6, {x : windowWidth*.42, ease: Power1.easeOut})
			.to($speedboat, 2, {y : -windowHeight*.025, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 0)
			.call(writeComment, ["Hey, Mr. Bird! Sweet Ride!", $egret, $egret.width(), $egret.height()/9, "commentRight"], this , 7)
			.call(writeComment, ["Why, thank you... I mean, ARR!! Ye shall surrender thy vessel!", $cpt, $cpt.width()*.36, $cpt.height()*.1, "commentLeft"], this , 9)
			.call(function(){
				$body.click(function(){
					console.log('cannon');

					$body.unbind('click').bind('click', sceneHandler);

					$('.commentLeft, .commentRight').remove();

					$body.on('mousemove', function(event){
						var currentY = event.clientY,
						degrees = Math.floor((mouseOrigin - currentY)*.3);

						//console.log('Origin: ' + mouseOrigin + " Current: " + currentY + " Degrees: " + degrees);

						if(mouseOrigin === undefined){
							mouseOrigin = currentY;
						}

						if(degrees < 50 && degrees > -70){
							$cannonBarrel.css({
								'-webkit-transform' : 'rotate('+ degrees +'deg)',
				                '-moz-transform' : 'rotate('+ degrees +'deg)',
				                '-ms-transform' : 'rotate('+ degrees +'deg)',
				            	'transform' : 'rotate('+ degrees +'deg)'
				            });
						}
					});
				});
			}, [], this, 10)
			.call(function(){ state = "1_2"; busy = false;}, [], this, 10);
		}
	}

	function getWindowSize(){ windowHeight = $window.height(), windowWidth = $window.width(); }


	function writeComment(text, master, offsetX, offsetY, direction){
		var posX = master.position().left + offsetX,
			posY = master.position().top + offsetY;

		if (direction === "commentLeft")
			posX -=320, posY +=15;
		else if (direction == "commentRight")
			posX +=20, posY -=15;

		master.after('<div class="' + direction + '" style="left:' + posX + 'px; top:' + posY + 'px">' + text + '</div>');
	}


	function writeDialogue(text, charIndex){
		/* KEY FOR CHARACTER INTERPRETATION
		 *	~B = <br>
		 *	~D = <br><br>
		 */
		if(charIndex === undefined)
			charIndex = 0;

		if(!$('.dialogue').length) {
			$('body').append('<div class="cfix dialogue"></div>');
			$dialogue = $('.dialogue');			
		}

		if(charIndex < text.length){
			busy = true;
			if(text[charIndex] === '~'){		
				switch(text[charIndex+=1]){
					case 'B':
						var specialChar = '<br>';
						break; 
						
					case 'D':
						var specialChar = '<br><br>';
						break;
					
					default:
						var specialChar = '~';
						break;
				}
				$dialogue.html($dialogue.html() + specialChar);
			} else
				$dialogue.html($dialogue.html() + text[charIndex]);

			setTimeout(function(){ writeDialogue(text, ++charIndex) }, 40);		
		} else {
			busy = false;
		}		
	}	
});