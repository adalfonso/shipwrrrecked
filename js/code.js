$(document).ready(function(){
	var curtainSpeed = 5000;
	$('.curtain').click(function(){
		$('#curtainBottom').animate({top : -$('#curtainBottom').height() + 100}, curtainSpeed);
		$('#curtainMiddle').animate({top : -$('#curtainMiddle').height() + 100}, curtainSpeed);
		$('#curtainTop').animate({top : -$('#curtainTop').height() + 100}, curtainSpeed);
		setTimeout(function(){
			$('#dusk').fadeOut(5000);
			$('#sun').animate({top : $(window).height()*.2}, 5000);
		}, 1000);		
	});	
});