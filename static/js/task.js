/*
 * Requires:
 *     psiturk.js
 *     utils.js
 */

// Initalize psiturk object
var psiTurk = new PsiTurk(uniqueId, adServerLoc, mode);

var mycondition = condition;  // these two variables are passed by the psiturk server process
var mycounterbalance = counterbalance;  // they tell you which condition you have been assigned to
// they are not used in the stroop code but may be useful to you

// All pages to be loaded
var pages = [
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-2.html",
	"instructions/instruct-3.html",
	"instructions/instruct-ready.html"
];


/********************
* HTML manipulation
*
* All HTML files in the templates directory are requested 
* from the server when the PsiTurk object is created above. We
* need code to get those pages from the PsiTurk object and 
* insert them into the document.
*
********************/

/********************
* STROOP TEST       *
********************/
var StroopExperiment = function() {

	var wordon, // time word is presented
	    listening = false;

	

	var next = function() {
		if (metritis==3) {
			finish();
		}
		else {
			
			
			metritis_slider =0;
			metritis_slider2 =0;
			
			
			show_hdr_img(header_figure[metritis_hdr]);
			
			document.getElementById("button1").disabled = false; 
			document.getElementById("sliderBar").disabled = true; 
			document.getElementById('sliderBar').style.visibility="hidden";

			document.getElementById("sliderBar2").disabled = true; 
			document.getElementById('sliderBar2').style.visibility="hidden";
			

			
			wordon = new Date().getTime();
			
		}
	};
	
	var response_handler = function(e) {
		if (!listening) return;

		var keyCode = e.keyCode,
			response;

		switch (keyCode) {

			case 13:
				// "Enter" key
				response="zanda";
				break;
			default:
				response = "";
				break;
		}

		if (response.length>0) {
			
			//rt: counts the response time that the user remains at each experiment
			var rt = new Date().getTime() - wordon;
			var trust_response1 = document.getElementById("sliderBar").value;
			var trust_response2 = document.getElementById("sliderBar2").value;

			

			psiTurk.recordTrialData({'phase':"TEST",
                                     'word':"that",
                                     'color':"this",
                                     'relation':trust_response1,
                                     'response':response,
                                     'hit':trust_response2,
                                     'rt':rt}
                                   );

			clear_stage();
			remove_texttt();
			remove_texttt2();
			
			next();
		}
	};

	var finish = function() {
	    $("body").unbind("keydown", response_handler); // Unbind keys
	    currentview = new Questionnaire();
	};
	
	
	var clear_stage = function() {
		d3.select("#texttt_nt").remove();
		d3.select("#hdr_img").remove();
		d3.select("#imggggg").remove();
		d3.select("#imggggg4").remove();
		d3.select("#texttt_q11").remove();
		d3.select("#texttt_q12").remove();
		d3.select("#buttonnn").remove();
	};
	
	
	// Load the stage.html snippet into the body of the page
	psiTurk.showPage('stage.html');

	// Register the response handler that is defined above to handle any
	// key down events.
	$("body").focus().keydown(response_handler); 

	// Start the test
	next();

	setInterval(function () {
        	var button1 = document.getElementById("button1");
        	if (button1!=null){
        		if (button1.disabled==true){
        			listening = true;
        		}
        		if (button1.disabled==false){
        			listening = false;
        		}
       		}
        }, 50);
};


/****************
* Questionnaire *
****************/

var Questionnaire = function() {

	var error_message = "<h1>Oops!</h1><p>Something went wrong submitting your HIT. This might happen if you lose your internet connection. Press the button to resubmit.</p><button id='resubmit'>Resubmit</button>";

	record_responses = function() {

		var met1 = document.getElementById("engagement").value;
		var met2 = document.getElementById("difficulty").value;

		var an11 = document.getElementById("q11").value;
		var an12 = document.getElementById("q12").value;
		var an13 = document.getElementById("q13").value;
		

		var an21 = document.getElementById("q21").value;
		var an22 = document.getElementById("q22").value;
		var an23 = document.getElementById("q23").value;
		var an24 = document.getElementById("q24").value;

		var an31 = document.getElementById("q31").value;
		var an32 = document.getElementById("q32").value;
		var an33 = document.getElementById("q33").value;
		var an34 = document.getElementById("q34").value;
		var an35 = document.getElementById("q35").value;
	
		var an41 = document.getElementById("q41").value;
		var an42 = document.getElementById("q42").value;
		var an43 = document.getElementById("q43").value;
		var an44 = document.getElementById("q44").value;
		var an45 = document.getElementById("q45").value;	
		var an46 = document.getElementById("q46").value;
		var an47 = document.getElementById("q47").value;

		var an51 = document.getElementById("q51").value;
		var an52 = document.getElementById("q52").value;
		var an53 = document.getElementById("q53").value;
		var an54 = document.getElementById("q54").value;


		psiTurk.recordTrialData({'phase':met1, 'status':met2, 'an11':an11, 'an12':an12, 'an13':an13, 
								      'an21':an21, 'an22':an22, 'an23':an23, 'an24':an24, 
								      'an31':an31, 'an32':an32, 'an33':an33, 'an34':an34, 'an35':an35,
								      'an41':an41, 'an42':an42, 'an43':an43, 'an44':an44, 'an45':an45, 'an46':an46, 'an47':an47,
								      'an51':an51, 'an52':an52, 'an53':an53, 'an54':an54});

		$('textarea').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);
		});
		$('select').each( function(i, val) {
			psiTurk.recordUnstructuredData(this.id, this.value);		
		});

	};

	prompt_resubmit = function() {
		replaceBody(error_message);
		$("#resubmit").click(resubmit);
	};

	resubmit = function() {
		replaceBody("<h1>Trying to resubmit...</h1>");
		reprompt = setTimeout(prompt_resubmit, 10000);
		
		psiTurk.saveData({
			success: function() {
			    clearInterval(reprompt); 
                psiTurk.computeBonus('compute_bonus', function(){finish()}); 
			}, 
			error: prompt_resubmit
		});
	};

	// Load the questionnaire snippet 
	psiTurk.showPage('postquestionnaire.html');
	psiTurk.recordTrialData({'phase':'postquestionnaire', 'status':'begin'});
//, 'status2':'begin2'
	
	$("#next").click(function () {
	    record_responses();
	    psiTurk.saveData({
            success: function(){
                psiTurk.computeBonus('compute_bonus', function() { 
                	psiTurk.completeHIT(); // when finished saving compute bonus, the quit
                }); 
            }, 
            error: prompt_resubmit});
	});
    
	
};

// Task object to keep track of the current phase
var currentview;

/*******************
 * Run Task
 ******************/
$(window).load( function(){
    psiTurk.doInstructions(
    	instructionPages, // a list of pages you want to display in sequence
    	function() { currentview = new StroopExperiment(); } // what you want to do when you are done with instructions
    );
});
