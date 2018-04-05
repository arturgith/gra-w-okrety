var view = {
	displayMessage: function(msg) {
		var messageArea = document.getElementById("messageArea");
		messageArea.innerHTML = msg;
	},
	displayHit: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "hit");
	},
	displayMiss: function(location) {
		var cell = document.getElementById(location);
		cell.setAttribute("class", "miss");
	}
};
/*
view.displayMiss("00");
view.displayHit("34");
view.displayMiss("55");
view.displayHit("12");
view.displayMiss("25");
view.displayHit("26");

view.displayMessage("Halo halo");
*/
var model = {
	boardSize: 7,
	numShips: 3,
	shipLength: 3,
	shipsSunk: 0,
    ships: [{ locations: [0, 0, 0], hits: ["", "", ""] },
			{ locations: [0, 0, 0], hits: ["", "", ""] },
			{ locations: [0, 0, 0], hits: ["", "", ""] }
	],
	fire: function(guess) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			//var locations = ship.locations;
			//var index = locations.indexOf(guess);
			var index = ship.locations.indexOf(guess);
			if (index >= 0) {
				ship.hits[index] = "hit";
				view.displayHit(guess);
				view.displayMessage("TRAFIONY!");

				if (this.isSunk(ship)) {
					view.displayMessage("Zatopiłeś mój okręt!");
					this.shipsSunk++;
				}
				return true;
			}
		}
		view.displayMiss(guess);
		view.displayMessage("Spudłowałeś.");
		return false;
	},

	isSunk: function(ship) {
		for (var i = 0; i < this.shipLength; i++) {
		     if (ship.hits[i] !== "hit") {
		     	return false;
		     }
		}
		return true;
	},

	generateShipLocations: function() {
		var locations;
		for (var i = 0; i < this.numShips; i++) {
			do {
				locations = this.generateShip();
			} while (this.collision(locations));
			this.ships[i].locations = locations;
		}
	},

	generateShip: function() {
		var direction = Math.floor(Math.random() * 2);
		var row, col;
		if (direction === 1) {
			//Generujemy pole poczatkowe okrętu w ukadzie poziomym.
			//Przyjmujemy, że jeżeli zmienna dirction ma wartość 1 okręt będzie umieszczony w poziomie
			row = Math.floor(Math.random() * this.boardSize);
			col = Math.floor(Math.random() * (this.boardSize - this.shipLength));
		} else {
			//Generujemy pole poczatkowe okrętu w ukadzie pionowym.
			//... a jeżeli zmienna direction bedzie mieć wartość 0 okręt będzie rozmieszczony w pionie.
			row = Math.floor(Math.random() * (this.boardSize - this.shipLength));
			col = Math.floor(Math.random() * this.boardSize);
		}

		var newShipLocations = [];
		for (var i = 0; i < this.shipLength; i++) {
			if (direction === 1) {
				//Dodajemy do tablicy pola okrętu w układzie poziomym.
				newShipLocations.push(row + "" + (col + i));
			} else {
				//Dodajemy do tablicy pola okrętu w układzie pionowym.
				newShipLocations.push((row + i) + "" + col);
			}
		}
		//Po wygenerowaniu wszystkich pól zwracamy tablicę.
		return newShipLocations;
		//model.collision();
	},

	collision: function(locations) {
		for (var i = 0; i < this.numShips; i++) {
			var ship = this.ships[i];
			for (var j = 0; j < locations.length; j++) {
				if (ship.locations.indexOf(locations[j]) >= 0) {
					return true;
				}
			}
		}
		return false;
	}
};
/*
model.fire("00");
model.fire("06");
model.fire("16");
model.fire("26");
*/
function parseGuess(guess) {
	var alphabet = ["A", "B", "C", "D", "E", "F", "G"];

	if (guess === null || guess.length !== 2) {
		alert("Ups, proszę wpisać literę i cyfrę.");
	} else {
		firstChar = guess.charAt(0);
		var row = alphabet.indexOf(firstChar);
		var column = guess.charAt(1);

		if (isNaN(row) || isNaN(column)) {
			alert("Ups, to nie sa wspłrzędne!");
		} else if (row < 0 || row >= model.boardSize || column < 0 || column >= model.boardSize) {
			alert("Ups, pole poza plansza");
		}else {
			return row + column;
		}
	}
	return null;
}
/*
console.log(parseGuess("A0"));
console.log(parseGuess("B6"));
console.log(parseGuess("H0"));
*/


var controller = {
	guesses: 0,

	processGuess: function(guess) {
		var location = parseGuess(guess);
		if (location) {
			this.guesses++;
			var hit = model.fire(location);
			if (hit && model.shipsSunk === model.numShips) {
				view.displayMessage("zatopiłeś wszytskie moje okręty, w " + this.guesses + " próbach.");
			}
		}
	}
}
/*
controller.processGuess("A0");
controller.processGuess("A6");
controller.processGuess("B6");
controller.processGuess("C6");
controller.processGuess("C4");
controller.processGuess("D4");
controller.processGuess("E4");
controller.processGuess("B0");
controller.processGuess("B1");
controller.processGuess("B2");
*/

function init() {
	var fireButton = document.getElementById("fireButton");
	fireButton.onclick = handleFireButton;

	var guessInput = document.getElementById("guessInput");
	guessInput.onkeypress = handleKeyPress;

	model.generateShipLocations();
}

function handleFireButton() {
	var guessInput = document.getElementById("guessInput");
	var guess = guessInput.value.toUpperCase();

	controller.processGuess(guess);

	guessInput.value = "";
}

function handleKeyPress(e) {
	var fireButton = document.getElementById("fireButton");
	if (e.keyCode === 13) {
		fireButton.click();
		return false;
	}
}

window.onload = init;










