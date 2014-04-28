var input = {};
input.focus = true;

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

input.mouse = {};
input.mouse.x = 0;
input.mouse.y = 0;
input.mouse.pressedX = 0;
input.mouse.pressedY = 0;
input.mouse.lastX = 0;
input.mouse.lastY = 0;
input.mouse.movementX = 0;
input.mouse.movementY = 0;
input.mouse.lastKeycode = -1;
input.mouse.keygroup = {};
input.mouse.moveThisFrame = false;
input.mouse.debug = false;

input.mouse.addKey = function(name, keycode){
	if(!input.mouse.keygroup[name]){
		var mouseKey = [];
		mouseKey.name = name;
		mouseKey.keycode = keycode;
		mouseKey.pressed = false;
		input.mouse.keygroup[mouseKey.name] = mouseKey;
	}
}

input.mouse.popKey = function(name){
	if(input.mouse.keygroup[name]){
		input.mouse.keygroup[name] = null;
	}
}

input.mouse.press = function(x, y, keycode){
	input.mouse.x = x;
	input.mouse.y = y;
	input.mouse.lastKeycode = keycode;

	for(var key in input.mouse.keygroup){
		if(keycode == input.mouse.keygroup[key].keycode){
			input.mouse.keygroup[key].pressed = true;
			return
		}
	}
}

input.mouse.release = function(){
	for(var key in input.mouse.keygroup){
		input.mouse.keygroup[key].pressed = false;
	}
}

input.mouse.releaseAll = function(){
	for(var key in input.mouse.keygroup){
		input.mouse.keygroup[key].pressed = false;
	}
}

input.mouse.check = function(name){
	if(input.mouse.keygroup[name]){
		return input.mouse.keygroup[name].pressed
	}
}

input.mouse.checkAny = function(){
	for(var key in input.mouse.keygroup){
		if(input.mouse.keygroup[key].pressed){
			return mouseKey.keycode
		}
	}
	return -1
}

input.mouse.checkKeycode = function(){
	return lastKeycode
}

input.mouse.getClickedPosition = function(){
	return {x:input.mouse.pressedX, y:input.mouse.pressedY}
}

input.mouse.getPosition = function(){
	return {x:input.mouse.x,y:input.mouse.y}
}

input.movementHandle = function(){
	input.mouse.movementX = 0;
	input.mouse.movementY = 0;
}

window.onmousedown = function(e){
	var canvas = document.getElementById("canvas-game");
	var rect = canvas.getBoundingClientRect();

	input.mouse.pressedX = e.clientX - rect.left;
	input.mouse.pressedY = e.clientY - rect.top;

	if(input.mouse.x < canvas.width && input.mouse.x > 0 && input.mouse.y < canvas.height && input.mouse.y > 0){
		e.preventDefault();
	}

	input.mouse.press(input.mouse.pressedX, input.mouse.pressedY, e.button);

	if(input.mouse.debug === true){
		console.log("button:" +e.button +"|| x:" +input.mouse.pressedX +" || y:" +input.mouse.pressedY);
	}
}

window.onmouseup = function(e){
	input.mouse.release();
}

window.onmousemove = function(e){
	var canvas = document.getElementById("canvas-game");
	var rect = canvas.getBoundingClientRect();
	input.mouse.movedThisFrame = true;

	input.mouse.x = e.clientX - rect.left;
	input.mouse.y = e.clientY - rect.top;
	
	if(document.pointerLockElement){
		input.mouse.movementX = input.mouse.x - input.mouse.lastX;
		input.mouse.movementY = input.mouse.y - input.mouse.lastY;
		input.mouse.lastX = input.mouse.x;
		input.mouse.lastY = input.mouse.y;

	} else{
		input.mouse.movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
		input.mouse.movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
	}

	var pressed = false;
	for(var key in input.mouse.keygroup){
		if(input.mouse.keygroup[key].pressed === true){
			pressed = true;
			break
		}
	}

	if(pressed === true){
		input.mouse.pressedX = input.mouse.x;
		input.mouse.pressedY = input.mouse.y;
	}

	requestAnimationFrame(input.movementHandle);
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

input.keys = {};
input.keys.keygroup = {};
input.keys.lastKeycode = 0;
input.keys.debug = false;

input.keys.addKey = function(name, keycode){
	if(!input.keys.keygroup[name]){
		key = [];
		key.name = name;
		key.keycode = [];
		key.keycode[1] = keycode;
		key.pressed = false;
		input.keys.keygroup[key.name] = key;
	}else{
		for(var code in input.keys.keygroup[name].keycode){
			if(input.keys.keygroup[name].keycode[code] == keycode) return;
		}
		input.keys.keygroup[name].keycode[input.keys.keygroup[name].keycode.length + 1] = keycode;
	}
}

input.keys.popKey = function(name){
	if(input.keys.keygroup[name]){
		input.keys.keygroup[name] = null;
	}
}

input.keys.press = function(keycode){
	input.keys.lastKeycode = keycode;
	for(var key in input.keys.keygroup){
		for(var code in input.keys.keygroup[key].keycode){
			if(input.keys.keygroup[key].keycode[code] == keycode){
				input.keys.keygroup[key].pressed = true;
				return
			}
		}
	}
}

input.keys.release = function(keycode){
	for(var key in input.keys.keygroup){
		for(var code in input.keys.keygroup[key].keycode){
			if(input.keys.keygroup[key].keycode[code] == keycode){
				input.keys.keygroup[key].pressed = false;
				return
			}
		}
	}
}

input.keys.releaseAll = function(){
	for(var key in input.keys.keygroup){
		input.keys.keygroup[key].pressed = false;
	}
}

input.keys.check = function(name){
	if(input.keys.keygroup[name]){
		return input.keys.keygroup[name].pressed;
	}
}

input.keys.checkAny = function(){
	for(var key in input.keys.keygroup){
		if(input.keys.keygroup[key].pressed){
			return true
		}
	}
	return false
}

input.keys.checkKeycode = function(){
	return input.keys.lastKeycode;
}

input.keys.getPressedNum = function(){
	count = 0;
	for(var key in input.keys.keygroup){
		if(input.keys.keygroup[key].pressed == true) count += 1;
	}
	return count
}	

input.keys.scope = function(name){
	if(input.keys.keygroup[name]){
		return true
	}else{
		return false
	}
}

document.addEventListener("keydown", function(e){
	input.keys.press(e.keyCode);
	if(input.keys.debug) console.log(e.keyCode);
});

document.addEventListener("keyup", function(e){input.keys.release(e.keyCode)});

window.addEventListener("keydown", function(e){
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1){
        e.preventDefault();
    }
}, false);

window.onfocus = function(e){
	input.focus = true;
}

window.onblur = function(e){
	input.focus = false;
}