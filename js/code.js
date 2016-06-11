$(document).ready(function() {
	var busy = false, 			//Indicates if an animation is currently in progress
		curtainSpeed = 4,		//Duration in seconds for curtain opening
		state = '1', 			//Current state in timeline. 1_0 means Scene 1, Sub-Scene 0
		$body = $('body'),
		$window = $(window),
		windowHeight,
		windowWidth;

	$body.click(sceneHandler);

	function sceneHandler() {	//Handler for scene
		if(!busy)
			scenes[state]();
	};	

	var scenes = {
		//SCENE 1.0
		1 : function() {
			busy = true;
			getWindowSize();

			var $cannonball = $('#cannonball'),
				$cannonBarrel = $('#cannonBarrel'),
				$cannonBarrelContainer = $('#cannonBarrelContainer'),
				$cannonContainer = $('#cannonContainer'),
				$cpt = $('#cpt'),
				$curtains = { bot : $('#curtainBottom'), mid : $('#curtainMiddle'), top : $('#curtainTop')},
				$dialogue = $('.dialogue'),
				$dusk = $('#dusk'),
				$egret = $('#egret'),
				$ship = $('#shipContainer'),
				$speedboat = $('#speedboatContainer'),
				$sun = $('#sun'),
				$waves = {front : $('#wave1'), middle : $('#wave2'), back: $('#wave3')},
				aimingCannon = false,
				cannonBallSize = Math.floor($cannonBarrel.height()*.42),
				cannonContainerHeight = $cannonContainer.height(),
				curtainHeight = $curtains.bot.height(),
				mouseOrigin,
				timeline = {
					t1 : new TimelineMax(), //Squawkers enters stage left and story begins
					t2 : new TimelineMax(), //Egret enters state right and converses with Squawkers
					t3 : new TimelineMax(), //Squawkers Fire cannon and destroys Egret
					waveShift : windowWidth*.1,
					waveSpeed : 4
				};

			$cannonball.css({
				bottom : $cannonBarrel.height()/2,
				height : cannonBallSize, 
				width: cannonBallSize
			});	

			$cannonBarrelContainer.css('height', $cannonBarrel.height());

			timeline.t1
				.to($curtains.bot, curtainSpeed, {y : -(windowHeight*.44 + curtainHeight), ease: Power2.easeInOut})		 
				.to($curtains.mid, curtainSpeed, {y : -(windowHeight*.22 + curtainHeight), ease: Power2.easeInOut}, 0)
				.to($curtains.top, curtainSpeed, {y : -curtainHeight, ease: Power2.easeInOut}, 0)
				.to($dusk, 4, {opacity : 0, ease:Power1.easeInOut}, 4.5)
				.to($ship, 10, {x : -windowWidth*.6, ease: Power1.easeOut}, 4)
				.to($ship, 2, {y : -windowHeight*.025, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)	
				.to($sun, 4, {y : -windowHeight*.5}, 4)
				.to($waves.front, timeline.waveSpeed, {x : timeline.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)
				.to($waves.middle, timeline.waveSpeed, {x : -timeline.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)
				.to($waves.back, timeline.waveSpeed*1.2, {x : timeline.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 3.8)
				.call(writeDialogue, ["Welcome to the story.~DThis tale begins like many other ones, with a hero. Yes, the hero is a bird pirate. His name is Captain Squawkers. No, he\'s not actually a hero. He\'s a friggin\' pirate. He robs people and stuff! Just look how he gets along with the other birds of the sea."], this, 10)
				.call(nextScene, [timeline.t2], this, 10);
				//timeline.t1.progress(10); busy = false;//FOR TESTING			
			
			timeline.t2
				.pause()
				.call(killDialogue, [], this)
				.to($speedboat, 6, {x : windowWidth*.42, ease: Power1.easeOut})
				.to($speedboat, 2, {y : -windowHeight*.025, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 0)
				.call(writeComment, ["Hey, Mr. Bird! Sweet Ride!", $egret, $egret.width(), $egret.height()/9, "commentRight"], this , 7)
				.call(writeComment, ["Why, thank you... I mean, ARR!! Ye shall surrender thy vessel!", $cpt, $cpt.width()*.36, $cpt.height()*.1, "commentLeft"], this , 9)
				.call(aimCannon, [], this, 10)
				.call(function() {busy = false;}, [], this, 10);
				//timeline.t2.progress(10); //FOR TESTING

			timeline.t3
				.pause()
				.to($cannonball, .6, {x : -windowWidth/2,  y: -cannonBallSize*6, ease: Power1.easeInOut})
				.to($cannonContainer, .2, {x : cannonBallSize*2, y: cannonBallSize/2, ease: Power2.easeOut}, 0)				
				.to($speedboat, .6, {x : cannonBallSize, y: windowHeight/2, ease: Power1.easeOut}, .22)
				.to($egret, .8, {x : -windowWidth, y: -windowHeight*1.5, rotation: 4000, ease: Power1.easeOut}, .22)
				.call(writeDialogue, ["And thus, Captain Squawkers ruled the seas with an iron wing. Tyranical and menacing, he plundered any who crossed his path.~DBut, the parrot grew careless and sailed into a storm. He soon found himself staring death in the eye."], this, 1.02);				

			function aimCannon() {
				$body.click(function() { // Triggers binding of cannon rotation event
					killComments();
					nextScene(timeline.t3);
					busy = false;

					$body.on('mousemove', function(event) { // Calculate cannon rotation relative to mouse movement
						var currentY = event.clientY,
						degrees = Math.floor((mouseOrigin - currentY)*.3);

						//console.log('Origin: ' + mouseOrigin + " Current: " + currentY + " Degrees: " + degrees);
						if(mouseOrigin === undefined)
							mouseOrigin = currentY;						

						if(degrees < 50 && degrees > -60) {
							$cannonBarrelContainer.css({
								'-webkit-transform' : 'rotate('+ degrees +'deg)',
				                '-moz-transform' : 'rotate('+ degrees +'deg)',
				                '-ms-transform' : 'rotate('+ degrees +'deg)',
				            	'transform' : 'rotate('+ degrees +'deg)'
				        	});
						}
					});
				});
			}		
		}
	}

	function nextScene(subscene) { rebind($body, 'click', subscene); }

	function rebind(elem, eventType, func) {
		elem
			.unbind(eventType)
			.click(eventType, function(){
				if(!busy){
					busy = true;
					func.resume();
				}
		}); 
	}

	function getWindowSize() { windowHeight = $window.height(), windowWidth = $window.width(); }

	function killComments() { $('.commentLeft, .commentRight').remove(); }

	function killDialogue() { $dialogue.remove(); }

	function writeComment(text, master, offsetX, offsetY, direction) {
		var posX = master.position().left + offsetX,
			posY = master.position().top + offsetY;

		if (direction === "commentLeft")
			posX -=320, posY +=15;
		else if (direction == "commentRight")
			posX +=20, posY -=15;

		master.after('<div class="' + direction + '" style="left:' + posX + 'px; top:' + posY + 'px">' + text + '</div>');
	}

	function writeDialogue(text, charIndex) {
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

		if(charIndex < text.length) {
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
			} else { $dialogue.html($dialogue.html() + text[charIndex]); }			

			setTimeout(function(){ writeDialogue(text, ++charIndex) }, 40);		
		} else { busy = false; }
	}	
});