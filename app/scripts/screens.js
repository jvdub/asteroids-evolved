game.screens['instructions'] = (function() {
	'use strict';

	function initialize() {
		document.getElementById('id-instructions-back').addEventListener(
			'click',
			function() { game.game.showScreen('main-menu'); },
			false);
	}

	function run() {
		//
		//maybe not necessary to have this function
	}

	return {
		initialize : initialize,
		run : run
	}

}());

game.screens['high-scores'] = (function() {
	'use strict';

	function initialize() {
		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.game.showScreen('main-menu'); },
			false);
	}

	function run() {
		//
		//maybe not necessary to have this function
	}

	return {
		initialize : initialize,
		run : run
	}

}());

game.screens['options'] = (function() {
	'use strict';

	function initialize() {
		document.getElementById('id-options-back').addEventListener(
			'click',
			function() { game.game.showScreen('main-menu'); },
			false);
	}

	function run() {
		//
		//maybe not necessary to have this function
	}

	return {
		initialize : initialize,
		run : run
	}

}());

game.screens['about'] = (function() {
	'use strict';

	function initialize() {
		document.getElementById('id-about-back').addEventListener(
			'click',
			function() { game.game.showScreen('main-menu'); },
			false);
	}

	function run() {
		//
		//maybe not necessary to have this function
	}

	return {
		initialize : initialize,
		run : run
	}

}());
