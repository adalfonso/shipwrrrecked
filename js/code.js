$(document).ready(function(){
	var curtainSpeed = 5000,
		ebb = true;

	$('.curtain').click(function(){
		$('#curtainBottom').animate({top : -$('#curtainBottom').height() + 100}, curtainSpeed);
		$('#curtainMiddle').animate({top : -$('#curtainMiddle').height() + 100}, curtainSpeed);
		$('#curtainTop').animate({top : -$('#curtainTop').height() + 100}, curtainSpeed);
		setTimeout(function(){
			$('#dusk').fadeOut(5000);
			$('#sun').animate({top : $(window).height()*.2}, 5000);
		}, 1000);
		var waveRoll = setInterval(function(){
			if(ebb){
				var oddWaves = {left : '+=40'},
					evenWaves = {left : '-=40'};				
			} else {
				var oddWaves = {left : '-=40'},
					evenWaves = {left : '+=40'};				
			}

			ebb = !ebb;

			$('#wave1').animate(oddWaves, 1999);
			$('#wave2').animate(evenWaves, 1999);
			$('#wave3').animate(oddWaves, 1999);

		}, 2000);		
	});

	writeDialogue('Welcome to the story. This story starts off like many other ones...with a hero. Now, usually heroes are strong, brave, unrelenting anomolies to society. People that basically make us feel bad to be such slobs. Our hero however, was a major slob. Such a slob that he would graze on poutine all day long.');

	function writeDialogue(text){
		$('.dialogue').remove();
		clearInterval(keyPress);		

		var charIndex = 0;
		
		$('body').append('<div class="cfix dialogue"></div>');

		var $dialogue = $('.dialogue');

		var keyPress = setInterval(function(){
			$dialogue.text($dialogue.text() + text[charIndex]);
			charIndex++;
			console.log(text.length);
			if(charIndex >= text.length)
				clearInterval(keyPress);
		}, 50);
	}	
});