
!function(){
	var LexiconMonoSeq = require("lexicon-mono-seq");
	var container = document.createElement("div");
	container.id = "test";
	rootDiv.appendChild(container);
	var	body = document.body,
		styleText = [
			'@font-face {font-family: "Consolas";',
				'src: url("//db.onlinewebfonts.com/t/1db29588408eadbd4406aae9238555eb.eot");',
				'src: url("//db.onlinewebfonts.com/t/1db29588408eadbd4406aae9238555eb.eot?#iefix") format("embedded-opentype"),',
				'url("//db.onlinewebfonts.com/t/1db29588408eadbd4406aae9238555eb.woff2") format("woff2"),',
				'url("//db.onlinewebfonts.com/t/1db29588408eadbd4406aae9238555eb.woff") format("woff"),',
				'url("//db.onlinewebfonts.com/t/1db29588408eadbd4406aae9238555eb.ttf") format("truetype"),',
				'url("//db.onlinewebfonts.com/t/1db29588408eadbd4406aae9238555eb.svg#Consolas") format("svg");',
			'}',
			'#test {',
				'width:75vw;',
				'height:25vh;',
				'position:absolute;',
				'margin:auto;',
				'top:0;',
				'right:0;',
				'bottom:0;',
				'left:0;',
			'}',
			'body {',
				'position:relative;',
				'margin:0px;',
				'width:100vw;',
				'height:100vh;',
			'}',
			'#loading {',
				'display:flex;',
				'align-items:center;',
				'justify-content:center;',
				'width:20vw;',
				'height:20vh;',
				'position:absolute;',
				'top:0;',
				'right:0;',
				'bottom:0;',
				'left:0;',
				'margin:auto;',
				'font-size:16px;',
				'font-family:Consolas;',
				'text-align:center;',
				'border-radius:10px;',
				'background:rgba(0,0,0,0.8);',
				'color:White;',
				'z-index:2;',
			'}',
			'button {',
				'width:40vw;',
				'height:10vh;',
				'position:absolute;',
				'top:5vh;',
				'right:0;',
				'left:0;',
				'margin:auto;',
				'font-size:20px;',
				'font-family:Consolas;',
				'text-align:center;',
				'border:0px;',
				'padding:0px;',
				'border-radius:10px;',
				'background:DodgerBlue;',
				'color:white;',
				'outline:none;',
				'transition:background 1s ease;',
			'}',
			'button.inactive {',
				'background:DarkSlateGray !important;',
			'}',
			'button:hover {',
				'background:Teal;',
			'}'
		],
		style = document.createElement("style"),
		instance = LexiconMonoSeq(container,{parallelRendering:5}),
		watchman = instance.constructor.prototype.watchman,
		testNode = document.createElement("div"),
		testNodeInitRect,
		testNodeStyle = testNode.style;
	testNodeStyle.visibility = "hidden";
	testNodeStyle.position = "absolute";
	testNodeStyle.fontSize = "16px";
	testNodeStyle.fontFamily = "inexistentFont";
	testNodeStyle.margin = "0px";
	testNodeStyle.padding = "0px";
	testNode.textContent = "A";
	var fontNode = testNode.cloneNode(true),
		fontNodeInitRect;
	fontNode.style.fontFamily = "Consolas";
	body.appendChild(testNode);
	body.appendChild(fontNode);
	style.textContent = styleText.join("");
	document.head.appendChild(style);
	var loading = document.createElement("div");
	loading.id = "loading";
	loading.textContent = "Sit tight! loading..";
	body.appendChild(loading);
	var button = body.appendChild(document.createElement("button"));
	button.textContent = "Load 0-1Mb";
	
	watchman(
		{counter:0},
		function(){
			this.counter++;
			return this.counter === 5;
		},
		function(){
			fontNodeInitRect = fontNode.getBoundingClientRect();
			testNodeInitRect = testNode.getBoundingClientRect();
			watchman(
				null,
				function(){
					var rect = fontNode.getBoundingClientRect();
					//console.log("running!");
					console.log(rect,testNodeInitRect);
					return (rect.width !== testNodeInitRect.width) || (rect.height !== testNodeInitRect.height);
				},
				function(){
					var	button = document.getElementsByTagName("button")[0],
						loading = document.getElementById("loading"),
						fileNames = ["chrX.0M.1M.txt","chrX.1M.2M.txt"],
						state = "inactive";
					instance.displayPadding = 0.1; //default is 0.2
					//Allow sequences to be created, then fire up 
					var typeAA = instance.caveManCopy(instance.colors.aa),//deep copies the object
						typeDNA = instance.caveManCopy(instance.colors.dna);
					typeDNA.N = "#333333";
					typeDNA.W = "#333333";
					typeDNA.S = "#333333";
					typeDNA.Y = "#333333";
					typeDNA.R = "#333333";
					typeAA["?"] = "#333333";
					typeAA["X"] = "#333333";
					instance.registerType("aa",typeAA);
					instance.registerType("dna",typeDNA);
					function loadData(fileName){
						if (fileName === "chrX.0M.1M.txt") {
							button.textContent = "Load 1-2Mb";
						} else {
							button.textContent = "Load 0-1Mb";
						}
						fileNames.push(fileNames.shift());
						loading.style.visibility = "visible";
						button.className = "inactive";
						state = "inactive";
						var req = new XMLHttpRequest();
						req.responseType = "json";
						req.open("GET","//distreau.com/lexicon-mono-seq/datasets/" + fileName,true);
						req.onload = function(e){
							button.className = "";
							state = "active";
							loading.style.visibility = "hidden";
							instance.update(LexiconMonoSeq.createRuler(this.response,true));
						};
						req.send();
					};
					button.onclick = function(){
						if(state === "inactive"){return}
						loadData(fileNames[0]);
					};
					instance.skipFrames(90).then(function(){loadData(fileNames[0]);});
				}
			);
		}
	);
}();