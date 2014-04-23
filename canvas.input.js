var input = [];
input.focus = true;

input.mouse = [];
input.mouse.x = 0;
input.mouse.y = 0;
input.mouse.pressedx = 0;
input.mouse.pressedy = 0;
input.mouse.movementX = 0;
input.mouse.movementY = 0;
input.mouse.lastKeycode = -1;
input.mouse.keygroup = [];
input.mouse.debug = false;

input.mouse.addKey = function(name, keycode){
	if(!mouseKeyGroup[name]){
		var mouseKey = [];
		mouseKey.name = name;
		mouseKey.keycode = keycode;
		mouseKey.pressed = false;
		mouseKeyGroup[mouseKey.name] = mouseKey;
	}
}

input.mouse.popKey = function(name){
	if(mouseKeyGroup[name]){
		mouseKeyGroup[name] = null;
	}
}

input.mouse.press = function(x, y, keycode){
	input.mouse.x = x;
	input.mouse.y = y;
	input.mouse.lastKeycode = keycode;

	for(var key in input.mouse.keygroup){
		if(keycode == input.mouse.keygroup[key].keycode){
			mouseKey.pressed = true;
			return
		}
	}
}

input.mouse.release = function(){
	for(var key in input.mouse.keygroup){
		for(var code in input.mouse.keygroup[key].keycode){
			if(input.mouse.keygroup[key].keycode[code] == keycode){
				input.mouse.keygroup[key].pressed = false;
				return
			}
		}
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
	return {x:input.mouse.pressedx, y:input.mouse.pressedy}
}

input.mouse.getPosition = function(){
	return {x:input.mouse.x,y:input.mouse.y}
}

window.onmousedown = function(e){
	var canvas = document.getElementById("canvas-game");
	var rect = canvas.getBoundingClientRect();

	input.mouse.pressedx = e.clientX - rect.left;
	input.mouse.pressedy = e.clientY - rect.top;

	if(input.mouse.x < canvas.width && input.mouse.x > 0 && input.mouse.y < canvas.height && input.mouse.y > 0){
		e.preventDefault();
	}

	input.mouse.press(e.button);

	if(input.mouse.debug === true){
		console.log("button:" +e.button +"|| x:" +input.mouse.pressedx +" || y:" +input.mouse.pressedy);
	}
}

window.onmouseup = function(e){
	input.mouse.release(e.button);
}

window.onmousemove = function(e){
	var canvas = document.getElementById("canvas-game");
	var rect = canvas.getBoundingClientRect();

	input.mouse.x = e.clientX - rect.left;
	input.mouse.y = e.clientY - rect.top;
	
	var pressed = false;
	for(var key in input.mouse.keygroup){
		if(input.mouse.keygroup[key].pressed === true){
			pressed = true;
			break
		}
	}

	if(pressed === true){
		input.mouse.pressedx = input.mouse.x;
		input.mouse.pressedy = input.mouse.y;
	}

	input.mouse.movementX = e.movementX || e.mozMovementX || e.webkitMovementX || 0;
	input.mouse.movementY = e.movementY || e.mozMovementY || e.webkitMovementY || 0;
}

input.keys = [];
input.keys.keygroup = [];
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

document.addEventListener("keydown", function(e){input.keys.press(e.keyCode);if(input.keys.debug)console.log(e.keyCode);});
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