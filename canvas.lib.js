
/*
	88b           d88                       88
	888b         d888                ,d     88
	88`8b       d8'88                88     88
	88 `8b     d8' 88  ,adPPYYba,  MM88MMM  88,dPPYba,
	88  `8b   d8'  88  ""     `Y8    88     88P'    "8a
	88   `8b d8'   88  ,adPPPPP88    88     88       88
	88    `888'    88  88,    ,88    88,    88       88
	88     `8'     88  `"8bbdP"Y8    "Y888  88       88
*/

// Extension of math constants.
Math.PI_2 = Math.PI / 2;
Math.TAU = Math.PI * 2;

// Returns a random integer in a specified range.
Math.randomRange = function(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Randomly returns -1 or 1.
var numArray = [-1, 1];
Math.randNonNull = function() {
	return numArray[Math.randomRange(0, 1)];
}

// Returns a random floating point number with in a range with a specified decimal count.
Math.randomRangeFloat = function(a, b, decimal) {
	var value_a = 1;
	var value_b = 1;

	if(a != 0) {
		value_a = a / a;

	} else {
		value_a = 1;
	}

	if(b != 0) {
		value_b = b / b;

	} else {
		value_b = 1;
	}

	if(decimal) {
		return Math.randomRange(a * Math.pow(10, decimal) * value_a, b * (10 * decimal) * value_b) / Math.pow(10, decimal);

	} else {
		return Math.randomRange(a * Math.pow(10, 5) * value_a, b * Math.pow(10, 5) * value_b) / Math.pow(10, 5);
	}
}

// Round a number to a certain decimal point.
Math.round = function(num, idp) {
	var mult = Math.pow(10, (idp || 0));
	return Math.floor(num * mult + 0.5) / mult;
}

// Clamp a value between a minimum and maximum value.
Math.clamp = function(num, min, max) {
	return Math.max(min, Math.min(num, max));
}

// Keep a value in a certain range but make it loop through the range if it passed one of the range values.
Math.cycle = function(num, min, max) {
	var tick = 0;

	while(num < min || num > max && tick < 10) {
		tick++;

		if(num < min && min < max) {
			var dist = min - num;
			num = max - dist;

		} else if(num > max && max > min) {
			var dist = max - num;
			num = min + dist;
		}

		if(tick == 10) {
			return Math.clamp(num, min, max);
		}
	}
	return num;
}

// Linear interpolation.
Math.lerp = function(num, endNum, t) {
	return num + (endNum - num) * t;
}

// Step interpolation.
Math.step = function(num, endNum, s) {
	if(endNum < num) {
		num = Math.max(num - s, endNum);

	} else {
		num = Math.min(num + s, endNum);
	}

	return num
}

// Perform linear interpolation with a degree based angle and clamp it's values.
Math.lerpDeg = function(angle, endAngle, t) {
	var difference = Math.abs(endAngle - angle);

	if(difference > 180) {
		if(endAngle > angle) {
			angle += 360;

		} else {
			endAngle += 360;
		}
	}

	var value = angle + (endAngle - angle) * t;
	var rangeZero = 360;

	if(value >= 0 && value <= 360) {
		return value;

	} else {
		return value % rangeZero;
	}
}

// Perform linear interpolation with a radian angle and clamp it's values.
Math.lerpRad = function(angle, endAngle, t) {
	var difference = Math.abs(endAngle - angle)

	if(difference > Math.PI) {
		if(endAngle > angle) {
			angle = angle + (Math.PI * 2);

		} else {
			endAngle = endAngle + (Math.PI * 2);
		}
	}

	var value = angle + (endAngle - angle) * t;
	var rangeZero = (Math.PI * 2);

	if(value >= 0 && value <= (Math.PI * 2)) {
		return value;

	} else {
		return value % rangeZero;
	}
}

// Convert radians to degrees.
Math.deg = function(rad) {
	return rad * (180 / Math.PI);
}

// Convert degrees to radians.
Math.rad = function(deg) {
	return deg * (Math.PI / 180);
}

// Return a percentage based value of two numbers.
Math.percent = function(startNum, endNum, percent) {
	if(percent > 100 || percent < 0) {
		percent = Math.clamp(percent, 0, 100);
	}

	num = (startNum * (percent)) + (endNum - endNum * (percent))

	return num
}

/*
	88888888888           88  88
	88                    88  88
	88                    88  88
	88aaaaa  88       88  88  88  ,adPPYba,   ,adPPYba,  8b,dPPYba,   ,adPPYba,   ,adPPYba,  8b,dPPYba,
	88"""""  88       88  88  88  I8[    ""  a8"     ""  88P'   "Y8  a8P_____88  a8P_____88  88P'   `"8a
	88       88       88  88  88   `"Y8ba,   8b          88          8PP"""""""  8PP"""""""  88       88
	88       "8a,   ,a88  88  88  aa    ]8I  "8a,   ,aa  88          "8b,   ,aa  "8b,   ,aa  88       88
	88        `"YbbdP'Y8  88  88  `"YbbdP"'   `"Ybbd8"'  88           `"Ybbd8"'   `"Ybbd8"'  88       88
*/

var fullscreen = {}; // Main object containing the fullscreen helper methods.
fullscreen.currentElement; // The current element requesting fullscreen to be enabled.
fullscreen.currentCallback; // The callback to be fired when fullscreen is activated/deactivated.
fullscreen.pointerlock = false; // Tracks if the point is to be locked while fullscreen mode is enabled.

var fullscreenDebug = false; // Debug variable. Set to true if errors should be printed to the console.

// Check if fullscreen is currently available.
fullscreen.available = function() {
	if(document.documentElement.requestFullscreen || document.documentElement.mozCancelFullScreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen) {
		return true;

	} else {
		return false;
	}
}

// Check if fullscreen mode is currently active.
fullscreen.activated = function() {
	if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement) {
		return true;
	} else {
		return false;
	}
}

// Request to enter fullscreen mode from a certain context element.
fullscreen.request = function(element) {
	element = element || document.documentElement;

	if(element.requestFullscreen) {
		element.requestFullscreen();

	} else if(element.mozRequestFullScreen) {
		element.mozRequestFullScreen();

	} else if(element.webkitRequestFullscreen) {
		element.webkitRequestFullscreen();

	} else if(element.msRequestFullscreen) {
		element.msRequestFullscreen();
	}

	currentElement = element;

	if(fullscreen.currentCallback) fullscreen.currentCallback(true);
}

// Force exit fullscreen mode.
fullscreen.cancel = function() {
	if(document.exitFullscreen) {
		document.exitFullscreen();

	} else if(document.mozCancelFullScreen) {
		document.mozCancelFullScreen();

	} else if(document.webkitExitFullscreen) {
		document.webkitExitFullscreen();
	}

	currentElement = null;

	if(fullscreen.currentCallback) fullscreen.currentCallback(false);
}

// Toggle fullscreen mode and assign a fullscreen callback. Also inform the system if it is to pointerlock. 
fullscreen.toggle = function(element, pointerlock, callback) {
	if(fullscreen.available() == true) {
		if(fullscreen.activated() == false) {
			if(callback) {
				fullscreen.currentCallback = callback;
			}

			fullscreen.request(element);

			pointerlock = pointerlock || false;

			if(pointerlock === true) {
				if(document.webkitFullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element) {
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
					element.requestPointerLock();
				}
			}

		} else {
			fullscreen.cancel();

			if(callback) {
				fullscreen.currentCallback = null;
			}
		}
	}
}

// Register all required listeners and activate the module.
fullscreen.register = function() {

	// Execute the fullscreen assigned callback if there is a change in state.
	function changeCallback() {
		if(document.webkitFullscreenElement || document.mozFullscreenElement || document.mozFullScreenElement) {
			if(fullscreen.currentCallback) fullscreen.currentCallback(true);

		} else {
			if(fullscreen.currentCallback) fullscreen.currentCallback(false);
		}
	}

	// Assign listeners to handle fullscreen changes.
	document.addEventListener('fullscreenchange', changeCallback, false);
	document.addEventListener('mozfullscreenchange', changeCallback, false);
	document.addEventListener('webkitfullscreenchange', changeCallback, false);

	// Handle pointer lock changes.
	function pointerLockChange() {
		if(fullscreenDebug === true) {
			if(document.mozPointerLockElement || document.webkitPointerLockElement) {
				console.log("Pointer Lock was successful.");
				
			} else {
				console.log("Pointer Lock was lost.");
			}
		}
	}

	// Assign the pointer lock listeners.
	document.addEventListener('pointerlockchange', pointerLockChange, false);
	document.addEventListener('mozpointerlockchange', pointerLockChange, false);
	document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

	// Handle errors if there was an issue with activating or deactivating pointer lock mode.
	function pointerLockError() {
		if(fullscreenDebug === true) {
			console.log("Error while locking pointer.");
		}
	}

	// Assign pointer lock error listeners.
	document.addEventListener('pointerlockerror', pointerLockError, false);
	document.addEventListener('mozpointerlockerror', pointerLockError, false);
	document.addEventListener('webkitpointerlockerror', pointerLockError, false);
}

/*
	  ,ad8888ba,                88  88  88             88
	 d8"'    `"8b               88  88  ""             ""
	d8'                         88  88
	88              ,adPPYba,   88  88  88  ,adPPYba,  88   ,adPPYba,   8b,dPPYba,
	88             a8"     "8a  88  88  88  I8[    ""  88  a8"     "8a  88P'   `"8a
	Y8,            8b       d8  88  88  88   `"Y8ba,   88  8b       d8  88       88
	 Y8a.    .a8P  "8a,   ,a8"  88  88  88  aa    ]8I  88  "8a,   ,a8"  88       88
	  `"Y8888Y"'    `"YbbdP"'   88  88  88  `"YbbdP"'  88   `"YbbdP"'   88       88
*/

var collision = {}; // Main object containing the collision methods.

// Perform basic collision between two three dimensional boxes (a, b).
collision.box = function(ax1, ay1, az1, aw, ah, ad, bx1, by1, bz1, bw, bh, bd) {
	var ax2 = ax1 + aw;
	var ay2 = ay1 + ah;
	var az2 = az1 + ad;
	var bx2 = bx1 + bw;
	var by2 = by1 + bh;
	var bz2 = bz1 + bd;

	return(ax1 < bx2 &&
		ax2 > bx1 &&
		ay1 < by2 &&
		ay2 > by1 &&
		az1 < bz2 &&
		az2 > bz1
	);
}

// Same as collision.box but takes in formatted vector objects instead of a huge list of arguments.
collision.boxHelper = function(aPosition, aScale, bPosition, bScale) {
	return(
		collision.box(
			aPosition.x - aScale.x / 2,
			aPosition.y - aScale.y / 2,
			aPosition.z - aScale.z / 2,
			aScale.x,
			aScale.y,
			aScale.z,
			bPosition.x - bScale.x / 2,
			bPosition.y - bScale.y / 2,
			bPosition.z - bScale.z / 2,
			bScale.x,
			bScale.y,
			bScale.z
		)
	);
}


var input = {}; // Main object containing all input related functions and systems.
var focused = true; // This variable is true if the current input context is focused by the user.

/*
	88b           d88
	888b         d888
	88`8b       d8'88
	88 `8b     d8' 88   ,adPPYba,   88       88  ,adPPYba,   ,adPPYba,
	88  `8b   d8'  88  a8"     "8a  88       88  I8[    ""  a8P_____88
	88   `8b d8'   88  8b       d8  88       88   `"Y8ba,   8PP"""""""
	88    `888'    88  "8a,   ,a8"  "8a,   ,a88  aa    ]8I  "8b,   ,aa
	88     `8'     88   `"YbbdP"'    `"YbbdP'Y8  `"YbbdP"'   `"Ybbd8"'
*/

input.mouse = {}; // Main mouse input handing object. Contains all mouse related variables.
input.mouse.x = 0, input.mouse.y = 0; // Current mouse position.
input.mouse.pressedX = 0, input.mouse.pressedY = 0; // The current pressed position.
input.mouse.lastX = 0, input.mouse.lastY = 0; // The last pressed mouse position.
input.mouse.movementX = 0, input.mouse.movementY = 0; // Mouse movement deltas.
input.mouse.moveThisFrame = false; // If true the mouse was move since the last frame.

var mouseGroup = {}; // Object containing button relations defined by the user.
var mouseDebug = false; // If true the mouse system will print errors as they arise.
var mouseButton = -1; // The last used mouse button.

// Add a new mouse button assignment to the input system. Keycode stands for the button to be tracked.
input.mouse.add = function(name, button) {
	if(!mouseGroup[name]) {
		var mouseKey = [];
		mouseKey.name = name;
		mouseKey.button = button;
		mouseKey.pressed = false;
		mouseKey.callbacks = [];
		mouseGroup[mouseKey.name] = mouseKey;
	}
}

// Remove a mouse button from the input system by it's name.
input.mouse.pop = function(name) {
	if(mouseGroup[name]) {
		mouseGroup[name] = null;
	}
}

// Register a mouse button press to the system and pass the required arguments.
input.mouse.press = function(x, y, button) {
	// Update the positions and set the latest button.
	input.mouse.x = x;
	input.mouse.y = y;
	mouseButton = button;

	// Go through the list of keys and check if any of them need to be flagged as pressed.
	for(var name in mouseGroup) {
		if(button == mouseGroup[name].button) {
			mouseGroup[name].pressed = true;

			// If the button is pressed we should execute all registered callbacks.
			for(var callback in mouseGroup[name].callbacks) {
				callback(x, y); // Pass the pressed position to the callback.
			}
		}
	}
}

// Notify a mouse button that it is to be released.
input.mouse.release = function(button) {
	for(var name in mouseGroup) {
		if(button == mouseGroup[name].button) {
			mouseGroup[name].pressed = false;
		}
	}
}

// Release all mouse keys at the same time.
input.mouse.releaseAll = function() {
	for(var button in mouseGroup) {
		mouseGroup[button].pressed = false;
	}
}

// Return a specified button's pressed state.
input.mouse.check = function(name) {
	if(mouseGroup[name]) {
		return mouseGroup[name].pressed;
	}
}

// Return a keycode for the first button to be pressed in the mouse keygroup.
input.mouse.checkAny = function() {
	for(var button in mouseGroup) {
		if(mouseGroup[button].pressed) {
			return mouseKey.keycode;
		}
	}

	return -1 // Return an out of bounds value if no button is pressed.
}

// Return the last keycode passed to the system.
input.mouse.checkKeycode = function() {
	return mouseKeycode
}

// Get the number of mouse buttons currently pressed.
input.mouse.getPressedNum = function() {
	count = 0;
	for(var button in mouseGroup) {
		if(mouseGroup[button].pressed == true) count += 1;
	}
	return count
}

// Return the current mouse position as formatted object.
input.mouse.getPosition = function() {
	return {
		x: input.mouse.x,
		y: input.mouse.y
	}
}

// Returns the last clicked position as a formatted object containing the x and y values.
input.mouse.getClickedPosition = function() {
	return {
		x: input.mouse.pressedX,
		y: input.mouse.pressedY
	}
}

// Register the mouse button system's document and window callbacks. 'c' is the current context element to track.
// This needs to be called to actually activate the mouse input system.
input.mouse.register = function(c) {

	var context = document.getElementById(c);

	// Handle mouse presses within the browser.
	onMouseDown = function(e) {
		var surface = document.getElementById(c) || document.documentElement;;
		var rect = surface.getBoundingClientRect();

		input.mouse.pressedX = e.clientX - rect.left;
		input.mouse.pressedY = e.clientY - rect.top;

		if(input.mouse.x < surface.width && input.mouse.x > 0 && input.mouse.y < surface.height && input.mouse.y > 0) {
			e.preventDefault();
		}

		input.mouse.press(input.mouse.pressedX, input.mouse.pressedY, e.button);

		if(input.mouse.debug === true) {
			console.log("button:" + e.button + "|| x:" + input.mouse.pressedX + " || y:" + input.mouse.pressedY);
		}
	}

	onMouseUp = function(e) {
		input.mouse.release(e.button);
	}

	onMouseMove = function(e) {
		var surface = document.getElementById(c) || document.documentElement;
		var rect = surface.getBoundingClientRect();
		input.mouse.movedThisFrame = true;

		// Set the new mouse position.
		input.mouse.x = e.clientX - rect.left;
		input.mouse.y = e.clientY - rect.top;

		// Fetch the mouse movement from the current event if available.
		input.mouse.movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		input.mouse.movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;

		// Check if any keys are currently pressed.
		var pressed = false;
		for(var button in mouseGroup) {
			if(mouseGroup[button].pressed === true) {
				pressed = true;
				break
			}
		}

		// Update the pressed position if there still is a pressed button.
		if(pressed === true) {
			input.mouse.pressedX = input.mouse.x;
			input.mouse.pressedY = input.mouse.y;
		}

		// Reset the movement deltas to avoid additional mouse movement.
		requestAnimationFrame(
			function() {
				input.mouse.movementX = 0;
				input.mouse.movementY = 0;
			}
		);
	}

	document.addEventListener('mousedown', onMouseDown, false);
	document.addEventListener('mouseup', onMouseUp, false);
	document.addEventListener('mousemove', onMouseMove, false);
}

/*
	88      a8P                           88                                                         88
	88    ,88'                            88                                                         88
	88  ,88"                              88                                                         88
	88,d88'       ,adPPYba,  8b       d8  88,dPPYba,    ,adPPYba,   ,adPPYYba,  8b,dPPYba,   ,adPPYb,88
	8888"88,     a8P_____88  `8b     d8'  88P'    "8a  a8"     "8a  ""     `Y8  88P'   "Y8  a8"    `Y88
	88P   Y8b    8PP"""""""   `8b   d8'   88       d8  8b       d8  ,adPPPPP88  88          8b       88
	88     "88,  "8b,   ,aa    `8b,d8'    88b,   ,a8"  "8a,   ,a8"  88,    ,88  88          "8a,   ,d88
	88       Y8b  `"Ybbd8"'      Y88'     8Y"Ybbd8"'    `"YbbdP"'   `"8bbdP"Y8  88           `"8bbdP"Y8
								 d8'
								d8'
*/

input.keyboard = {}; // Central object containing keyboard input related methods.

var keyGroup = {}; // Object containing all registered keys.
var keyboardDebug = false; // If true the system will output errors to the console.
var keyboardKeycode = 0; // Variable containing the last keyboard keycode supplied to the system.

// Add a new key assignment to the input system. Keycode stands for the key to be tracked.
input.keyboard.add = function(name, keycode) {
	if(!keyGroup[name]) {
		key = [];
		key.name = name;
		key.keycode = [];
		key.keycode[1] = keycode;
		key.pressed = false;
		key.callbacks = [];

		keyGroup[key.name] = key;

	} else {
		for(var code in keyGroup[name].keycode) {
			if(keyGroup[name].keycode[code] == keycode) return;
		}

		keyGroup[name].keycode[keyGroup[name].keycode.length + 1] = keycode;
	}
}

// Remove a registered key by it's name.
input.keyboard.pop = function(name) {
	if(keyGroup[name]) {
		keyGroup[name] = null;
	}
}

// Add a callback to a specified key which will be fired when it is pressed.
input.keyboard.addCallback = function(name, callbackname, callback) {
	if(keyGroup[name]) {
		if(!keyGroup[name].callbacks[callbackname]) {
			keyGroup[name].callbacks[callbackname] = callback;
		}
	}
}

// Pop a callback from a given key.
input.keyboard.popCallback = function(name, callbackname) {
	if(keyGroup[name]) {
		if(keyGroup[name].callbacks[callbackname]) {
			keyGroup[name].callbacks[callbackname] = null;
		}
	}
}

// Notify all keys with a certain keycode that they are pressed.
input.keyboard.press = function(keycode) {
	keyboardKeycode = keycode;
	for(var key in keyGroup) {
		for(var code in keyGroup[key].keycode) {
			if(keyGroup[key].keycode[code] == keycode) {
				keyGroup[key].pressed = true;

				for(var callback in keyGroup[key].callbacks) {
					keyGroup[key].callbacks[callback]();
				}
			}
		}
	}
}

// Release a certain key.
input.keyboard.release = function(keycode) {
	for(var key in keyGroup) {
		for(var code in keyGroup[key].keycode) {
			if(keyGroup[key].keycode[code] == keycode) {
				keyGroup[key].pressed = false;
			}
		}
	}
}

// Release all registered keys.
input.keyboard.releaseAll = function() {
	for(var key in keyGroup) {
		keyGroup[key].pressed = false;
	}
}

// Check if a given key is pressed.
input.keyboard.check = function(name) {
	if(keyGroup[name]) {
		return keyGroup[name].pressed;
	}
}

// Check if any of the registered keys is pressed.
input.keyboard.checkAny = function() {
	for(var key in keyGroup) {
		if(keyGroup[key].pressed) {
			return true
		}
	}
	return false
}

// Return the last pressed keycode.
input.keyboard.checkKeycode = function() {
	return keyboardKeycode;
}

// Retrieve the amount of keys currently pressed.
input.keyboard.getPressedNum = function() {
	count = 0;
	for(var key in keyGroup) {
		if(keyGroup[key].pressed == true) count += 1;
	}
	return count
}

// Returns true if a key with the specified name is registered.
input.keyboard.scope = function(name) {
	if(keyGroup[name]) {
		return true
	} else {
		return false
	}
}

// Check if the current input context is focused.
input.isFocused = function() {
	return focused;
}

// Register the keyboard input system's document and window callbacks.
// This needs to be called to actually activate the keyboard input system.
input.keyboard.register = function() {

	// Register listeners for keyboard events.
	document.addEventListener("keydown", function(e) {
		input.keyboard.press(e.keyCode);
		if(keyboardDebug) console.log(e.keyCode);
	});

	document.addEventListener("keyup", function(e) {
		input.keyboard.release(e.keyCode)
	});

	window.addEventListener("keydown", function(e) {
		if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
			e.preventDefault();
		}
	}, false);

	// Set the focus methods.
	window.onfocus = function(e) {
		focused = true;
	}

	window.onblur = function(e) {
		focused = false;
	}
}