	(function(root,factory) {
		if (typeof define === "function" && define.amd) {
		define([], factory);
		} else if (typeof exports === "object") {
			module.exports = factory();
		} else {
			root.LexiconMonoSeq = factory();
		}
	}(this, function() {
		function LexiconMonoSeq(container,options){
			container = typeof container === "string" 
				? document.querySelector(container) 
				: container.nodeType && container.nodeType === 1
					? container
					: document.body;
			return new _LexiconMonoSeq(container,options);
		};
		function _LexiconMonoSeq(container,options){
			if(!this.__defaultStyleApplied){
				options && (this.textRendering = options.textRendering);
				options && (this.fontKerning = options.fontKerning);
				options && (this.webkitFontSmoothing = options.webkitFontSmoothing);
				var style = document.createElement("style");
				style.textContent = this.Style.string(this);
				style.setAttribute("data-name","LexiconMonoSeqStyle");
				document.head.appendChild(style);
				this.constructor.prototype.__defaultStyleApplied = true;
			}
			this.container = container;
			this.toggleClass(container,"LexiconMonoSeqContainer",true);
			this._state = "IDLE";
			this._labels = true;
			var painters = this.painters = Array.apply(null,Array((options && options.parallelRendering) || 1))
				.map(function(d,i){return new this.Paint(this);},this);
			painters._counter = 0;
			painters._length = painters.length;
			this.wrapper = document.createElement("div");
			this.wrapper.className = "LexiconMonoSeq wrapper custom";
			this.div = this.wrapper.appendChild(document.createElement("div"));
			this.div.className = "LexiconMonoSeq main custom";
			this.divStyle = this.div.style;
			this.hidden = this.wrapper.appendChild(document.createElement("div"));
			this.hidden.className = "LexiconMonoSeq hidden";
			this.hidden.textContent = "A";
			this.busy = this.wrapper.appendChild(document.createElement("div"));
			this.busy.className = "LexiconMonoSeq busy custom";
			this.busyStyle = this.busy.style;
			this.busy.textContent = "\u23f3";
			this.sequences = [];
			this.currentAnimationFrame = new this.AnimLedger(this) /*{u:undefined,a:undefined,r:undefined,s:undefined,sMan:undefined}*/;
			this.ColorShift = new this.ColorShift(this);
			this.ColorShiftRgba = new this.ColorShiftRgba(this);
			this.update = function(arr,nOptions){
				options = nOptions || options;
				options 
				&& (options.labels !== undefined)
				&& ((this._labels = !!options.labels) || true)
				&& this.toggleClass(this.wrapper,"labelsOff",!options.labels);
				this.scrollLeftOffset = this.fontWidth * this.maxAllowedLabelLength;
				this.divStyle.transform = "translate(" + this.scrollLeftOffset + "px,0px)"; 
				this.source = arr;
				this.getMaxSeqLength(arr).currentAnimationFrame.cancelFrames().prepareForUpdate();//cancel frames and reset 'append' frame and set state as 'ANIM'
				var l = arr.length,
					ease = (options && options.ease)
						? new this.Ease(options.ease[0],options.ease[1],{resolution:options.easeResolution,precision:options.easePrecision})
						: this.ease,
					e = this.sequences
						.filter(function(d,i){return !d.rm;})
						.filter(function(d,i){return (i > l - 1) && (d.rm = true);}),
					u = this.sequences.filter(function(d,i){return !d.rm && (d.source = arr[i]);}),
					a = Array.apply(null,Array(arr.length-u.length)).map(function(d,i){
						d = new this.Sequence(arr[u.length + i],this);
						d.painter = painters[(++painters._counter, painters._counter %= painters._length)];
						this.sequences.push(d);
						return d;
					},this);
				e.length && this.removeSequences(
					e,
					{ease:ease,startTime:undefined,options:options}
				);
				u.length && this.updateSequences(
					u,
					{ease:ease,startTime:undefined,options:options}
				);
				a.length && this.updateSequences(
					a,
					{ease:ease,startTime:undefined,options:options}
				);
				options 
				&& options.easePaint 
				&& (this.painters.forEach(function(d,i){
					d.ease = new this.Ease(options.easePaint[0],options.easePaint[1],{resolution:options.easePaintResolution,precision:options.easePaintPrecision});
				},this));
				options 
				&& (options.durationPaint !== undefined)
				&& (this.painters.forEach(function(d,i){
					d.duration = options.durationPaint;
				},this));
				return this;
			};
			this.wrapper.addEventListener("scroll",this.repaintOnScroll(),false);
			container.appendChild(this.wrapper);
			return this;
		};
		/*
		###############################
		##############PROTO############
		###############################
		*/
		_LexiconMonoSeq.prototype._scrollLeftOffset = 0;
		_LexiconMonoSeq.prototype._50spaces = "                                                  ";
		_LexiconMonoSeq.prototype.set = function(k,v){
			this[k] = v;
			return this;
		};
		_LexiconMonoSeq.prototype.maxAllowedLabelLength = 20;
		_LexiconMonoSeq.prototype.displayPadding = 0.2;
		_LexiconMonoSeq.prototype.generateRandomString = function(){
			return (Math.random()*1e9 | 0).toString(16);
		};
		_LexiconMonoSeq.prototype.colors = {
			aa: {
				"A": "#ffffc9",
				"C": "#e3f9ad",
				"E": "#f93333",
				"D": "#fb7979",
				"G": "#c0c0c0",
				"F": "#c7c88a",
				"I": "#ffff4f",
				"H": "#d5f6fb",
				"K": "#baaafc",
				"M": "#c3ed27",
				"L": "#ffff79",
				"N": "#ee72a7",
				"Q": "#f9c3e3",
				"P": "#f1f2f3",
				"S": "#ca9ec8",
				"R": "#8694fa",
				"T": "#f0e4ef",
				"W": "#85b0cd",
				"V": "#ffffab",
				"Y": "#7dafb9",
				"-": "#778899",
				":": "#778899",
				"*": "#778899",
				".": "#778899",
				"·": "#778899",
				" ": "#778899"
			},
			dna: {
				"A": "#3f5fef",
				"T": "#ee2f2f",
				"G": "#2f2f2f",
				"C": "#0f7f7f",
				"-": "#778899",
				":": "#778899",
				"*": "#778899",
				".": "#778899",
				"·": "#778899",
				" ": "#778899"
			},
			ruler: {
				"0": "#de9d00",
				"1": "#de9d00",
				"2": "#de9d00",
				"3": "#de9d00",
				"4": "#de9d00",
				"5": "#de9d00",
				"6": "#de9d00",
				"7": "#de9d00",
				"8": "#de9d00",
				"9": "#de9d00",
				"·": "#6f4f0f",
				" ": "#778899"
			},
			alphabet: { //https://www.omniglot.com/conscripts/coloralphabet.php
				"K": "#ffff96",
				"M": "#cd9135",
				"L": "#ca3e5e",
				"W": "#ff98d5",
				"T": "#538cd0",
				"V": "#b2dccd",
				"C": "#92f846",
				"Y": "#afc84a",
				"F": "#b9b9b9",
				"G": "#ebebde",
				"I": "#ffff00",
				"D": "#ffc82f",
				"E": "#ff7600",
				"O": "#ff0000",
				"B": "#af0d66",
				"S": "#792187",
				"A": "#0000b4",
				"N": "#0c4b64",
				"U": "#009a25",
				"H": "#646464",
				"P": "#af9b32",
				"Z": "#3f190c",
				"J": "#371370",
				"X": "#00004a",
				"R": "#254619",
				"Q": "#000000",
				"-": "#778899",
				":": "#778899",
				"*": "#778899",
				".": "#778899",
				"·": "#778899",
				" ": "#778899"
			},
			number: { //http://colorbrewer2.org/#type=qualitative&scheme=Set3&n=10
				"0": "#8dd3c7",
				"1": "#ffffb3",
				"2": "#bebada",
				"3": "#fb8072",
				"4": "#80b1d3",
				"5": "#fdb462",
				"6": "#b3de69",
				"7": "#fccde5",
				"8": "#d9d9d9",
				"9": "#bc80bd",
				"-": "#778899",
				":": "#778899",
				"*": "#778899",
				".": "#778899",
				"·": "#778899",
				" ": "#778899"
			}
		};
		_LexiconMonoSeq.prototype.opacities = {
			aa: {
				"A": 0.95,
				"C": 0.95,
				"E": 0.95,
				"D": 0.95,
				"G": 0.95,
				"F": 0.95,
				"I": 0.95,
				"H": 0.95,
				"K": 0.95,
				"M": 0.95,
				"L": 0.95,
				"N": 0.95,
				"Q": 0.95,
				"P": 0.95,
				"S": 0.95,
				"R": 0.95,
				"T": 0.95,
				"W": 0.95,
				"V": 0.95,
				"Y": 0.95,
				"-": 0.8,
				":": 0.4,
				"*": 0.2,
				".": 0.1,
				"·": 0.05,
				" ": 0
			},
			dna: {
				"-": 0.8,
				":": 0.4,
				"*": 0.2,
				".": 0.1,
				"·": 0.05,
				" ": 0
			},
			alphabet: {
				"-": 0.8,
				":": 0.4,
				"*": 0.2,
				".": 0.1,
				"·": 0.05,
				" ": 0
			},
			number: {
				"-": 0.8,
				":": 0.4,
				"*": 0.2,
				".": 0.1,
				"·": 0.05,
				" ": 0
			},
			ruler: {
				"·": 0.05
			}
		};
		_LexiconMonoSeq.prototype.textColors = {
			aa: "rgba(0,0,0,0.9)",
			dna: "rgba(255,255,255,0.8)",
			alphabet: "rgba(0,0,0,0.9)",
			number: "rgba(255,255,255,0.8)",
			ruler: "rgba(0,0,0,0.9)"
		};
		_LexiconMonoSeq.prototype.caveManCopy = function(obj){
			return JSON.parse(JSON.stringify(obj));
		};
		_LexiconMonoSeq.prototype.registerType = function(name,colors,textColor,opacities){
			var prt = _LexiconMonoSeq.prototype;
			name 
			&& (colors && (prt.colors[name] = prt.caveManCopy(colors)))
			&& (textColor && (prt.textColors[name] = textColor))
			&& (
				(opacities && (prt.opacities[name] = prt.caveManCopy(opacities)))
				|| (prt.opacities[name] = {})
			);
			return this;				
		};
		_LexiconMonoSeq.prototype.reDraw = function(){
			try {
				if(!this.source){
					throw new ReferenceError("No source is available, the source has been detached.");
				}
				this.update(this.source);
			} catch(e) {
				console.log(e.message);
			} finally {
				return this;
			}
		};
		_LexiconMonoSeq.prototype.detach = function(){
			delete this.source;
			return this;
		};
		
		_LexiconMonoSeq.prototype.ColorShift = function(instance){
			this.colors = Object();
			var that = this,
				f = function(h1,h2){
				var v,
					k = "" + h1 + h2;
				if (v = that.colors[k]) {
					return v.f;
				}
				v = that.colors[k] = Object();
				v.t = Object();
				return v.f = that.shift(h1,h2,v.t);
			};
			f.clear = function(){
				that.colors = Object();
				return instance;
			};
			return f;
		};
		_LexiconMonoSeq.prototype.ColorShift.prototype.shift = function(h1,h2,preComputed){
			var max = Math.max,
				min = Math.min,
				h1r = +("0x" + h1.slice(1,3)),
				h1g = +("0x" + h1.slice(3,5)),
				h1b = +("0x" + h1.slice(5)),
				h2r = +("0x" + h2.slice(1,3)),
				h2g = +("0x" + h2.slice(3,5)),
				h2b = +("0x" + h2.slice(5));
			return function(t){
				t = (t * 1000 | 0) / 1000;
				var k = "" + t,
					v;
				if ((v = preComputed[k]) !== undefined) {
					return v;
				}
				return preComputed[k] = "#" 
					+ ("00" + (max(0,min(255,h1r + t * (h2r - h1r))) | 0).toString(16)).slice(-2) 
					+ ("00" + (max(0,min(255,h1g + t * (h2g - h1g))) | 0).toString(16)).slice(-2)
					+ ("00" + (max(0,min(255,h1b + t * (h2b - h1b))) | 0).toString(16)).slice(-2);
			}
		};
		_LexiconMonoSeq.prototype.ColorShiftRgba = function(instance){
			this.colors = Object();
			var that = this,
				f = function(rgba1,rgba2){
				var v,
					k = "" + rgba1 + rgba2;
				if (v = that.colors[k]) {
					return v.f;
				}
				v = that.colors[k] = Object();
				v.t = Object();
				return v.f = that.shift(rgba1,rgba2,v.t);
			};
			f.clear = function(){
				that.colors = Object();
				return instance;
			};
			return f;
		};
		_LexiconMonoSeq.prototype.ColorShiftRgba.prototype.rgx = /([0-9.]+)/gi;
		_LexiconMonoSeq.prototype.ColorShiftRgba.prototype.shift = function(rgba1,rgba2,preComputed){
			var max = Math.max,
				min = Math.min,
				rgx = this.rgx,
				grps = (rgba1 + rgba2).match(rgx), 
				rgba1r = +grps[0],
				rgba1g = +grps[1],
				rgba1b = +grps[2],
				rgba1a = +grps[3],
				rgba2r = +grps[4],
				rgba2g = +grps[5],
				rgba2b = +grps[6],
				rgba2a = +grps[7];
			return function(t){
				t = (t * 1000 | 0) / 1000;
				var k = "" + t,
					v;
				if ((v = preComputed[k]) !== undefined) {
					return v;
				}
				return preComputed[k] = "rgba(" 
					+ (max(0,min(255,rgba1r + t * (rgba2r - rgba1r))) | 0)
					+ ","
					+ (max(0,min(255,rgba1g + t * (rgba2g - rgba1g))) | 0)
					+ ","
					+ (max(0,min(255,rgba1b + t * (rgba2b - rgba1b))) | 0)
					+ ","
					+ max(0,min(1,rgba1a + t * (rgba2a - rgba1a)))
					+ ")";
			}
		};
		_LexiconMonoSeq.prototype.interpolateAndStoreAtEnd = function(arr,i,v,t,_t){
			var vi = arr[i];
			if (t < 1){
				return vi + (v - vi) * _t;
			} else {
				return arr[i] = v;
			}
		};
		_LexiconMonoSeq.prototype.interpolateAndStore = function(arr,i,v,t){
			var _t = arr["_t"+i],
				vi;
			if(t >= 1) {
				delete arr["_t"+i];
				delete arr["_"+i];
				return arr[i] = v;
			}
			if (t < _t) {
				delete arr["_"+i];
			}
			vi = arr["_"+i] || (arr["_"+i] = arr[i]);
			arr["_t"+i] = t;
			return arr[i] = vi + (v - vi) * t;
		};
		_LexiconMonoSeq.prototype.interpolateAndStoreArr = function(arr,ref,t){
			var l = arr.length,
				_t = arr._t,
				vi,
				i;
			if(t >= 1) {
				delete arr._t;
				for (i = 0;i < l;++i){
					delete arr["_"+i];
					arr[i] = ref[i];
				}
				return arr;
			}
			if (t < _t) {
				for (i = 0;i < l;++i){
					delete arr["_"+i];
				}
			}
			while(~--l){
				vi = arr["_"+l] || (arr["_"+l] = arr[l]);
				arr[l] = vi + (ref[l] - vi) * t;
			}
			arr._t = t;
			return arr;
		};
		_LexiconMonoSeq.prototype.interpolateAndStoreArrInt = function(arr,ref,t){
			var l = arr.length,
				_t = arr._t,
				vi,
				i;
			if(t >= 1) {
				delete arr._t;
				for (i = 0;i < l;++i){
					delete arr["_"+i];
					arr[i] = ref[i];
				}
				return arr;
			}
			if (t < _t) {
				for (i = 0;i < l;++i){
					delete arr["_"+i];
				}
			}
			while(~--l){
				vi = arr["_"+l] || (arr["_"+l] = arr[l]);
				arr[l] = (vi + (ref[l] - vi) * t) | 0;
			}
			arr._t = t;
			return arr;
		};
		_LexiconMonoSeq.prototype.SVG = function(container){
			var svg = document.createElementNS("http://www.w3.org/2000/svg","svg");
			svg.setAttribute("viewBox","0 0 1 1");
			svg.setAttribute("preserveAspectRatio","none");
			if (container) {
				container.appendChild(svg);
			}
			return svg;
		};
		_LexiconMonoSeq.prototype.toggleClass = function (node,className,bool,chain){
			var classArr = node.className.split(" ").filter(function(d,i){return d;}),
				temp = classArr.indexOf(className),
				temp2 = !~temp;
			if (bool || bool === undefined && temp2) {
				temp2 && (node.className = classArr.concat(className).join(" "));
			} else {
				!temp2 && (node.className = classArr.reduce(function(ac,d,i,a){if(i !== temp ){ac += d + " ";} return ac;},""));
			}
			return chain || (chain = {
				toggleClass: function(className,bool){
					return _LexiconMonoSeq.prototype.toggleClass(node,className,bool,chain);
				}
			});
		};
		_LexiconMonoSeq.prototype._states = ["state","DOMState"];
		Object.defineProperties(
			_LexiconMonoSeq.prototype,
			{
				state:{
					configurable: false,
					get: function(){
						return this._state;
					},
					set: function(v){
						if(v === "ANIM") {
							this._state = v;
							this.busyStyle.visibility = "visible";
						} else if (v === "IDLE") {
							this._state = v;
							this.busyStyle.visibility = "hidden";
						}
					}
				},
				scrollLeftOffset:{
					configurable: false,
					get: function(){
						return this._labels ? this._scrollLeftOffset : 0;
					},
					set: function(v){
						if(this._labels) {
							this._scrollLeftOffset = v;
						}
					}
				},
				scrollLeft:{
					configurable: false,
					get: function(){
						return this.wrapper.scrollLeft - this.scrollLeftOffset;
					},
					set: function(v){
						this.wrapper.scrollLeft = v + this.scrollLeftOffset;
					}
				},
				DOMState:{
					configurable: false,
					get: function(){
						return this.painters.some(function(d,i){return d.active || Object.keys(d.frames).length !== 0})
							? "ANIM"
							: "IDLE";
					}
				},
				oState:{
					configurable: false,
					get: function(){
						return this._states.every(function(d,i){
								return this[d] === "IDLE";
							},this) ? "IDLE" : "ANIM";
					}
				},
				fontRect: {
					configurable: false,
					get: function(){
						if (this._fontRect) {
							return this._fontRect;
						}
						var that = this,
							r = document.createRange(),
							t = this.hidden.firstChild,
							l = t.length;
						r.setStart(t,0);
						r.setEnd(t,l);
						window.requestAnimationFrame(function(){
							delete that._fontRect;
							r.detach && r.detach();
						});
						return this._fontRect = r.getBoundingClientRect();
					}
				},
				fontWidth: {
					configurable: false,
					get: function(){
						var l = this.hidden.firstChild.length;
						return this.fontRect.width/l;
					}
				},
				fontHeight: {
					configurable: false,
					get: function(){
						return this.fontRect.height;
					}
				},
				fontRatio: {
					configurable: false,
					get: function(){
						if(this._fontRatio){
							return this._fontRatio;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._fontRatio;
						});
						return this._fontRatio = this.fontWidth/this.fontHeight;
					}
				},
				containerRect: {
					configurable:false,
					get: function(){
						if (this._containerRect) {
							return this._containerRect;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._containerRect;
						});
						return this._containerRect = this.container.getBoundingClientRect();
					}
				},
				containerHeight: {
					configurable:false,
					get: function(){
						return this.containerRect.height;
					}
				},
				mainRect: {
					configurable:false,
					get: function(){
						if (this._mainRect) {
							return this._mainRect;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._mainRect;
						});
						return this._mainRect = this.div.getBoundingClientRect();
					}
				},
				mainWidth: {
					configurable: false,
					get: function(){
						return this.mainRect.width;
					}
				},
				viewportRect: {
					configurable:false,
					get: function(){
						if (this._viewportRect) {
							return this._viewportRect;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._viewportRect;
						});
						return this._viewportRect = this.wrapper.getBoundingClientRect();
					}
				},
				viewportWidth: {
					configurable: false,
					get: function(){
						return this.viewportRect.width;
					}
				},
				viewportHeight: {
					configurable: false,
					get: function(){
						return this.viewportRect.height;
					}
				},
				viewportWidthInChar:{
					configurable: false,
					get: function(){
						return this.viewportWidth/this.fontWidth;
					}
				},
				isInViewport: {
					configurable: false,
					value: function(point){
						var rect = this.viewportRect;
						return (point.x - rect.left > 0) && (point.x - rect.left < rect.width) && (point.y - rect.top > 0) && (point.y - rect.top < rect.height);
					}
				},
				innerWidth: {
					configurable: false,
					get: function(){
						if (this._innerWidth) {
							return this._innerWidth;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._innerWidth;
						});
						return this._innerWidth = Math.max(document.documentElement.clientWidth,window.innerWidth);
					}
				},
				getScreenWidth: {
					configurable:false,
					get: function(){
						return this.innerWidth;
					}
				},
				innerHeight: {
					configurable: false,
					get: function(){
						if (this._innerHeight) {
							return this._innerHeight;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._innerHeight;
						});
						return this._innerHeight = Math.max(document.documentElement.clientHeight,window.innerHeight);
					}
				},
				getScreenHeight: {
					configurable:false,
					get: function(){
						return this.innerHeight;
					}
				},
				getScreenWidthInChars: {
					configurable:false,
					get: function(){
						return this.innerWidth/this.fontWidth;
					}
				},
				getMaxDisplayableChars: {
					configurable:false,
					get: function(){
						if (this._getMaxDisplayableChars) {
							return this._getMaxDisplayableChars;
						}
						return this._getMaxDisplayableChars = Math.min(this.getScreenWidth,this.viewportWidth)/this.fontWidth;
					}
				},
				getMaxDisplayableSequences: {
					configurable:false,
					get: function(){
						if (this._getMaxDisplayableSequences) {
							return this._getMaxDisplayableSequences;
						}
						return this._getMaxDisplayableSequences = Math.min(this.getScreenHeight,this.viewportHeight,this.containerHeight)/this.sequences[0].trackHeight;
					}
				},
				getCurrentPosLeft: {
					configurable:false,
					get: function(){
						if (this._getCurrentPosLeft) {
							return this._getCurrentPosLeft;
						}
						var that = this,
							track = this.getMaxTrackLength;
						window.requestAnimationFrame(function(){
							delete that._getCurrentPosLeft;
						});
						return this._getCurrentPosLeft = {
							posLeft: (this.scrollLeft - track.posOffsetTransform) / track.width * track.sequenceLength * track.charWidth,
							posOffset: track.posOffset
						};
					}
				},
				getVisibleRangeVertical: {
					configurable:false,
					get: function(){
						if(this._getVisibleRangeVertical) {
							return this._getVisibleRangeVertical;
						}
						var that = this,
							rectMain = this.mainRect,
							rectContainer = this.containerRect,
							top = Math.max(rectMain.top,rectContainer.top),
							bot = Math.min(rectMain.bottom,rectContainer.bottom),
							vRange = {start:0,end:0},
							l = this.sequences.length,
							maxDisplayableSequences = this.getMaxDisplayableSequences;
						window.requestAnimationFrame(function(){
							delete that._getVisibleRangeVertical;
						});
						if(bot <= top) {
							vRange.start = -1;
							vRange.end = -1;
							return this._getVisibleRangeVertical = vRange;
						}
						vRange.start = (top - rectMain.top) / rectMain.height * l;
						vRange.offset = -(vRange.start % 1);
						vRange.start = Math.max(0,vRange.start - maxDisplayableSequences * this.displayPadding) | 0;
						vRange.end = Math.ceil(Math.min(l,(bot - rectMain.top) / rectMain.height * l + maxDisplayableSequences * this.displayPadding));
						return this._getVisibleRangeVertical = vRange;
					}
				},
				getMaxTrackLength: {
					configurable:false,
					get: function(){
						if(this._getMaxTrackLength) {
							return this._getMaxTrackLength;
						}
						var a = this.sequences,
							l = a.length-1,
							s = a[l],
							w;
						while(~--l){
							if(a[l].options.svgWidthInPx > s.options.svgWidthInPx) {
								s = a[l];
							}
						}
						//implicitly set main width
						w = s.options.svgWidthInPx;
						this.div.style.width = w + "px";
						return this._getMaxTrackLength = {
							posOffset: s.posOffset,
							posOffsetTransform: s.options.posOffsetTransform,
							width: w,
							charWidth:s.charWidth,
							sequenceLength: s.seq.length
						};
					}
				}
			}
		);
		_LexiconMonoSeq.prototype.strConcat = function(arr){
			var chr = String.fromCharCode;
			for(var i = 0,l = arr.length - 1,r = chr(arr[i]);i < l;++i){
				r += chr(arr[i + 1]);
			}
			return r;
		};
		_LexiconMonoSeq.prototype.getMaxSeqLength = function(arr){
			this.maxSeqLength = Math.max.apply(null,arr.map(function(d,i){return d.seq.length;}));
			return this;
		};
		_LexiconMonoSeq.prototype.getInfoFromEvent = function(event){
			var point;
			if(!this.isInViewport(point = {
					x:event.clientX !== undefined ? event.clientX : event.changedTouches[0].clientX,
					y:event.clientY !== undefined ? event.clientY : event.changedTouches[0].clientY
			})) {
				return {detail:"MISS"};
			}
			var trackNumber = (point.y - this.mainRect.top) / this.mainRect.height * this.sequences.length | 0,
				sequenceObj = this.sequences[trackNumber],
				slabRect = sequenceObj && sequenceObj.slabRect,
				slab = sequenceObj && sequenceObj.textSlab,
				seq = slab && slab._seqArr;
			if(!seq){
				return {
					detail:"MISS",
					state: this.oState,
					trackNumber: trackNumber,
					target: sequenceObj
				};
			}
			var rects = sequenceObj.rects,
				range = rects.paintedRange,
				options = sequenceObj.options,
				offset = (point.x - slabRect.left + options.transformXOffset - options.posOffsetTransform) / slabRect.width * seq.length,
				rCharNumber = offset | 0,
				charNumber = rCharNumber + range.start;
			if(seq[rCharNumber] === undefined) {
				return {
					detail:"MISS",
					state: this.oState,
					trackNumber: trackNumber,
					target: sequenceObj
				};
			}
			return {
				detail: "HIT",
				state: this.oState,
				trackNumber: trackNumber,
				target: sequenceObj,
				pos: charNumber,
				rPos: rCharNumber,
				letter: String.fromCharCode(seq[rCharNumber]),
				offset: offset- rCharNumber
			}
		};
		_LexiconMonoSeq.prototype.garbage = function(){
			this.detach();
			this.wrapper.parentNode.removeChild(this.wrapper);
			return this;
		};
		_LexiconMonoSeq.prototype.getInfoFromRect = function(rect){//top,left,width,height
			var vRect,
				trackHeight,
				h,
				o,
				seq,
				target,
				widthInChar,
				info,
				start,
				end,
				prev;
			if(!this.isInViewport({x:rect.left,y:rect.top})) {
				return [];
			}
			vRect = this.viewportRect;
			trackHeight = this._trackHeight;
			rect = this.caveManCopy(rect);
			rect.width = Math.min(rect.width,vRect.width - rect.left + vRect.left);
			rect.height = Math.min(rect.height,vRect.height - rect.top + vRect.top);
			widthInChar = rect.width/this.fontWidth;
			o = [];
			for (h = 0; true; h += trackHeight, h = Math.min(h, rect.height)){
				info = this.getInfoFromEvent({clientX:rect.left, clientY: rect.top + h});
				if(info.detail === "HIT") {
					target = info.target;
					seq = target.textSlab._seqArr;
					start = info.rPos;
					end = Math.min(seq.length, Math.ceil(start + widthInChar / target.charWidth + info.offset));
					info.end = info.pos + end;
					info.captured = seq.slice(start,end).map(function(d){return String.fromCharCode(d);});
				}
				if(!prev || prev !== info.trackNumber){
					o.push(info);
				}
				if(h === rect.height) {
					break;
				}
				prev = info.trackNumber;
			}
			return o;
		};
		_LexiconMonoSeq.prototype.enableDrag = function(options){
			if(this._dragEnabled){return this;};
			var wrapper = this.wrapper,
				startDrag = this.startDrag(options);
			this._dragEnabled = true;
			wrapper.addEventListener("mousedown",startDrag,false);
			wrapper.addEventListener("touchstart",startDrag,this.quirks.passiveSupported ? {capture:false, passive:false} : false);
			this.toggleClass(wrapper,"drag",true);
			return this;
		};
		_LexiconMonoSeq.prototype.disableDrag = function(){
			if(!this._dragEnabled){return this;};
			var wrapper = this.wrapper;
			delete this._dragEnabled;
			delete wrapper._dragging;
			wrapper.removeEventListener("mousedown",wrapper._startDrag,false);
			wrapper.removeEventListener("touchstart",wrapper._startDrag,this.quirks.passiveSupported ? {capture:false, passive:false} : false);
			delete wrapper._startDrag;
			this.toggleClass(wrapper,"drag",false);
			return this;
		};
		_LexiconMonoSeq.prototype.startDrag = function(options){
			var instance = this,
				container = this.container,
				wrapper = this.wrapper,
				busy = false;
			return wrapper._startDrag = function(e){
				if(busy){return}
				busy = true;
				window.requestAnimationFrame(function(){
					busy = false;
				});
				if(wrapper._dragging){return};
				e.preventDefault();
				wrapper._dragging = true;
				instance.Drag(instance,container,wrapper,options,e);
			}
		};
		_LexiconMonoSeq.prototype.Drag = function (instance,container,wrapper,options,e){
			var xI = e.clientX !== undefined ? e.clientX : e.changedTouches[0].clientX,
				yI = e.clientY !== undefined ? e.clientY : e.changedTouches[0].clientY,
				sX = instance.scrollLeft,
				sY = wrapper.scrollTop,
				o = Object(),
				refMove = instance.drag.bind(o,instance,container,wrapper,xI,yI,sX,sY,options),
				refReset = function(e){
					this.removeEventListener("resize",refReset,false);
					this.removeEventListener("mouseup",refReset,false);
					this.removeEventListener("touchend",refReset,false);
					this.removeEventListener("touchmove",refMove,instance.quirks.passiveSupported ? {capture:false, passive:false} : false);
					this.removeEventListener("mousemove",refMove,false);
					instance.quirks.enableScroll();
					wrapper._dragging = false;
					options && options.end && options.end.call(instance,e,options);
				};
			instance.quirks.disableScroll();
			window.addEventListener("resize",refReset,false);
			window.addEventListener("mouseup",refReset,false);
			window.addEventListener("touchend",refReset,false);
			if (e.type === "touchstart") {
				e.preventDefault();
				window.addEventListener("touchmove",refMove,instance.quirks.passiveSupported ? {capture:false, passive:false} : false);
			} else {
				window.addEventListener("mousemove",refMove,false);
			}
		};
		_LexiconMonoSeq.prototype.drag = function (instance,container,wrapper,xI,yI,sX,sY,options,e) {// this refers to empty object pointer
			e.preventDefault();
			if(this.busy){return}
			if(!this.dragStarted) {
				this.dragStarted = true;
				options && options.start && options.start.call(instance,e,options);
			}
			var xF = e.clientX !== undefined ? e.clientX : e.changedTouches[0].clientX,
				yF = e.clientY !== undefined ? e.clientY : e.changedTouches[0].clientY,
				that = this;
			this.busy = true;
			window.requestAnimationFrame(function(){
				that.busy = false;
			});
			instance.scrollLeft = sX - (xF - xI);
			wrapper.scrollTop = sY - (yF - yI);
			options && options.drag && options.drag.call(instance,e,options);
		};
		_LexiconMonoSeq.prototype.skipFrames = function(nFrames){
			var that = this;
			return {
				then: function(f){
					that.watchman(
						that,
						function(counter){
							return !--counter.counter
						},
						function(){
							f.call(that);
						},
						{counter: nFrames}
					);
					return that.skipFrames(1 + nFrames);
				},
				skipFrames: function(_nFrames){
					return that.skipFrames(nFrames + _nFrames);
				}
			};
		};
		_LexiconMonoSeq.prototype.quirks = {
			busy:false,
			parent: _LexiconMonoSeq.prototype,
			passiveSupported: false,
			scrollDisabled: false,
			disableScroll:function(){
				if(this.scrollDisabled){return}
				this.parent.toggleClass(document.body,"lock-scroll",true);
				document.body.addEventListener("touchmove",this.disableScrollFunction,this.passiveSupported ? {capture:false, passive:false} : false);
				this.scrollDisabled = true;
			},
			enableScroll:function(){
				if(!this.scrollDisabled){return}
				this.parent.toggleClass(document.body,"lock-scroll",false);
				document.body.removeEventListener("touchmove",this.disableScrollFunction, this.passiveSupported ? {capture:false, passive:false} : false);
				this.scrollDisabled = false;
			}
		};
		(function(){
			var quirks = _LexiconMonoSeq.prototype.quirks,
				options = Object.defineProperty({},"passive",{
					get: function(){
						quirks.passiveSupported = true;
					}
				});
			window.addEventListener("lexiconMonoSeqPassiveTest",null,options);
			quirks.disableScrollFunction = function(e){
				if(quirks.busy){return}
				window.requestAnimationFrame(function(){
					quirks.busy = false;
				});
				quirks.busy = true;
				if(!e.cancelable) {
					return
				} else {
					e.preventDefault();
				}
			};
		})();
		/*
		###############################
		##############PROTO############
		###############################
		*/
		/*
		###############################
		#############STATIC############
		###############################
		*/
		LexiconMonoSeq.createRuler = function (arr,inject,bottom){
			var ruler = "",
				charLength = Math.max.apply(null,arr.map(function(d,i){return d.seq.length * (d.charWidth || 1) + (d.posOffset || 0)})),
				tick = 1,
				counter = 20,
				pass = 0;
			while(~--charLength){
				if(pass){
					pass--;
					counter++;
					continue;
				}
				if(!(counter %= 20)){
					pass = ("" + tick).length - 1;
					ruler += tick;
					tick += 20;
				} else {
					ruler += "·";
				}
				counter++;
			}
			if(inject){
				if(bottom) {
					arr.push({
						name:"ruler",
						seq:ruler,
						type:"ruler"
					});
				} else {
					arr.unshift({
						name:"ruler",
						seq:ruler,
						type:"ruler"
					});
				}
				return arr;
			}
			return ruler;
		};
		LexiconMonoSeq.readClustal = function (str,options){
			var o = str.split("\n")
				.slice(1)
				.join("\n")
				.match(/([A-Z_\-0-9]+)\s+([A-Z\-]+)(?:\s+[0-9]+)?/gi)
				.reduce(function(ac,d,i,a){
					var arr = d.split(/\s+/),
						name = arr[0],
						seq = arr[1];
					if(ac[name]){
						ac[name] += seq;
					} else {
						ac[name] = seq;
					}
					return ac;
				},{});
			return Object.keys(o)
			.map(function(d,i){
				return {
					name: d,
					seq: o[d],
					charWidth: (options && options.charWidth) || 1,
					type: (options && options.type) || "aa"
				};
			})
		};
		/*
		###############################
		#############STATIC############
		###############################
		*/
		/*
		###############################
		###########ANIM LEDGER#########
		###############################
		*/
		_LexiconMonoSeq.prototype.AnimLedger = function(instance){
			Object.defineProperties(
				this,
				{
					a: this.returnDescriptor("a",instance),
					u: this.returnDescriptor("u",instance),
					r: this.returnDescriptor("r",instance),
					s: this.returnDescriptor("s",instance),
					sMan: this.returnDescriptor("sMan",instance),
					l: this.returnDescriptor("l",instance)
				}
			);
			this.instance = instance;
		};
		_LexiconMonoSeq.prototype.AnimLedger.prototype.nonCancelableFrames = ["_r","_l"];
		_LexiconMonoSeq.prototype.AnimLedger.prototype.returnDescriptor = function(key,instance){
			//instance["_" + key] = undefined;
			var obj = Object();
			obj.configurable = false;
			obj.get = function(){return this["_"+key];};
			obj.set = function(v){
				this["_"+key] = v; 
				if(v === undefined) {
					if(this.getKeys().every(function(d,i){return this[d] === undefined},this)) {
						instance.state = "IDLE";
					}
				}
			};
			return obj;
		};
		_LexiconMonoSeq.prototype.AnimLedger.prototype.getKeys = function(){
			return Object.keys(this).filter(function(d,i){return d.slice(0,1) === "_"});
		};
		_LexiconMonoSeq.prototype.AnimLedger.prototype.getCancelable = function(){
			return this.getKeys().filter(function(d,i){return !~this.nonCancelableFrames.indexOf(d);},this);
		};
		_LexiconMonoSeq.prototype.AnimLedger.prototype.cancelFrames = function(){
			this.getCancelable()
			.forEach(function(d,i){
				window.cancelAnimationFrame(this[d]);
				this[d.slice(1)] = undefined;
			},this);
			return this;
		};
		_LexiconMonoSeq.prototype.AnimLedger.prototype.prepareForUpdate = function(arr){
			this.instance.state = "ANIM";
			this.instance.sequences.forEach(function(d,i){delete d.source});
			this._a = undefined;
			this.instance
				.set("_trackHeight",undefined)
				.set("_getMaxTrackLength",undefined)
				.set("_getMaxDisplayableChars",undefined)
				.set("_getMaxDisplayableSequences",undefined);
			return this;
		};
		/*
		###############################
		###########ANIM LEDGER#########
		###############################
		*/
		/*
		###############################
		############SEQUENCE###########
		###############################
		*/
		_LexiconMonoSeq.prototype.Sequence = function (seqObj,instance){
			var that = this,
				div = document.createElement("div"),
				svg = this.svg = instance.SVG(div),
				textDiv = div.appendChild(document.createElement("div")),
				textSlab = div.appendChild(document.createElement("div"));
				
			this
				.set("rm",false)
				.set("_rm",false)
				/*painter:undefined, assigned during appending*/
				.set("div",div)
				.set("style",div.style)
				.set("svg",svg)
				.set("styleSVG",svg.style)
				.set("textDiv",textDiv)
				.set("styleTextDiv",textDiv.style)
				.set("textSlab",textSlab)
				.set("styleTextSlab",textSlab.style)
				.set("parent",instance)
				.set("seq",seqObj.seq)
				.set("type",seqObj.type)
				/*source:this, temporarily added later on update*/
				.set("charWidth",seqObj.charWidth || 1)
				.set("name",seqObj.name)
				.set("posOffset",seqObj.posOffset || 0)
				.set("isVisible",true);
				
			this.style.transform = "translate(" + (-1 * instance.viewportWidth) + "px,0px)";
			this.style.opacity = 0;
			div.className = "LexiconMonoSeq sequence custom";
			svg.setAttribute("class","LexiconMonoSeq custom");
			textDiv.className = "LexiconMonoSeq textDiv custom";
			textSlab.className = "LexiconMonoSeq textSlab custom";
			textSlab._transformX = 0;
			textSlab._textColor = "rgba(0,0,0,0)";
			instance.div.appendChild(div);
			new instance.Rect(this);
			seqObj = undefined;//allow garbage collection
		};
		Object.defineProperties(
			_LexiconMonoSeq.prototype.Sequence.prototype,
			{
				trackRect: {
					configurable: false,
					get: function(){
						if (this._trackRect) {
							return this._trackRect;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._trackRect;
						});
						return this._trackRect = this.svg.getBoundingClientRect();
					}
				},
				slabRect: {
					configurable: false,
					get: function(){
						if (this._slabRect) {
							return this._slabRect;
						}
						var that = this;
						window.requestAnimationFrame(function(){
							delete that._slabRect;
						});
						return this._slabRect = this.textSlab.getBoundingClientRect();
					}
				},
				trackHeight: {
					configurable: false,
					get:function(){
						var trackHeight = this.parent._trackHeight;
						if(trackHeight) {
							return trackHeight;
						}
						return this.parent._trackHeight = this.trackRect.height;
					}
				},
				unitLength: {
					configurable: false,
					get:function(){
						return this.seq.length * this.charWidth;
					}
				},
				isInTrack: {
					configurable: false,
					writable:false,
					value:function(point){
						var rect = this.trackRect;
						return (point.x - rect.left > 0) && (point.x - rect.left < rect.width);
					}
				},
				visibleRange: {
					configurable: false,
					get:function(){
						var currentPosLeft = this.parent.getCurrentPosLeft,
							pLeft = currentPosLeft.posLeft - (this.posOffset - currentPosLeft.posOffset),
							charWidth = this.charWidth,
							uLen = this.unitLength,
							offset = -(pLeft / charWidth % 1),
							maxDisplayableChars = this.parent.getMaxDisplayableChars/charWidth,
							start = pLeft/charWidth,
							end = start + maxDisplayableChars;
						if (pLeft >= uLen) {return -1}
						return {start:start,end:end,offset:offset};
					}
				},
				adjustRange: {
					configurable: false,
					writable:false,
					value:function(range){
						var charWidth = this.charWidth,
							maxDisplayableChars = this.parent.getMaxDisplayableChars/charWidth,
							padding = this.parent.displayPadding * maxDisplayableChars,
							start = Math.max(0,range.start - padding | 0 ),
							end = Math.min(this.seq.length,Math.max(0,Math.ceil(range.end + padding)));
						return {start:start,end:end,offset:range.offset};
					}
				},
				rangeWithinRange: {
					configurable: false,
					writable:false,
					value:function(range,refRange){
						return (range.start - refRange.start >= 0) && (range.end - refRange.end <= 0);
					}
				},
				rangeEqual: {
					configurable: false,
					writable:false,
					value:function(range,refRange){
						return (range.start === refRange.start) && (range.end === refRange.end);
					}
				},
				withinVerticalRange: {
					configurable: false,
					get:function(){
						var i = this.parent.sequences.indexOf(this),
							range = this.parent.getVisibleRangeVertical;
						return ~i && !this.rm && (i >= range.start) && (i < range.end);
					}
				},
				toggleVisibility: {
					configurable: false,
					writable:false,
					value:function(show){
						show = !!show;
						if(show !== this.isVisible){
							this.isVisible = show;
							this.style.visibility = show ? "visible" : "hidden";
						}
						return this;
					}
				},
				update: {
					configurable: false,
					writable:false,
					value:function(t,options,uT){
						var instance = this.parent,
							index = instance.sequences.indexOf(this),
							textSlab = this.textSlab;
						if(!options.target){
							if(!this._rm){
								instance.toggleClass(this.div,"rm",true);
								instance.sequences.splice(index,1);
								this._rm = true;
							}
							this.style.transform = "translate(" + (options.viewportWidth * t) + "px,0px)";
							this.style.opacity = 1-t;
							if(t >= 1){
								this.div.parentNode && instance.div.removeChild(this.div);
							}
							return;
						}
						
						if (!options.firstCall){
							var lStart = " <" +(index + 1) + ". ",
								lEnd = " /> ",
								pad = lStart.length + lEnd.length,
								rem = instance.maxAllowedLabelLength - pad,
								lMid = this.name.length > rem ? this.name.slice(0,rem - 3) + "..." : (this.name + instance._50spaces).slice(0,rem),
								lAll = lStart + lMid + lEnd;
							if(lAll.length !== instance.maxAllowedLabelLength){
								instance.scrollLeftOffset = instance.fontWidth * lAll.length;
								instance.divStyle.transform = "translate(" + instance.scrollLeftOffset + "px,0px)"; 
							}
							this.textDiv.textContent = lAll;
							textSlab._textColorInterpolator = instance.ColorShiftRgba(textSlab._textColor,instance.textColors[this.type] || "rgba(0,0,0,0.9)");
							options.firstCall = true;
						}
						
						if (uT < 1){
							this.styleTextSlab.color = textSlab._textColorInterpolator(t);
						} else {
							this.styleTextSlab.color = textSlab._textColor = textSlab._textColorInterpolator(t);
						}
					}
				},
				set: {
					configurable: false,
					writable: false,
					value: function(k,v){
						this[k] = v;
						return this;
					}
				}
			}
		);
		/*
		###############################
		############SEQUENCE###########
		###############################
		*/
		/*
		###############################
		##############RECT#############
		###############################
		*/
		_LexiconMonoSeq.prototype.Rect = function(seqInstance){
			var unitType = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE,
				p = seqInstance.parent;
			seqInstance.rects = this;
			this.id = p.generateRandomString();
			this.parent = seqInstance;
			this.svg = seqInstance.svg;
			this.cNodes = this.svg.childNodes;
			this.stopWidths = [];
			this.stopOffsets = [];
			this.stopColors = [];
			this.stopOpacities = [];
			this.paintedRange = {start:-1,end:-1};
			this.fragment = document.createDocumentFragment();
			this.depot = new this.Depot(this);
		};
		_LexiconMonoSeq.prototype.Rect.prototype.getVal = function(n,v) {
			return n[v].baseVal.value;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.setAttr = function(n,k,v){
			return this.chain(n).setAttr(k,v);
		};
		_LexiconMonoSeq.prototype.Rect.prototype.setVal = function(n,k,v){
			return this.chain(n).setVal(k,v);
		};
		_LexiconMonoSeq.prototype.Rect.prototype.chain = function(n){
			return n._chain || (n._chain = new this.Chain(n));
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Chain = function(n){
			this.n = n;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Chain.prototype.u = SVGUnitTypes.SVG_UNIT_TYPE_USERSPACEONUSE;
		_LexiconMonoSeq.prototype.Rect.prototype.Chain.prototype.setAttr = function(k,v){
			this.n.setAttribute(k,v);
			return this;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Chain.prototype.setVal = function(k,v){
			this.n[k].baseVal.newValueSpecifiedUnits(this.u,v);
			return this;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.rect = (function(){
			return this.setAttr(document.createElementNS("http://www.w3.org/2000/svg","rect"),"fill","#ffffff")
			.setAttr("fill-opacity",0)
			/*.setAttr("stroke-width",0)*/
			.setVal("width",1)
			.setVal("height",1)
			/*.setVal("rx",0.125)*/
			.setVal("x",0)
			/*.setVal("y",0)*/
			.n;
		}).call(_LexiconMonoSeq.prototype.Rect.prototype);
		_LexiconMonoSeq.prototype.Rect.prototype.setViewBox = function(nSVG,viewBox){
			var SVGViewBox = nSVG.viewBox.baseVal,
				key;
			for(var key in viewBox) {
				viewBox.hasOwnProperty(key) && (SVGViewBox[key] = viewBox[key]);
			}
			return nSVG;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.update = function(force){
			var p = this.parent.parent,
				seqInstance = this.parent,
				that = this,
				depot = this.depot;
			if(seqInstance.rm){
				return;
			}
			if(!seqInstance.withinVerticalRange){
				depot.claim();
				return;
			}
			var options = seqInstance.options,
				vR = seqInstance.visibleRange;
			if(!force && seqInstance.rangeWithinRange(vR,that.paintedRange) && seqInstance.isVisible){
				return;
			}
			var aR = seqInstance.adjustRange(vR),
				dR = aR.end - aR.start;
			if(!dR){
				return
			}
			depot.claim(dR);
			var fragmentNodes = [],
				cNodeLength = that.cNodes.length,
				l = 0;
			for(;l < cNodeLength;++l){
				fragmentNodes.push(that.cNodes[l])
			}
			depot.borrow(fragmentNodes,dR);
			var seq = seqInstance.seq,
				type = seqInstance.type,
				uC = options.uC;
			var i,
				j,
				k,
				m,
				n,
				o;
			m = options.stopOffsets = [];
			for(i = 0,j = aR.start;i<dR;++i){
				m.push((j + i) * uC);
			}
			m = options.stopOpacities = [];
			for(i = 0,n = p.opacities[type];i<dR;++i){
				k = +n[seq[j + i]];
				m.push(k === k ? k : 0.8);
			}
			m = options.stopColors = [];
			n = that.stopColors;
			for(i = 0,k = n.length,o = p.colors[type];i<k;++i){
				m.push(p.ColorShift(n[i],o[seq[j + i]]));
			}
			options.rects = that;
			options.aR = aR;
			var relocate;
			l = fragmentNodes.length;
			if (that.paintedRange.end - aR.end >= dR){
				relocate = (aR.start + dR + 1) * uC;
				while (~--l) {
					that.stopOffsets[l] = relocate;
				}
			} else if (aR.start - that.paintedRange.start >= dR) {
				relocate = (aR.start - dR) * uC;
				while (~--l) {
					that.stopOffsets[l] = relocate;
				}
			} else if (seqInstance.rangeEqual(this.paintedRange,aR)) {
				relocate = (aR.start + aR.end) / 2 * uC;
				while (~--l) {
					that.stopOffsets[l] = relocate;
				}
			}
			//max relocateRight, in case --> p._getMaxTrackLength - options.viewportWidth * (1 + 2 * p.displayPadding)
			if(relocate = relocate / options.svgWidthInUnits * options.svgWidthInPx){
				seqInstance.textSlab._transformX = relocate;
			}
			that.paintedRange = aR;
			seqInstance.painter.schedulePaint(fragmentNodes,options);
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Depot = function(rect){
			this.isEmpty = true;
			this.parent = rect;
			this.rect = rect.rect;
			this.svg = rect.svg;
			this.cNodes = rect.cNodes;
			this.mockSVG = rect.parent.parent.SVG();
			this.mockSVG.style.display = "none";
			this.fragment = rect.fragment;
			this.stopColors = rect.stopColors;
			this.stopOffsets = rect.stopOffsets;
			this.stopOpacities = rect.stopOpacities;
			this.stopWidths = rect.stopWidths;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Depot.prototype.nodes = [];
		_LexiconMonoSeq.prototype.Rect.prototype.Depot.prototype.claim = function(limit){
			if (limit) {
				while(this.cNodes.length > limit) {
					this.nodes.push(this.svg.removeChild(this.svg.lastChild));
					this.stopOffsets.pop();
					this.stopColors.pop();
					this.stopOpacities.pop();
					this.stopWidths.pop();
				}
			} else {
				while(this.svg.hasChildNodes()) {
					this.nodes.push(this.svg.removeChild(this.svg.lastChild));
					this.stopOffsets.pop();
					this.stopColors.pop();
					this.stopOpacities.pop();
					this.stopWidths.pop();
				}
			}
			return this;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Depot.prototype.borrow = function(arr,dR){
			var node;
			while(arr.length < dR) {
				node = this.nodes.pop() || this.rect.cloneNode(false);
				arr.push(this.fragment.appendChild(node));
				this.stopOffsets.push(0);
				this.stopColors.push("#ffffff");
				this.stopOpacities.push(0);
				this.stopWidths.push(1);
			}
			this.isEmpty && (this.isEmpty = false);
			return this;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Depot.prototype.emptyFragment = function(){
			this.mockSVG.appendChild(this.fragment);
			while(this.mockSVG.hasChildNodes()){
				this.nodes.push(this.mockSVG.removeChild(this.mockSVG.lastChild));
				this.stopOffsets.pop();
				this.stopColors.pop();
				this.stopOpacities.pop();
				this.stopWidths.pop();
			}
			!this.isEmpty && (this.isEmpty = true);
			return this;
		};
		_LexiconMonoSeq.prototype.Rect.prototype.Depot.prototype.transfer = function(){
			this.svg.appendChild(this.fragment);
			this.isEmpty = true;
		};
		/*
		###############################
		##############RECT#############
		###############################
		*/
		/*
		###############################
		##############EASE#############
		###############################
		*/
		_LexiconMonoSeq.prototype.Ease = function(p1,p2,options){
			this._resolution = (options && options.resolution) || 1000;
			this._precision = (options && options.precision) ||  1e-6;
			this._arr = [];
			this.registerEase(p1,p2);
			var that = this,
				arr = this._arr,
				l = arr.length,
				max = Math.max,
				min = Math.min;
			return function(t){
				return arr[((l - 2) * max(0,min(t,1)) | 0)];
			}
		};
		_LexiconMonoSeq.prototype.Ease.prototype.returnParametric = function(xy,p1,p2,derivative){
			if (derivative) {
				return function(t){return 3 * t * t * (1 + 3 * p1[xy] - 3 * p2[xy]) + 6 * t * ( p2[xy] - 2 * p1[xy]) + 3 * p1[xy]}
			} else {
				return function(t){return 3 * p1[xy] * (1 - t) * (1 - t) * t +  3 * p2[xy] * (1 - t) * t * t + t * t * t}
			}
		};
		_LexiconMonoSeq.prototype.Ease.prototype.registerEase = function(p1,p2){
			var parX = this.returnParametric("x",p1,p2),
				dParX_dt = this.returnParametric("x",p1,p2,true),
				parY = this.returnParametric("y",p1,p2),
				dParY_dt = this.returnParametric("y",p1,p2,true),
				arr = this._arr,
				resol = this._resolution,
				step = 1/resol,
				previous;
			resol += 1;
			for(var i = 0,t,y;i<=resol;++i){
				t = previous = this.getCloseXTo(step*i,parX,dParX_dt,previous,this._precision);
				y = parY(t);
				arr.push(y);
			}
			return this;
		};
		_LexiconMonoSeq.prototype.Ease.prototype.getCloseXTo = function(yValue,f,fDer,previous,precision){
			for(var max=1/precision,min=-1*max,xGuess = yValue,yGuess,dX,dY = 2*precision;dY/precision|0;){
				yGuess = f(xGuess);
				dY = yGuess - yValue;
				dX = dY/fDer(xGuess);
				xGuess -= dX;
				if(xGuess >= max || xGuess <= min){
					throw new RangeError("Target cannot be reached!");
				}
			}
			if(xGuess !== xGuess){
				xGuess = previous;
			}
			return xGuess;
		};
		/*
		###############################
		##############EASE#############
		###############################
		*/
		_LexiconMonoSeq.prototype.ease = new _LexiconMonoSeq.prototype.Ease({x:0.75,y:0},{x:0.25,y:1});
		_LexiconMonoSeq.prototype.easeElastic = new _LexiconMonoSeq.prototype.Ease({x:1,y:-1},{x:0,y:2});
		/*
		###############################
		############PAINTER############
		###############################
		*/
		_LexiconMonoSeq.prototype.Paint = function(instance){
			var that = this;
			this.parent = instance;
			this.tasks = Object.defineProperties({},
				{
					_clearFrame: {
						configurable:false,
						writable: false,
						value: function(id,doNotResume){
							that.frames[id] && window.cancelAnimationFrame(that.frames[id]);
							delete that.frames[id];
							if(!doNotResume && !Object.keys(that.frames).length && that.active){
								this._resumeTask();
							}
						}
					},
					_setTask: {
						configurable:false,
						writable: false,
						value: function(id,tasks){
							if(!Object.keys(that.frames).length){
								that.active = false;
							}
							that.tasks[id] = tasks;
							if(!that.active){
								that.active = true;
								tasks[0]();
							}
						}
					},
					_resumeTask: {
						configurable:false,
						writable: false,
						value: function(){
							var rndKey = this._rndKey;
							if(rndKey){
								that.tasks[rndKey][0]();
							} else {
								that.active = false;
							}
						}
					},
					_rndKey: {
						configurable:false,
						get: function(){
							var keys = Object.keys(this).filter(function(d,i){return d.slice(0,1) !== "_";}),
								i = Math.random() * keys.length | 0,
								key = keys[i];
							return key;
						}
					},
					_destroyTasks: {
						configurable:false,
						writable: false,
						value: function(){
							for (var i = 0,keys = Object.keys(this),l = keys.length,key;i<l;++i) {
								key = keys[i];
								if (key.slice(0,1) !== "_") {
									delete this[key];
								}
							}
						}
					}
				}
			);
			this.frames = {};
			this.active = false;
			this.repaintScheduled = false;
		};
		_LexiconMonoSeq.prototype.Paint.prototype.schedulePaint = function(cNodes,options){
			var l = cNodes.length,
				taskLets = [];
			for(var i = 0,j=0,lastIndex = 0;i<l;++i,++j){
				if(!(j %= this.nodeLimit)){
					taskLets.push([cNodes[i]]);
					lastIndex = taskLets.length - 1;
					if(!i){
						taskLets[lastIndex]._firstTask = true;
					}
				} else {
					taskLets[lastIndex].push(cNodes[i]);
				}
				cNodes[i]._i = i;
			}
			options.tasks = taskLets.map(function(d,i){return this.transformToTask(d,options);},this);
			this.tasks._setTask(options.rects.id,options.tasks);
		};
		//_LexiconMonoSeq.prototype.Paint.prototype.ease = new _LexiconMonoSeq.prototype.Ease({x:1,y:-1.2},{x:0,y:2.2}); --> elastic(ish)
		_LexiconMonoSeq.prototype.Paint.prototype.ease = new _LexiconMonoSeq.prototype.Ease({x:0.5,y:0.1},{x:0.75,y:0.9});
		_LexiconMonoSeq.prototype.Paint.prototype.nodeLimit = 80;
		_LexiconMonoSeq.prototype.Paint.prototype.duration = 150;
		_LexiconMonoSeq.prototype.Paint.prototype.cornerRadius = 0;
		_LexiconMonoSeq.prototype.Paint.prototype.transformToTask = function(taskLet,options){
			var that = this,
				instance = that.parent,
				rects = options.rects,
				l = taskLet.length,
				startTime,
				recurse = function(t){
					startTime = startTime || t;
					t = (t - startTime)/that.duration;
					var tasks = options.tasks,
						_t = that.ease(t);
					if(taskLet._firstTask){
						instance.interpolateAndStoreArrInt(seqArr,nSeqArr,_t);
						textSlab.textContent = instance.strConcat(seqArr);
						sTextSlab.transform = "translate(" + (textSlab._transformX = transformXI + (transformXF - transformXI) * _t) + "px,0px)";
						if(!t && !depotTransfered){
							depotTransfered = true;
							rects.depot.transfer();
							seqInstance.toggleVisibility(true);
						}
					}
					for (var i = 0,j = 0,n=null;i<l;++i){
						n = taskLet[i];
						j = n._i;
						n.parentNode && rects.setVal(n,"width",instance.interpolateAndStoreAtEnd(rects.stopWidths,j,options.uC,t,_t))
						/*.setVal("rx",that.cornerRadius)*/
						.setVal("x",instance.interpolateAndStoreAtEnd(rects.stopOffsets,j,options.stopOffsets[j],t,_t))
						.setAttr("fill", t < 1 ? options.stopColors[j](_t) : (rects.stopColors[j] = options.stopColors[j](_t)))
						.setAttr("fill-opacity",instance.interpolateAndStoreAtEnd(rects.stopOpacities,j,options.stopOpacities[j],t,_t));
						
					}
					if(t >= 1) {
						tasks.shift();
						if(!tasks.length){
							delete that.tasks[rects.id];
							delete that.frames[rects.id];
							that.tasks._resumeTask();
						} else {
							tasks[0]();
						}
						return;
					}
					that.frames[rects.id] = window.requestAnimationFrame(recurse);
				},
				task = function(){
					that.frames[rects.id] = window.requestAnimationFrame(recurse);
				};
			if(taskLet._firstTask){
				var depotTransfered = false,
					seqInstance = options.target,
					textSlab = seqInstance.textSlab,
					sTextSlab = seqInstance.styleTextSlab,
					aR = options.aR,
					dR = aR.end - aR.start,
					nSeqArr = seqInstance.seq.slice(aR.start,aR.end).split("").map(function(d,i){return d.charCodeAt(0);}),
					seqArr = textSlab._seqArr = textSlab._seqArr || Array.apply(null,Array(dR)).map(function(d,i){return "@".charCodeAt(0);}),
					lastChar = seqArr[seqArr.length - 1],
					svgWidthInPx = options.svgWidthInPx,
					transformXI = textSlab._transformX,
					transformXF = options.transformXOffset + options.stopOffsets[0] / options.svgWidthInUnits * svgWidthInPx;
				while (seqArr.length < dR) {
					seqArr.push(lastChar);
				}
				while(seqArr.length > dR) {
					seqArr.pop();
				}
			}
			return task;
		};
		/*
		###############################
		############PAINTER############
		###############################
		*/
		/*
		###############################
		##########UPDATE FLOW##########
		###############################
		*/
		_LexiconMonoSeq.prototype.toggleLabels = function(show,options){
			window.cancelAnimationFrame(this.currentAnimationFrame.l);
			this.state = "ANIM";
			var that = this,
				startTime,
				initScrollLeftOffset = this.scrollLeftOffset,
				scrollLeftOffset,
				initOpacity = typeof this.sequenceTextDivOpacity === "number" ? this.sequenceTextDivOpacity : 1,
				opacity,
				duration = (options && options.duration) || 1500,
				ease = (options && options.ease)
						? new this.Ease(options.ease[0],options.ease[1],{resolution:options.easeResolution,precision:options.easePrecision})
						: this.easeElastic;
			if (show){
				scrollLeftOffset = this.fontWidth * this.maxAllowedLabelLength;
				opacity = 1;
			} else {
				scrollLeftOffset = 0;
				opacity = 0;
			}
			function toggle(t){
				startTime = startTime || t;
				t = (t - startTime)/duration;
				var _t = ease(t);
				that.scrollLeftOffset = initScrollLeftOffset + (scrollLeftOffset - initScrollLeftOffset) * _t;
				that.divStyle.transform = "translate(" + that.scrollLeftOffset + "px,0px)"; 
				var l = that.sequences.length,
					o;
				while(~--l){
					if((o = that.sequences[l]).rm){
						continue;
					}
					o.styleTextDiv.opacity = that.sequenceTextDivOpacity = initOpacity + (opacity - initOpacity) * t;
					if(!t && opacity) {
						o.styleTextDiv.visibility = "visible";
					} else if (t >= 1 && !opacity) {
						 o.styleTextDiv.visibility = "hidden";
					}
				}
				if(t >= 1){
					that.currentAnimationFrame.l = undefined;
					++that.scrollLeft;//trigger repaint
					return;
				}
				that.currentAnimationFrame.l = window.requestAnimationFrame(toggle);
			}
			this.currentAnimationFrame.l = window.requestAnimationFrame(toggle);
			return this;
		};
		_LexiconMonoSeq.prototype.removeSequences = function(arr,ledger){
			var that = this,
				mock = {viewportWidth:this.viewportWidth};
			arr.forEach(function(d,i){
				delete d.painter.frames[d.rects.id];
			});
			function remove(t){
				ledger.startTime = ledger.startTime || t;
				t = ledger.ease((t - ledger.startTime)/((ledger.options && ledger.options.duration) || 1500));
				var l = arr.length;
				while (~--l) {
					arr[l].update(t,mock);
				}
				if(t >= 1){
					that.currentAnimationFrame.r = undefined;
					return;
				}
				that.currentAnimationFrame.r = window.requestAnimationFrame(remove);
			}
			this.currentAnimationFrame.r = window.requestAnimationFrame(remove);
			return this;
		};
		_LexiconMonoSeq.prototype.appendSequences = function(arr,ledger){
			function append(t){
				ledger.startTime = ledger.startTime || t;
				t = ledger.ease((t - ledger.startTime)/((ledger.options && ledger.options.duration) || 1500));
				var l = arr.length,
					temp;
				while (~--l) {
					temp = arr[l].target;
					if(temp.rm){
						continue;
					}
					temp.style.transform = "translate(" + (arr[l].viewportWidth * (t-1)) + "px,0px)";
					temp.style.opacity = t;
				}
				if(t >= 1){
					return;
				}
				window.requestAnimationFrame(append);
			}
			window.requestAnimationFrame(append);
		};
		_LexiconMonoSeq.prototype.updateSequences = function(arr,ledger) {
			var that = this,
				frameKey = arr[0].source ? "u" : "a",
				fontWidth = this.fontWidth,
				viewportWidth = this.viewportWidth;
			arr = arr.map(function(d,i){
				var source = d.source || d;
				if(frameKey === "u") {
					d.seq = source.seq;	
					d.charWidth = source.charWidth || 1;
					d.type = source.type;
					d.name = source.name;
					d.posOffset = source.posOffset || 0;
				}
				var letterSpacingInChar = d.charWidth - 1,
					letterSpacing = letterSpacingInChar * fontWidth,
					svgWidthInUnits = d.unitLength * this.fontRatio,
					svgWidthInPx = d.unitLength * fontWidth,
					posOffsetTransform = d.posOffset * fontWidth,
					s = d.style,
					sTextDiv = d.styleTextDiv;
				s.letterSpacing = letterSpacing + "px";
				s.width = svgWidthInPx + "px";
				d.styleSVG.width = svgWidthInPx + "px";
				d.styleSVG.transform = posOffsetTransform ? "translate(" + posOffsetTransform + "px,0px)" : "none";
				sTextDiv.letterSpacing = "normal";
				d.rects.setViewBox(d.svg,{width: svgWidthInUnits});
				return d.options = {
					frameKey:frameKey,
					viewportWidth: viewportWidth,
					uC: d.charWidth * this.fontRatio,
					target:d,
					firstCall:false,
					posOffsetTransform: posOffsetTransform,
					transformXOffset: posOffsetTransform + letterSpacing/2,
					svgWidthInUnits: svgWidthInUnits,
					svgWidthInPx: svgWidthInPx
				};
			},this);
			if(frameKey === "a"){
				this.appendSequences(arr,{ease:ledger.ease,startTime:undefined,options:ledger.options});
			}
			this.repaint(true);
			function update(t) {
				var temp,
					l = arr.length,
					_t;
				ledger.startTime = ledger.startTime || t;
				t = (t - ledger.startTime)/((ledger.options && ledger.options.duration) || 1500);
				_t = ledger.ease(t);
				while(~--l && (temp = arr[l])){
					temp.target.update(_t,temp,t);
				}
				if(t >= 1){
					that.currentAnimationFrame[frameKey] = undefined;
					l = arr.length;
					while(~--l && (temp = arr[l])){
						delete temp.target.source;
					}
					return;
				}
				that.currentAnimationFrame[frameKey] = window.requestAnimationFrame(update);
			}
			this.currentAnimationFrame[frameKey] = window.requestAnimationFrame(update);
			return this;
		};
		/*
		###############################
		##########UPDATE FLOW##########
		###############################
		*/
		/*
		###############################
		#############STYLE#############
		###############################
		*/
		_LexiconMonoSeq.prototype.Style = function(instance){
			return [
					"body.lock-scroll {",
					"	overflow:hidden;",
					"}",
					".LexiconMonoSeqContainer {",
					"}",
					"div.LexiconMonoSeq,svg.LexiconMonoSeq {",
					"	border:0px;",
					"	margin:0px;",
					"	padding:0px;",
					"	box-sizing:border-box;",
					"}",
					"div.LexiconMonoSeq.wrapper {",
					"	width:100%;",
					"	height:100%;",
					"	overflow:auto;",
					"	font-size:16px;",
					"	-webkit-overflow-scrolling:touch;",
					"	font-family: Consolas"/*'Courier New', Monospace;"*/,
					"}",
					"div.LexiconMonoSeq.wrapper::-webkit-scrollbar-track {",
					"	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);",
					"	border-radius: 0px;",
					"	background-color: #F5F5F5;",
					"}",
					"div.LexiconMonoSeq.wrapper::-webkit-scrollbar {",
					"	width: 8px;",
					"	height: 8px;",
					"	background-color: #F5F5F5;",
					"}",
					"div.LexiconMonoSeq.wrapper::-webkit-scrollbar-thumb {",
					"	border-radius: 0px;",
					"	-webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);",
					"	background-color: #555;",
					"}",
					"div.LexiconMonoSeq.wrapper.drag {",
					"	cursor: move;",
					"}",
					"div.LexiconMonoSeq.main,div.LexiconMonoSeq.hidden {",
					"	font-size:100%;",
					"	white-space:pre;",
				instance.textRendering ? 
					"	text-rendering:" + instance.textRendering + ";" : 
					"",
				instance.fontKerning ? 
					"	font-kerning:" + instance.fontKerning + ";" :
					"",
				instance.webkitFontSmoothing ? 
					"	-webkit-font-smoothing:" + instance.webkitFontSmoothing + ";" : 
					"",
					"}",
					"div.LexiconMonoSeq.sequence {",
					"	display:table;",
					"}",
					"div.LexiconMonoSeq.textDiv {",
					"	background-color: rgba(0,0,0,0.8);",
					"	color: rgba(255,255,255,0.9);",
					"	display: table;",
					"	transform: translate(-100%,0%);",
					"}",
					"div.LexiconMonoSeq.textSlab {",
					"	position:absolute;",
					" 	top:0px;",
					"	left:0px;",
					"	z-index:-1;",
					"	height:100%;",
					"}",
					"svg.LexiconMonoSeq {",
					"	display:block;",
					"	position:absolute;",
					" 	top:0px;",
					"	left:0px;",
					"	height:100%;",
					"	z-index:-2;",
					"	overflow:hidden;",
					"}",
					"div.LexiconMonoSeq.hidden {",
					"	position:absolute;",
					"	top:1px;",
					"	left:1px;",
					"	visibility:hidden;",
					"}",
					"div.LexiconMonoSeq.busy {",
					"	position:absolute;",
					"	visibility:hidden;",
					"	z-index:1;",
					"	top:0px;",
					"	left:0px;",
					"	font-size:500%;",
					"}",
					"div.LexiconMonoSeq.wrapper.labelsOff > .main {",
					"	transform: translate(0px,0px) !important;",
					"}",
					"div.LexiconMonoSeq.wrapper.labelsOff .textDiv {",
					"	visibility: hidden !important;",
					"}"
					
			].filter(function(d,i){return d});
		};
		_LexiconMonoSeq.prototype.Style.string = function(instance){
			return this(instance).join("\n");
		};
		_LexiconMonoSeq.prototype.Style.array = function(instance){
			return this(instance);
		};
		/*
		###############################
		#############STYLE#############
		###############################
		*/
		/*
		###############################
		############SCROLL#############
		###############################
		*/
		_LexiconMonoSeq.prototype.scrollToPos = function(n,nY,options){
			window.cancelAnimationFrame(this.currentAnimationFrame.s);
			var that = this,
				e = (options && options.ease)
					? new this.Ease(options.ease[0],options.ease[1],{resolution:options.easeResolution,precision:options.easePrecision})
					: this.ease,
				d = (options && options.duration) || 1500,
				m = this.scrollToPos.methods,
				viewportWidth,
				viewportHeight,
				trackLength,
				trackHeight;
			that.state = "ANIM";
			that.currentAnimationFrame.s = window.requestAnimationFrame(function(){
				that.currentAnimationFrame.s = window.requestAnimationFrame(function(){
					viewportWidth = that.viewportWidth;
					viewportHeight = that.viewportHeight;
					that.currentAnimationFrame.s = window.requestAnimationFrame(function(){
						trackLength = that.getMaxTrackLength;
						trackHeight = that._trackHeight;
						that.currentAnimationFrame.s = window.requestAnimationFrame(m.moveTo(n,nY,that,e,d,viewportWidth,viewportHeight,trackLength,trackHeight));
					});
				});
			});
		};
		_LexiconMonoSeq.prototype.scrollToPos.methods = {
			moveTo: function(n,nY,that,e,d,vW,vH,tL,tH){
				var x = that.scrollLeft,
					x_p = Math.max(0,n/(tL.sequenceLength * tL.charWidth + tL.posOffset) * (tL.width + tL.posOffsetTransform) - vW/2),
					dx = (x_p - x),
					y = that.wrapper.scrollTop,
					y_p = typeof nY !== "number" ? y : Math.max(0, nY * tH - vH/2),
					dy = (y_p - y),
					startTime;
					f = function(t){
						startTime = startTime || t;
						t = (t - startTime)/d;
						var _t = e(t);
						that.scrollLeft = x + dx * _t;
						that.wrapper.scrollTop = y + dy * _t;
						if(t >= 1){
							that.currentAnimationFrame.s = undefined;
							return
						}
						that.currentAnimationFrame.s = window.requestAnimationFrame(f);
					};
				return f;
			}
		};
		_LexiconMonoSeq.prototype.repaintOnScroll = function(){
			var that = this,
				f = function(e){
					if(f._busy){return}
					that.currentAnimationFrame.sMan = window.requestAnimationFrame(function(){
						that.painters.every(function(d,i){return !d.repaintScheduled;}) && that.repaint();
						f._busy = false;
						that.currentAnimationFrame.sMan = undefined;
					});
					f._busy = true;
					that.state = "ANIM";
					that.busyStyle.top = that.container.scrollTop + "px";
				};
			return f;
		};
		/*
		###############################
		############SCROLL#############
		###############################
		*/
		/*
		###############################
		###########REPAINT#############
		###############################
		*/
		_LexiconMonoSeq.prototype.repaint = function(force){
			if(this.painters.some(function(d,i){return d.repaintScheduled})){return};
			this.painters.forEach(function(d,i){d.repaintScheduled = true;});
			var	counter = {counter:0,framesCleared:false},
				test = function(counter){
					if(this.state === "IDLE"){
						counter.counter++;
					} else {
						counter.counter = 0;
					}
					var seqs,l,depot,temp;
					if(counter.counter === 1 && !counter.framesCleared) {
						counter.framesCleared = true;
						seqs = this.sequences;
						l = seqs.length;
						while(~--l){
							temp = seqs[l];
							temp.painter.tasks._clearFrame(temp.rects.id,true);
						}
						this.painters.forEach(function(d,i){d.tasks._destroyTasks()});
					} else if(counter.counter === 23) {
						seqs = this.sequences;
						l = seqs.length;
						while(~--l){
							seqs[l].toggleVisibility(false);
						}
					} else if(counter.counter === 24) {
						seqs = this.sequences;
						l = seqs.length;
						while(~--l){
							depot = seqs[l].rects.depot;
							!depot.isEmpty && depot.emptyFragment();
						}
					}
					return counter.counter >= 25;
				},
				action = function(counter){
					var seqs = this.sequences,
						l = seqs.length;
					while(~--l){
						seqs[l].rects.update(force);
					}
					this.painters.forEach(function(d,i){d.repaintScheduled = false;});
				};
			this.watchman(this,test,action,counter);
		};
		/*
		###############################
		###########REPAINT#############
		###############################
		*/
		/*
		###############################
		###########WATCHMAN############
		###############################
		*/
		//copied from Mutaframe.com
		_LexiconMonoSeq.prototype.watchman = function(obj,test,action,options){
			var currentFrame = {value:undefined};
			function watch(){
				if(test.call(obj,options)){
					action.call(obj,options);
					return;
				} else {
					currentFrame.value = window.requestAnimationFrame(watch);
				}
			};
			currentFrame.value = window.requestAnimationFrame(watch);
			return currentFrame;
		};
		/*
		###############################
		###########WATCHMAN############
		###############################
		*/
		return LexiconMonoSeq;
	}));
