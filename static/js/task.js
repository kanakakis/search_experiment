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
	"instructions/instruct-1a.html",
	"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	//"instructions/instruct-4.html",
	//"instructions/instruct-5.html",
	"instructions/instruct-ready.html",
	"stage.html",
	"postquestionnaire.html"
];

psiTurk.preloadPages(pages);

var instructionPages = [ // add as a list as many pages as you like
	"instructions/instruct-1.html",
	"instructions/instruct-1a.html",
	"instructions/instruct-2.html",
	//"instructions/instruct-3.html",
	//"instructions/instruct-4.html",
	//"instructions/instruct-5.html",
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
		if (metritis==13) {
			finish();
		}

		show_text_trial_number("You are currently at trial: <font color='red'> "   + metritis +  "  </font> / 20");

		if (metritis==0) {


			//var pos_left = document.getElementById("stagesvg2").offsetLeft;
			//var pos_top = document.getElementById("stagesvg2").offsetTop;

			//var pos_left2 = document.getElementById("stagesvg3").offsetLeft;
			//var pos_top2 = document.getElementById("stagesvg3").offsetTop;
    			//alert("Top: " + pos_top + " Left: " + pos_left + " Left: "+ pos_left2 + " Left: "+ pos_top2);

			//document.getElementById("question11").style.position = 'absolute';
			//document.getElementById("question11").attr('x', pos_left);
			//document.getElementById("question11").attr('y', pos_top);	

			//d3.select("#question11").attr('x', pos_left);

			show_text_instr("Please respond your initial trust, based on your previous experience with similar systems");

			document.getElementById("button1").disabled = true; 	
			document.getElementById('button1').style.visibility="hidden";	
		
			showSliderValue(document.getElementById('sliderBar').value) ; 		
			showSliderValue2(document.getElementById('sliderBar2').value) ; 

			show_q1();
			show_q2();

			show_text_next_trial ();

			metritis=metritis+1;

		}	
		else {

			

			show_text_instr ("Click the Search Button below to see the results!!");
			
			document.getElementById("button1").disabled = false; 	
			document.getElementById('button1').style.visibility="visible";	
			
			
			
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
			
			psiTurk.saveData();
			

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
		d3.select("#texttt_trialn").remove();
		d3.select("#texttt_clbut").remove();
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

		var suban11 = document.getElementById("subq11").value;
		var suban12 = document.getElementById("subq12").value;
		var suban13 = document.getElementById("subq13").value;
		

		var suban21 = document.getElementById("subq21").value;
		var suban22 = document.getElementById("subq22").value;
		var suban23 = document.getElementById("subq23").value;
		var suban24 = document.getElementById("subq24").value;

		var suban31 = document.getElementById("subq31").value;
		var suban32 = document.getElementById("subq32").value;
		var suban33 = document.getElementById("subq33").value;
		var suban34 = document.getElementById("subq34").value;
		var suban35 = document.getElementById("subq35").value;
	
		var suban41 = document.getElementById("subq41").value;
		var suban42 = document.getElementById("subq42").value;
		var suban43 = document.getElementById("subq43").value;
		var suban44 = document.getElementById("subq44").value;
		var suban45 = document.getElementById("subq45").value;	
		var suban46 = document.getElementById("subq46").value;
		var suban47 = document.getElementById("subq47").value;

		var suban51 = document.getElementById("subq51").value;
		var suban52 = document.getElementById("subq52").value;
		var suban53 = document.getElementById("subq53").value;
		var suban54 = document.getElementById("subq54").value;


		var an6 = document.getElementById("q6").value;
		var an7 = document.getElementById("q7").value;
		var an8 = document.getElementById("q8").value;
		var an9 = document.getElementById("q9").value;
		var an10 = document.getElementById("q10").value;
		var an11 = document.getElementById("q11").value;
		var an12 = document.getElementById("q12").value;
		var an13 = document.getElementById("q13").value;


		var an14 = document.getElementById("q14").value;
		var an15 = document.getElementById("q15").value;
		var an16 = document.getElementById("q16").value;
		var an17 = document.getElementById("q17").value;
		var an18 = document.getElementById("q18").value;
		var an19 = document.getElementById("q19").value;
		var an20 = document.getElementById("q20").value;
		var an21 = document.getElementById("q21").value;

		var an22 = document.getElementById("q22").value;
		var an23 = document.getElementById("q23").value;
		var an24 = document.getElementById("q24").value;
		var an25 = document.getElementById("q25").value;
		var an26 = document.getElementById("q26").value;
		var an27 = document.getElementById("q27").value;

		var an28 = document.getElementById("q28").value;
		var an29 = document.getElementById("q29").value;
		var an30 = document.getElementById("q30").value;
		var an31 = document.getElementById("q31").value;
		var an32 = document.getElementById("q32").value;
		var an33 = document.getElementById("q33").value;
		var an34 = document.getElementById("q34").value;
		var an35 = document.getElementById("q35").value;


		psiTurk.recordTrialData({'phase':met1, 'status':met2, 'suban11':suban11, 'suban12':suban12, 'suban13':suban13, 
								      'suban21':suban21, 'suban22':suban22, 'suban23':suban23, 'suban24':suban24, 
								      'suban31':suban31, 'suban32':suban32, 'suban33':suban33, 'suban34':suban34, 'suban35':suban35,
								   'suban41':suban41, 'suban42':suban42, 'suban43':suban43, 'suban44':suban44, 'suban45':suban45, 'suban46':suban46,'suban47':suban47,
								      'suban51':suban51, 'suban52':suban52, 'suban53':suban53, 'suban54':suban54,
								      'an6':an6, 'an7':an7, 'an8':an8, 'an9':an9, 'an10':an10, 'an11':an11, 'an12':an12, 'an13':an13,
								      'an14':an14, 'an15':an15, 'an16':an16, 'an17':an17, 'an18':an18, 'an19':an19, 'an20':an20, 'an21':an21,
								      'an22':an22, 'an23':an23, 'an24':an24, 'an25':an25, 'an26':an26, 'an27':an27,
								      'an28':an28, 'an29':an29, 'an30':an30, 'an31':an31, 'an32':an32, 'an33':an33, 'an34':an34, 'an35':an35});

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
