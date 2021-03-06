// Variables Assigments
var counter;
var misses;
var winCounter = 0;
var words = JSON.parse(data);
var startTime;
var fWord;
var timerFlag;
var storeRecord = [];
var setScore;

function startGameTime()
{
	startTime = new Date();
	setTimeout(timer, 1000);
	document.getElementById("current_time").style.display = 'block'; 
}

//Function to make the game
function makeGame()
{
	stopTimer();
	createAZ();
	checkNameisSet();
	setScore = 0;
	var letters = [];
	counter = 0;
	misses = 0;
	winCounter = 0;

	document.getElementById("counter").innerHTML = counter;
	document.getElementById("misses").innerHTML = counter;
	randWord = findWord();
	fWord = randWord;
	for(var i=0; i<randWord.length; i++)
	{
		if(typeof randWord[i] !== 'undefined')
		{
			letters.push(randWord[i]);
			winCounter++;
		}else{
			letters.push(i);
		}
	}
	var shuffled = letters;
	var game = document.getElementById("game");
	if(game.innerHTML !== "")
	{
		setTimeout(function()
			   {
				game.classList.add("restack");}, 500);
	}
	game.innerHTML = "";
	for (var i = 0; i <= shuffled.length - 1; i++)
	{
		var div = document.createElement("div");
		div.setAttribute("class", "card "+shuffled[i]);
		var front = document.createElement("div");
		front.setAttribute("class", "front");
		var span = document.createElement("span");
		var spanText = document.createTextNode(shuffled[i]);
		span.appendChild(spanText);
		front.appendChild(span);
		var back = document.createElement("div");
		back.setAttribute("class", "back");
		div.appendChild(front);
		div.appendChild(back);
		game.appendChild(div);
	}
	setTimeout(function()
		   {
		game.classList.remove("restack");}, 3000);
	setTimeout(function()
	      {
	   game.classList.remove("stacked");}, 500);
   
	document.getElementById("current_time_reset").style.display = 'none';
	document.getElementById("current_time").style.display = 'none';
}

//Function to shuffle the array
function shuffleArray(array)
{
	for (var i = array.length - 1; i > 0; i--)
	{
		var j = Math.floor(Math.random() * (i + 1));
		var temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

//Function: Choose letter, set counter, timer, localstorage....
function pickLetter(letter)
{
	counter++;
	//Check for missed letters and set to 8 misses or attempts
	if(misses >=8)
	{
		alert('You Lose! 8 Tries Attempted');
		var timeTaken = timerHtml();
		stopTimer();
		counter --;
		turnOn();
		if (localStorage.player_name != undefined)
		{
       		//setup Local Straoge
       		if(setScore==0)
		{ 
       			localStore(localStorage.player_name,fWord,counter,timeTaken);
       			setScore = 1;
       		}
		}else{
			saveName('guest');
			localStore('guest',fWord,counter,timeTaken);
   		}
		document.getElementById("counter").innerHTML = counter;
		return false;
	} 
	document.getElementById("counter").innerHTML = counter;
	var isLetter = checkSpecialCharacter(letter);
	if(isLetter==false)
	{
		return false;
	}
	if (document.querySelector('.'+letter) !== null)
	{
		x =  document.querySelectorAll('.'+letter);
		var i;
		for (i = 0; i < x.length; i++)
		{
			x[i].classList.add("flipped");
			x[i].classList.add("abc");
		}
    	setWiggle();
 	}else{
 		misses++;
 		document.getElementById("misses").innerHTML = misses;
 	}
	var flippedNum = totalFlippedClass();
	if(flippedNum == winCounter)
	{
		setTimeout(function()
			   {
				if (confirm("Congrats! \n\n You have found all the letters! \n\n To Play Again - Press NEW GAME"))
				{
					var timeTaken = timerHtml();
					stopTimer();
					if (localStorage.player_name != undefined)
					{
						if(setScore==0)
						{
							localStore(localStorage.player_name,fWord,counter,timeTaken);
							setScore = 1;
						}
					}else{
						saveName('guest');
						if(setScore==0)
						{
							localStore('guest',fWord,counter,timeTaken);
							setScore = 1;
						}
					}
				}
		},200);
	}
}

function totalFlippedClass()
{
	var flippedClass = document.getElementsByClassName('flipped').length;
	return flippedClass;
}

//Check for Special Characters
function checkSpecialCharacter(letter)
{
	if (!/[a-zA-Z]/.test(letter))
	{
		return false;
	}
	return true;
}

//Time setup
function timer()
{
	//Record end time
	var endTime = new Date();
	// Time Difference in ms
	var timeDiff = endTime - startTime;
	// strip of the miliseconds
	timeDiff /= 1000;
	//Get seconds
	var seconds = Math.round(timeDiff % 60);
	if(seconds<10)
	{
		seconds = '0'+seconds;
	}
	//Remove Seconds From the Date
	timeDiff = Math.floor(timeDiff / 60);
	//Get the Minutes
	var minutes = Math.round(timeDiff % 60);
	if(minutes<10)
	{
		minutes = '0'+minutes;
	}
	//Remove Minutes from the Date
	timeDiff = Math.floor(timeDiff / 60);
	//Get the Hours
	var hours = Math.round(timeDiff % 24);
	if(hours<10)
	{
		hours = '0'+hours;
	}
	//Remove Hours from the Date
	timeDiff = Math.floor(timeDiff / 24);
	//Number of days
	var days = timeDiff;
	var time =   hours + ":" + minutes + ":" + seconds;
	document.getElementById("current_time").innerHTML = time;
	
	timerFlag = setTimeout(timer, 1000);
}

//Clear the Timer Flag
function stopTimer()
{
	clearTimeout(timerFlag);
}

function checkNameisSet()
{
	if (localStorage.player_name != undefined)
	{
		var div_name = document.getElementById('div-name');
		var div_show_name = document.getElementById('div-show-name');
		div_name.style.display = 'none';
		div_show_name.style.display = 'block';
		showReName = localStorage.getItem('player_name').replace('fortune_', '');
		document.getElementById("showname").innerHTML = showReName;
		// document.getElementById("showname").innerHTML = localStorage.getItem('player_name');
	}
}

//Function for Local Storage
function localStore(key,word,scored,totalTimeTaken)
{
	var item = { word: word,  score: scored,totalTimeTaken:totalTimeTaken };
	score.push(item);
	return window.localStorage.setItem(key, JSON.stringify(score));
}

function setUpStorage(key)
{
	items=JSON.parse(localStorage.getItem(key));
	for (var i in items)
	{
		var itemOld = items[i];
		var itemNew = { word: itemOld.word,  score: itemOld.score };
		score.push(itemNew);
	}
}

function timerHtml()
{
	document.getElementById("current_time").style.display = 'none';
	document.getElementById("current_time_reset").style.display = 'block';
	document.getElementById("current_time_reset").innerHTML = '00:00:00';
	var totalTime = document.getElementById("current_time").innerHTML;
	return totalTime;
}

//Function used to change the user
function changeUser()
{
	var div_name = document.getElementById('div-name');
	var div_show_name = document.getElementById('div-show-name');
	div_name.style.display = 'block';
	div_show_name.style.display = 'none';
}

function openInNewTab(url)
{
	var win = window.open(url, '_blank');
	win.focus();
}

function createAZ()
{
	var html = '';
	var i=0;
	var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
	alphabet.forEach(function(entry) {
		html +="<a onclick='checkchrExist(\""+entry+"\")' class='thisletter dis' style='text-decoration:none;' href='javascript:void(0)' ><span id='"+entry+"' class='az'>"+entry+"</span></a>";
		if(i==12)
		{
			html +='<br><br>';
		}
		i++;
		});
	document.getElementById("azstring").innerHTML = html;
}

function checkchrExist(c)
{
	var activeC = document.querySelector("#"+c);
	pickLetter(c);
	var isClassExists = document.getElementsByClassName(c);
	var isClassDisExists = document.getElementsByClassName('dis');
	if (isClassDisExists.length > 0)
	{
		startGameTime();
		var elems = document.querySelectorAll(".thisletter.dis");
		[].forEach.call(elems, function(el){
		el.classList.remove("dis");
	});

}
	activeC.classList.add("grayout");
	activeC.disabled = true;
	return false;
}

function setWiggle()
{
	var inactiveAbcClass = setTimeout(function() {
		var active =  document.querySelectorAll('.abc');
        var i;
        for (i = 0; i < active.length; i++)
	{
		active[i].classList.remove("abc"); 
    	}}, 1000);
}

function turnOn()
{
	if (document.querySelector('.card') !== null)
	{
		x =  document.querySelectorAll('.card');
		var i;
		for (i = 0; i < x.length; i++)
		{
			x[i].classList.add("flipped");
		}
	}
}

function findWord()
{
	var w = words[Math.floor(Math.random() * words.length)];
	var randWord = w.toUpperCase();
	if(randWord.length>=8)
	{
		findWord();
	}
	return randWord;
}
