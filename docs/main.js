console.log('eruda', eruda, eruda.init() );
console.log('rxjs', rxjs)
console.log('moment()', moment())

function run(){
	let e = document.querySelector("#eval").value;
	localStorage.setItem("eval", e);
	e = e.replace(/\n/g," ");
	e = e.replace(/console\.log/g,"consolelog");
	// console.log(e);
	consolelog(eval(e));
}

function consolelog(...args){
	let o = document.querySelector("#output");
	for(let arg of args){
		console.log(arg);
		o.value += JSON.stringify(arg)+"\n";
	}
}

function cleareval(){
	document.querySelector("#eval").value = "";
}

function clearoutput(){
	document.querySelector("#output").value = "";
}

function identation(ev){
	if(ev.keyCode === 13){
		let {value, selectionStart} = ev.target;
		value = [value.slice(0,selectionStart), value.slice(selectionStart)];
		// console.log(value, selectionStart);
		let lines = value[0].split("\n");
		if(lines.length < 2) return;
		for(let c of lines[lines.length-2]){
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
		let {value, selectionStart} = ev.target;
		value = [value.slice(0,selectionStart), value.slice(selectionStart)];
		value[0] += "  ";
		selectionStart += 2;
		ev.target.value = value.join("");
		ev.target.selectionStart = selectionStart;
		ev.target.selectionEnd = selectionStart;
	}
}