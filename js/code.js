$(document).ready(function(){
	var busy = false,
		curtainSpeed = 4,
		state = '1_0',
		$body = $('body'),
		$window = $(window),
		windowHeight,
		windowWidth;


	$body.click(function(){
		if (!busy){
			switch(state){
				case '1_0':
					scene1_0();
					break;
				case '1_1':
					scene1_1();
					break;
				default:
					break;
			}
		}
	});
		//$(this).unbind('click');

	function scene1_0(){
		busy = true;
		getWindowSize();

		var $curtainB = $('#curtainBottom'),
			$curtainM = $('#curtainMiddle'),
			$curtainT = $('#curtainTop'),
			$dialogue = $('.dialogue');
			$dusk = $('#dusk'),
			$ship = $('#shipContainer'),
			$ship2 = $('#shipContainer2'),
			$sun = $('#sun')
			$wave1 = $('#wave1'),
			$wave2 = $('#wave2'),
			$wave3 = $('#wave3');

		var curtainHeight = $curtainB.height(),
			scene1_0 = {
				timeline  : new TimelineMax(),
				waveShift : windowWidth*.1,
				waveSpeed : 4
			};

		scene1_0.timeline
			.to($curtainB, curtainSpeed, {y : -(windowHeight*.44 + curtainHeight*.75), ease: Power2.easeInOut})		 
			.to($curtainM, curtainSpeed, {y : -(windowHeight*.22 + curtainHeight*.75), ease: Power2.easeInOut}, 0)
			.to($curtainT, curtainSpeed, {y : -curtainHeight*.75, ease: Power2.easeInOut}, 0)
			.to($dusk, 4, {opacity : 0, ease:Power1.easeInOut}, 4.5)
			.to($ship, 6, {x : -windowWidth*.6, ease: Power1.easeOut}, 4)
			.to($ship, 2, {y : -windowHeight*.025, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)	
			.to($sun, 4, {y : -windowHeight*.4}, 4)
			.to($wave1, scene1_0.waveSpeed, {x : scene1_0.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)
			.to($wave2, scene1_0.waveSpeed, {x : -scene1_0.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 4)
			.to($wave3, scene1_0.waveSpeed*1.2, {x : scene1_0.waveShift, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 3.8);		
		
		setTimeout(function(){
			writeDialogue('Welcome to the story.~DThis tale begins like many other ones, with a hero. Yes, the hero is a bird pirate. His name is Captain Squawkers. No, he\'s not actually a hero. He\'s a friggin\' pirate. He robs people and stuff! Just look how he gets along with the other birds of the sea.');
			busy = false;
		}, 10000);		
		state = "1_1";
	}


	function scene1_1(){
		var $cpt = $('#cpt'),
			$egret = $('#egret');

		getWindowSize();

		$('.dialogue').remove();

		scene1_1 = { timeline : new TimelineMax() };
		scene1_1.timeline
		.to($ship2, 6, {x : windowWidth*.5, ease: Power1.easeOut})
		.to($ship2, 2, {y : -windowHeight*.025, repeat: -1, yoyo: true, ease: Power1.easeInOut}, 0)
		.call(writeComment, ["Hey, Mr. Bird! Sweet Ride!", $egret, $egret.width(), $egret.height()/9, "commentRight"], this , 7)
		.call(writeComment, ["Why, thank you... I mean, ARR!! Ye shall surrender thy vessel!", $cpt, $cpt.width()*.4, $cpt.height()*.25, "commentLeft"], this , 9);	
	}	


	function getWindowSize(){ windowHeight = $window.height(), windowWidth = $window.width(); }


	function writeComment(text, master, offsetX, offsetY, direction){
		var posX = master.position().left + offsetX,
			posY = master.position().top + offsetY;

		if (direction == "commentLeft")
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
			if(text[charIndex] == '~'){		
				switch(text[charIndex+=1]){
					case 'B':
						var specialChar = '<br>';
						break; 
						
					case 'D':
						var specialChar = '<br><br>';
						break;
					
					default:
						var specialChar = '';
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