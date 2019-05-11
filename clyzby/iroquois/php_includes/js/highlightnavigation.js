$(document).ready(function(){
	// console.log("Ready!");
	var mybodyid = $('body').attr('id');
	var mynavid = '#nav' + mybodyid;
	// console.log("mybodyid is " + mybodyid);
	// console.log("mynavid is " + mynavid);
	$(mynavid).attr('id','iamhere');
});