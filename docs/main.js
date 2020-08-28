function run(){
	var e = document.getElementById("eval").value;
	try {
		localStorage.setItem("eval", e);
	} catch(e) { console.error(e); }
	e = e.replace(/\n/g," ");
	e = e.replace(/console\.log/g,"consolelog");
	e = e.replace(/console\.clear/g,"clearoutput");
	try {
		var before = new Date();
		var res = eval(e);
		if(res) consolelog(res);
		var after = new Date();
		if(document.getElementById("time").checked)
			consolelog(after-before+"ms");
	} catch(e){ console.error(e); }
}

function consolelog(){
	var o = document.getElementById("output");
	for(var i=0; i<arguments.length; i++){
		var arg = arguments[i];
		console.log(arg);
		if(typeof(arg) == "object") o.value += JSON.stringify(arg)+"\n";
		else o.value += arg+"\n";
	};
}

function cleareval(){
	document.getElementById("eval").value = "";
}

function clearoutput(){
	document.getElementById("output").value = "";
}

function identation(ev){
	if(ev.keyCode === 13){
		var value = ev.target.value;
		var selectionStart = ev.target.selectionStart;
		value = [value.slice(0,selectionStart), value.slice(selectionStart)];
		var lines = value[0].split("\n");
		if(lines.length < 2) return;
		for(var i=0; i<lines[lines.length-2].length; i++){
			var c = lines[lines.length-2][i];
			if(c != " " && c != "\t") break;
			lines[lines.length-1] = c + lines[lines.length-1];
			selectionStart++;
		}
		value[0] = lines.join("\n");
		ev.target.value = value.join("");
		ev.target.selectionStart = selectionStart;
		ev.target.selectionEnd = selectionStart;
	}
}

function tabinput(ev){
	if(ev.keyCode === 9){
		ev.preventDefault();
		var value = ev.target.value;
		var selectionStart = ev.target.selectionStart
		value = [value.slice(0,selectionStart), value.slice(selectionStart)];
		value[0] += "  ";
		selectionStart += 2;
		ev.target.value = value.join("");
		ev.target.selectionStart = selectionStart;
		ev.target.selectionEnd = selectionStart;
	}
}

try {
	console.log('eruda', eruda, eruda.init() );
} catch(e){ console.error(e); }
try {
	console.log('rxjs', rxjs);
} catch(e){ console.error(e); }
try {
	console.log('moment()', moment());
} catch(e){ console.error(e); }

function initEval(first){
	if(!localStorage) return;
	try {
		if(!localStorage.getItem("eval") && first) setTimeout(function(){initEval(false);},1000);
		else document.getElementById("eval").value = localStorage.getItem("eval");
	} catch(e){ console.error(e); }
}
initEval(true);


installPromptEvent = null;
window.addEventListener('beforeinstallprompt', function(e){
	console.log('beforeinstallprompt', e);
	e.preventDefault();
	installPromptEvent = e;
	document.getElementById("install-btn").style.display = "unset";
});
function install(){
	installPromptEvent.prompt();
	installPromptEvent.userChoice.then(function(choice){
		if(!choice) return console.log("whaaaat");
		console.log("A2HS", choice.outcome)
		installPromptEvent = null;
	});
}
