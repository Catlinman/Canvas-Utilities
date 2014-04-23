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
	if(num < min && min < max) num = min;
	if(num > max && max > min) num = max;
	return num;
}

Math.cycle = function(num, min, max){
	var tick = 0;

	while(num < min || num > max && tick < 10){
		tick++;

		if(num < min && min < max){
			var dist = min - num;
			num = max - dist;
		}else{ if(num > max && max > min){
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