function playKeyboard(){

	let pressColor = '#1BC0EA'; //color when key is pressed


	var isMobile = !!navigator.userAgent.match(/Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile/i);
	if(isMobile) { var evtListener = ['touchstart', 'touchend']; } else { var evtListener = ['mousedown', 'mouseup']; }

	var __audioSynth = new AudioSynth();
	__audioSynth.setVolume(0.5);
	var __octave = 4; //sets position of middle C, normally the 4th octave
	

	// Key bindings, notes to keyCodes.
	var keyboard = {
			
			/* Tab */
			9: 'C,-1',

			/* 1 */
			49: 'C#,-1',

			/* q */
			81: 'D,-1',

			/* 2 */
			50: 'D#,-1',

			/* w */
			87: 'E,-1',

			/* e */
			69: 'F,-1',

			/* 4 */
			52: 'F#,-1',

			/* r */
			82: 'G,-1',

			/* 5 */
			53: 'G#,-1',

			/* t */
			84: 'A,-1',

			/* 6 */
			54: 'A#,-1',

			/* y */
			89: 'B,-1',

			/* u */
			85: 'C,0',

			/* 8 */
			56: 'C#,0',

			/* i */
			73: 'D,0',

			/* 9 */
			57: 'D#,0',

			/* o */
			79: 'E,0',

			/* p */
			80: 'F,0',

			/* - */
			189: 'F#,0',

			/* [ */
			219: 'G,0',

			/* = */
			187: 'G#,0',

			/* ] */
			221: 'A,0',

			/* Delete */
			8: 'A#,0',

			/* \ */
			220: 'B,0',

			
			/* * * Bottom line * * */

			/* Shift */
			16: 'C,1',

			/* A */
			65: 'C#,1',

			/* S */
			90: 'D,1',

			/* D */
			83: 'D#,1',

			/* F */
			88: 'E,1',

			/* G */
			67: 'F,1',

			/* H */
			70: 'F#,1',

			/* J */
			86: 'G,1',

			/* K */
			71: 'G#,1',

			/* L */
			66: 'A,1',

			/* ; */
			72: 'A#,1',

			/* " */
			78: 'B,1',
			
			/* Z */
			77: 'C,2',

			/* X */
			75: 'C#,2',

			/* C */
			188: 'D,2',

			/* V */
			76: 'D#,2',

			/* B */
			190: 'E,2',

			/* N */
			191: 'F,2',

			/* M */
			222: 'F#,2',

			/* , */
			16: 'G,2',

			/* . */
			13: 'G#,2',
		
		};
	
	var reverseLookupText = {};
	var reverseLookup = {};

	// Create a reverse lookup table.
	for(var i in keyboard) {
	
		var val;

		switch(i|0) { //some characters don't display like they are supposed to, so need correct values
		
			case 187: //equal sign
				val = 61; //???
				break;
			
			case 219: //open bracket
				val = 91; //left window key
				break;
			
			case 221: //close bracket
				val = 93; //select key
				break;
			
			case 188://comma
				val = 44; //print screen
				break;
			//the fraction 3/4 is displayed for some reason if 190 wasn't replaced by 46; it's still the period key either way
			case 190: //period
				val = 46; //delete
				break;
			
			default:
				val = i;
				break;
			
		}
	
		reverseLookupText[keyboard[i]] = val;
		reverseLookup[keyboard[i]] = i;
	
	}

	// Keys you have pressed down.
	var keysPressed = [];

	// Generate keyboard
	let visualKeyboard = document.getElementById('keyboard');
	let selectSound = {
		value: "0" //piano
	};

	var iKeys = 0;
	var iWhite = 0;
	var notes = __audioSynth._notes; //C, C#, D....A#, B

	for(var i=-2;i<=1;i++) {
		for(var n in notes) {
			if(n[2]!='b') {
				var thisKey = document.createElement('div');
				if(n.length>1) { //adding sharp sign makes 2 characters
					thisKey.className = 'black key'; //2 classes
					thisKey.style.width = '30px';
					thisKey.style.height = '120px';
					thisKey.style.left = (40 * (iWhite - 1)) + 25 + 'px';
				} else {
					thisKey.className = 'white key';
					thisKey.style.width = '40px';
					thisKey.style.height = '200px';
					thisKey.style.left = 40 * iWhite + 'px';
					iWhite++;
				}

				var label = document.createElement('div');
				label.className = 'label';

				let s = getDispStr(n,i,reverseLookupText);

				label.innerHTML = '<b class="keyLabel">' + s + '</b>' + '<br /><br />' + n.substr(0,1) +
					'<span name="OCTAVE_LABEL" value="' + i + '">' + (__octave + parseInt(i)) + '</span>' + (n.substr(1,1)?n.substr(1,1):'');
				thisKey.appendChild(label);
				thisKey.setAttribute('ID', 'KEY_' + n + ',' + i);
				thisKey.addEventListener(evtListener[0], (function(_temp) { return function() { fnPlayKeyboard({keyCode:_temp}); } })(reverseLookup[n + ',' + i]));
				visualKeyboard[n + ',' + i] = thisKey;
				visualKeyboard.appendChild(thisKey);
				
				iKeys++;
			}
		}
	}

	visualKeyboard.style.width = iWhite * 40 + 'px';

	window.addEventListener(evtListener[1], function() { n = keysPressed.length; while(n--) { fnRemoveKeyBinding({keyCode:keysPressed[n]}); } });
	

// Detect keypresses, play notes.

	var fnPlayKeyboard = function(e) {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				return false;	
			}
		}
		keysPressed.push(e.keyCode);

		if(keyboard[e.keyCode]) {
			if(visualKeyboard[keyboard[e.keyCode]]) {
				visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = pressColor;
				//visualKeyboard[keyboard[e.keyCode]].classList.add('playing'); //adding class only affects keypress and not mouse click
				visualKeyboard[keyboard[e.keyCode]].style.marginTop = '5px';
				visualKeyboard[keyboard[e.keyCode]].style.boxShadow = 'none';
			}
			var arrPlayNote = keyboard[e.keyCode].split(',');
			var note = arrPlayNote[0];
			var octaveModifier = arrPlayNote[1]|0;
			fnPlayNote(note, __octave + octaveModifier);
		} else {
			return false;	
		}
	
	}
	// Remove key bindings once note is done.
	var fnRemoveKeyBinding = function(e) {
	
		var i = keysPressed.length;
		while(i--) {
			if(keysPressed[i]==e.keyCode) {
				if(visualKeyboard[keyboard[e.keyCode]]) {
					//visualKeyboard[keyboard[e.keyCode]].classList.remove('playing');
					visualKeyboard[keyboard[e.keyCode]].style.backgroundColor = '';
					visualKeyboard[keyboard[e.keyCode]].style.marginTop = '';
					visualKeyboard[keyboard[e.keyCode]].style.boxShadow = '';
				}
				keysPressed.splice(i, 1);
			}
		}
	
	}
	// Generates audio for pressed note and returns that to be played
	var fnPlayNote = function(note, octave) {

		src = __audioSynth.generate(selectSound.value, note, octave, 2);
		container = new Audio(src);
		container.addEventListener('ended', function() { container = null; });
		container.addEventListener('loadeddata', function(e) { e.target.play(); });
		container.autoplay = false;
		container.setAttribute('type', 'audio/wav');
		container.load();
		return container;
	
	};

	//returns correct string for display
	function getDispStr(n,i,lookup) {

		if(n=='C' && i==-2){
			return "~";
		}else if(n=='B' && i==-2){
			return "-";
		}else if(n=='A#' && i==0){
			return ";";
		}else if(n=='B' && i==0){
			return "\"";
		}else if(n=='A' && i==1){
			return "/";
		}else if(n=='A#' && i==1){
			return "<-";
		}else if(n=='B' && i==1){
			return "->";
		}else{
			return String.fromCharCode(lookup[n + ',' + i]);
		}

	}
	window.addEventListener('keydown', fnPlayKeyboard);
	window.addEventListener('keyup', fnRemoveKeyBinding);
}