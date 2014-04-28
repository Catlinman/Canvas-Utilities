
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

var numArray = [-1, 1];
Math.PI_2 = Math.PI / 2;
Math.TAU = Math.PI * 2;

Math.randomRange = function(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

Math.randNonNull = function(){
	return numArray[Math.randomRange(0,1)];
}

Math.randomRangeFloat = function(a, b, decimal){
	var value_a = 1;
	var value_b = 1;

	if(a != 0){
		value_a = a / a;
	}else{
		value_a = 1;
	}

	if(b != 0){
		value_b = b / b;
	}else{
		value_b = 1;
	}

	if(decimal){
		return Math.randomRange(a * Math.pow(10,decimal) * value_a, b * (10 * decimal) * value_b) / Math.pow(10,decimal);
	}else{
		return Math.randomRange(a * Math.pow(10,5) * value_a, b * Math.pow(10,5) * value_b) / Math.pow(10,5);
	}
}

Math.round = function(num, idp){
	var mult = Math.pow(10,(idp || 0));
	return Math.floor(num * mult + 0.5) / mult;
}

Math.clamp = function(num, min, max){
	return Math.max(min, Math.min(num, max));
}

Math.cycle = function(num, min, max){
	var tick = 0;

	while(num < min || num > max && tick < 10){
		tick++;

		if(num < min && min < max){
			var dist = min - num;
			num = max - dist;
		}else if(num > max && max > min){
			var dist = max - num;
			num = min + dist;
		}

		if(tick == 10){
			return Math.clamp(num, min, max);
		}
	}
	return num;
}

Math.lerp = function(num, endNum, t){
	return num + (endNum - num) * t;
}

Math.step = function(num, endNum, s){
	if(endNum < num){
		num = Math.max(num - s, endNum);
	}else{
		num = Math.min(num + s, endNum);
	}
	return num
}

Math.percent = function(startNum, endNum, percent){
	if(percent > 100 || percent < 0){
		percent = Math.clamp(percent, 0, 100);
	}

	num = (startNum * (percent)) + (endNum - endNum * (percent))

	return num
}

Math.lerpDeg = function(angle, endAngle, t){
	var difference = Math.abs(endAngle - angle);

    if(difference > 180){
        if(endAngle > angle){
            angle += 360;
        }else{
        	endAngle += 360;
        }
    }

	var value = angle + (endAngle - angle) * t;
	var rangeZero = 360;

	if(value >= 0 && value <= 360){
		return value;
	}else{
		return value % rangeZero;
	}
}

Math.lerpRad = function(angle, endAngle, t){
	var difference = Math.abs(endAngle - angle)

    if(difference > Math.PI){
        if(endAngle > angle){
            angle = angle + (Math.PI * 2);
        }else{
        	endAngle = endAngle + (Math.PI * 2);
        }
    }

	var value = angle + (endAngle - angle) * t;
	var rangeZero = (Math.PI * 2);

	if(value >= 0 && value <= (Math.PI * 2)){
		return value;
	}else{
		return value % rangeZero;
	}
}

Math.deg = function(rad){
 	return rad * (180 / Math.PI);
}

Math.rad = function(deg){
	return deg * (Math.PI / 180);
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

var fullscreen = {};
fullscreen.currentElement;
fullscreen.currentCallback;
fullscreen.pointerlock = false;
fullscreen.debug = false;

fullscreen.available = function(){
	if(document.documentElement.requestFullscreen || document.documentElement.mozCancelFullScreen || document.documentElement.webkitRequestFullscreen || document.documentElement.msRequestFullscreen){
		return true;
	} else{
		return false;
	}
}

fullscreen.activated = function(){
	if(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement){
		return true;
	} else{
		return false;
	}
}

fullscreen.request = function(element){
	element = element || document.documentElement;
	if(element.requestFullscreen){
		element.requestFullscreen();
	} else if(element.mozRequestFullScreen){
		element.mozRequestFullScreen();
	} else if(element.webkitRequestFullscreen){
		element.webkitRequestFullscreen();
	} else if(element.msRequestFullscreen){
		element.msRequestFullscreen();
	}

	currentElement = element;
}

fullscreen.cancel = function(){
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

fullscreen.toggle = function(element, pointerlock, callback){
	if(fullscreen.available() == true){
		if(fullscreen.activated() == false){
			fullscreen.request(element);

			pointerlock = pointerlock || false;

			if(pointerlock === true){
				if(document.webkitFullscreenElement === element || document.mozFullscreenElement === element || document.mozFullScreenElement === element){ 
					element.requestPointerLock = element.requestPointerLock || element.mozRequestPointerLock || element.webkitRequestPointerLock;
					element.requestPointerLock();
				}
			}

			if(callback){
				fullscreen.currentCallback = callback;
			}
		} else{
			fullscreen.cancel();

			if(callback){
				fullscreen.currentCallback = null;
			}
		}
	}
}

fullscreen.changeCallback = function(){
	if(document.webkitFullscreenElement || document.mozFullscreenElement || document.mozFullScreenElement){
		if(fullscreen.currentCallback) fullscreen.currentCallback(true);
	} else{
		if(fullscreen.currentCallback) fullscreen.currentCallback(false);
	}
}

document.addEventListener('fullscreenchange', fullscreen.changeCallback, false);
document.addEventListener('mozfullscreenchange', fullscreen.changeCallback, false);
document.addEventListener('webkitfullscreenchange', fullscreen.changeCallback, false);

function pointerLockChange(){
	if(fullscreen.debug === true){
		if(document.mozPointerLockElement || document.webkitPointerLockElement) {
			console.log("Pointer Lock was successful.");
		} else{
			console.log("Pointer Lock was lost.");
		}
	}
}

document.addEventListener('pointerlockchange', pointerLockChange, false);
document.addEventListener('mozpointerlockchange', pointerLockChange, false);
document.addEventListener('webkitpointerlockchange', pointerLockChange, false);

function pointerLockError(){
	if(fullscreen.debug === true){
		console.log("Error while locking pointer.");
	}
}

document.addEventListener('pointerlockerror', pointerLockError, false);
document.addEventListener('mozpointerlockerror', pointerLockError, false);
document.addEventListener('webkitpointerlockerror', pointerLockError, false);

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

var collision = {};

collision.box = function(ax1, ay1, az1, aw, ah, ad, bx1, by1, bz1, bw, bh, bd){
	var ax2 = ax1 + aw;
	var ay2 = ay1 + ah;
	var az2 = az1 + ad;
	var bx2 = bx1 + bw;
	var by2 = by1 + bh;
	var bz2 = bz1 + bd;

	return (ax1 < bx2 &&
			ax2 > bx1 &&
			ay1 < by2 &&
			ay2 > by1 &&
			az1 < bz2 &&
			az2 > bz1
	);
}

collision.boxHelper = function(aPosition, aScale, bPosition, bScale){
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