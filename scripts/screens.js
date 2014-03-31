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

    var scoreList;

	function showScores(scores) {
	    var html = '',
	        i = 0,
	        l = 0;

	    scores.sort(function (a, b) {
	        return b.score - a.score;
	    });

	    for (i = 0, l = scores.length; i < 10 && i < l; ++i) {
	        html += '<li>' + scores[i].score + ' - ' + scores[i].name + '</li>';
	    }

	    scoreList.innerHTML = html;
	}

	function initialize() {
	    scoreList = document.getElementById('scores-list');

		document.getElementById('id-high-scores-back').addEventListener(
			'click',
			function() { game.game.showScreen('main-menu'); },
			false);
	}

	function run() {
	    // Make request to get high scores
	    $.ajax({
	    	url: '/v1/high-scores',
	    	type: 'GET',
	    	success: function (rslt) {
	    		console.log(rslt);
	            showScores(rslt);
	    	},
	    	error: function () {
		        // There was a connection error of some sort
		        console.log(this.status + this.statusText);
	    	},
	    	dataType: 'json'
	    });
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
		initialize: initialize,
		run: run
	};
}());

game.screens['game-over'] = (function() {
	'use strict';

	var myKeyboard = game.input.Keyboard(),
		eles = {
			score: null,
			name: null
		};

	function initialize() {
		eles.score = document.getElementById('playerScore');
		eles.name = document.getElementById('playerName');

		document.getElementById('addScore').addEventListener('click', function() {
			if (eles.name.value != '') {
				game.screens['high-scores'].run();

				$.ajax({
	                url: '/v1/high-scores',
	                type: 'POST',
	                data: {
	                    name: eles.name.value,
	                    score: +game.score
	                },
	                dataType: 'json'
	            });

	            game.score = 0;

	            // Show the high scores page
	            // Possibly replace this with an intermediary page or something
	            // to say game over and enter player name to add to high scores?
	            game.game.showScreen('high-scores');
	        }
		}, false);
	}

	function run() {
		myKeyboard.registerCommand(KeyEvent.DOM_VK_SPACE, function (e) { e.stopPropagation(); e.preventDefault(); });
		eles.score.innerHTML = game.score;
	}

	return {
		initialize: initialize,
		run: run
	};
}());