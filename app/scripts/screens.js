game.screens['credits'] = (function() {
	'use strict';

	function initialize() {
		document.getElementById('id-credits-back').addEventListener(
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