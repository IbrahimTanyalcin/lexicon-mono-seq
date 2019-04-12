---
title: Lexicon-Mono-Seq, DOM Text Based Async MSA Viewer
layout: post
---

# LexiconMonoSeq

[![Codacy Badge](https://api.codacy.com/project/badge/Grade/72bacfc56cec45c686639e69f9bb7126)](https://www.codacy.com/app/IbrahimTanyalcin/lexicon-mono-seq?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=IbrahimTanyalcin/lexicon-mono-seq&amp;utm_campaign=Badge_Grade)
[![DOI](https://zenodo.org/badge/179171317.svg)](https://zenodo.org/badge/latestdoi/179171317)
[![DOI](https://joss.theoj.org/papers/9fbf126b501ad921825f755732450278/status.svg)](https://joss.theoj.org/papers/9fbf126b501ad921825f755732450278)
![npm](https://img.shields.io/npm/v/lexicon-mono-seq.svg)

LexiconMonoSeq is a multiple sequence alignment viewer ([MSA](https://en.wikipedia.org/wiki/Multiple_sequence_alignment)) that works with *monospace* fonts. You can use this tool for showing any arbitrary number of strings as well. The library renders DOM Text asynchronously.

## Dependencies

None.

## Usage
```JavaScript
LexiconMonoSeq(
    "#yourContainer",
    {parallelRendering:5}
).update([
    {
        name:"string1",
        charWidth:2,
        seq:"SOMETEXT",
        type:"alphabet"
    },
    {
        name:"string2",
        seq:"ATCG",
        type:"dna"
    }
]);
```
## Loading the script

*LexiconMonoSeq* supports [*UMD*](https://github.com/umdjs/umd). Use a derivate of the below link, based on the version you want:

`<script src="https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/lexiconMonoSeq.v0.15.10.js"></script>`

Above link can change if a new release is published. You can try adding the repo version (0.15.10 etc.):

`<script src="https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq@version/lexiconMonoSeq.v@version.js"></script>`

Alternatively you can requests all versions from here:

`<script src="https://distreau.com/lexicon-mono-seq/js/lexiconMonoSeq.v0.15.10.js"></script>`

Include the tag either within `body` or `head`

## A word about the fonts

*LexiconMonoSeq* works with [monospace fonts](https://en.wikipedia.org/wiki/Monospaced_font) only, since fixed width characters are desired for proper alignment. Nonetheless, due to vender differences in font rendering, a few millipixel shift is normal.

You can use your custom monospace fonts, but make sure they are properly loaded before you create an instance. If the fonts are loaded later or you changed them, invoke the `reDraw` method of the instace to recalculate styles:

```JavaScript
instace.reDraw();
```

If you really wanna be on the safe side for both Mac and Windows, use *Courier New* font. 

If you load your custom fonts with `@import`, `@font-face` or `link` etc., give a small break after you create an instance, to allow browser calculations to kick-in. This time is possibly vendor dependent and usually a tick (~17ms) is sufficient. So instead of:

```JavaScript
LexiconMonoSeq("#test",{parallelRendering:5}).update(yourDataSet,{durationPaint:500,duration:500})
```
Do this:

```JavaScript
LexiconMonoSeq("#test",{parallelRendering:5}).skipFrames(30).then(function(){this.update(yourDataSet,{durationPaint:500,duration:500})}).then(...
```
Above will skip 30 frames (considering 60 frames = 1 second) and then update, giving browser to correctly render the custom font.

## Examples

### 1

![example1](https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/images/example1.gif)

> #### [See script](https://github.com/IbrahimTanyalcin/lexicon-mono-seq/blob/master/examples/example-1.html)
> #### [Run Example](https://distreau.com/lexicon-mono-seq/examples/example-1.html)

*LexiconMonoSeq* comes with static (directly attached to the main function) methods that allows you to attach a *ruler* to your object, it finds the longest sequence and adds a ruler either to top of bottom of your dataset:

```JavaScript
let newDataset = LexiconMonoSeq.createRuler(oldDataset,true);
```

You can then use as you normally would:

```JavaScript
instance.update(obj,{durationPaint:500});
```
The second argument above are additional options which you can pass to *LexiconMonoSeq*.

### 2

![example2](https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/images/example2.gif)

> #### [See script](https://github.com/IbrahimTanyalcin/lexicon-mono-seq/blob/master/examples/example-2.html)
> #### [Run Example](https://distreau.com/lexicon-mono-seq/examples/example-2.html)

You do not have to instantiate a new version each time your object changes, you can repeteadly call <code>update</code> method to redraw sequences. Things to be removed/added/changed are arranged automatically.

### 3

![example3](https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/images/example3.gif)

> #### [See script](https://github.com/IbrahimTanyalcin/lexicon-mono-seq/blob/master/examples/example-3.html)
> #### [Run Example](https://distreau.com/lexicon-mono-seq/examples/example-3.html)

If you ever need to get coordinates and data from *LexiconMonoSeq*, you can pass the evet to its <code>getInfoFromEvent</code> method:

```JavaScript
let info = instance.getInfoFromEvent(e);
```
Info looks like:

```JavaScript
{
    detail: "HIT", //pointer on valid target
    letter: "1", //character
    offset: 0.7847994668032854, //left offset in unit width
    pos: 42, //position in sequence
    rPos: 42, //position with respect to visible region
    state: "IDLE", //whether instance is in animation
    target: [Object], //sequence object
    trackNumber: 17 //vertical track number
}
```

You can also use the <code>getInfoFromRect</code> method to receive sequences from minimal bounding region of a given *DOM Rect* or *Object* with `top`,`left`,`width` and `height` properties supplied by the user.

### 4 

![example4](https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/images/example4.gif)

> #### [See script](https://github.com/IbrahimTanyalcin/lexicon-mono-seq/blob/master/examples/example-4.html)
> #### [Run Example](https://distreau.com/lexicon-mono-seq/examples/example-4.html)

You can automatically scroll to any horizontal/vertical position, for a dataset of 10000 letters length max and 1000 sequences:

```JavaScript
instance.scrollToPos(Math.random()*10000,Math.random()*1000)
```
Above would scroll to some random position along the map.

### 5

![example5](https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/images/example5.gif)

> #### [See script](https://github.com/IbrahimTanyalcin/lexicon-mono-seq/blob/master/examples/example-5.html)
> #### [Run Example](https://distreau.com/lexicon-mono-seq/examples/example-5.html)

You can always register new types using <code>registerType</code>:

```JavaScript
instance.registerType(
    "asciiArt",
    { //charater background colors
        " ":"#ffffff",
        "▄":"#22ee00",
        "▐":"#0022ee",
        "░":"#aa00aa",
        "▌":"#ee2200",
        "█":"#ee22ee",
        "▀":"#00ee22"
    },
    "rgba(0,0,0,0.9)" //textColor
);
```
### 6 

![example6](https://cdn.jsdelivr.net/gh/IbrahimTanyalcin/lexicon-mono-seq/images/example6.gif)

> #### [See script](https://github.com/IbrahimTanyalcin/lexicon-mono-seq/blob/master/examples/example-6.html)
> #### [Run Example](https://distreau.com/lexicon-mono-seq/examples/example-6.html)

You can also read clustal.wl files if you provide them to *LexiconMonoSeq* as a string:

```JavaScript
instance.update(LexiconMonoSeq.readClustal(String))
```

## Creating an instance

> LexiconMonoSeq ( *container_ID_String_Or_Node_Reference* [ , *options* ] )

Above implicity returns a new instance of LexiconMonoSeq. Options is an *Object* with several keys of which if don't exist, browser defaults are applied:

```JavaScript
{
    textRendering: String //CSS text-rendering value
    fontKerning: String //CSS font-kerning value
    webkitFontSmoothing: String //CSS -webkit-font-smoothing
    parallelRendering: Number //Number of sequences that can be rendered simultaneously
    ease: Object //2 element array of points with x,y coords like in CSS Cubic-bezier (http://cubic-bezier.com). For instance [{x:0.75,y:0},{x:0.25,y:1}] gives a slow-in-out effect.
    easeResolution: Number //Number of cached points along animation curve, default is 1000 and is sufficient for 60fps
    easePrecision: Number //A decimal float value that determines how mathematically close the calculated animation points are. Default is 1e-6, smaller is more exact.
    duration: Number //Number in milliseconds that controls sliding animation duration of new/updated/removing sequences, default is 1500
    easePaint: Object //Default is [{x:0.5,y:0.1},{x:0.75,y:0.9}] 
    durationPaint: Number //Number in milliseconds that controls the sliding of the colored background rectangles and text animation, default is 150
    labels: Boolean //Whether labels should be visible, default is true
}
```

## Updating data

> instance.update ( *data* [ , *options* ] )

Data is an array of Object 's which each have at LEAST 3 properties:
- seq: a String of sequence like "ABCDEF.."
- name: a String that will be the name of the sequence such as "Sequence-1"
- type: a registered type, default types are "aa" (amino acid), "dna" (DNA), "ruler", "alphabet" and "number". You can register new types by using the <code>registerType</code> method.
- charWidth: **OPTIONAL**. Controls how wide the characters are, for instance a value of 5 means each char will be 5 characters wide.

Options are similar to [Creating an instance](#creating-an-instance), **EXCEPT** that the following **CANNOT** be used:

- textRendering
- fontKerning
- webkitFontSmoothing
- parallelRendering

When no options are given, previous options if any are used. A new option overrides the older ones.

## Static Methods

> LexiconMonoSeq.createRuler ( *data* , [ *inject* [, *unshift_or_push*]])

Crates a new object of type *ruler* and returns it if *inject* is false. Otherwise unshifts the new object into your data (mutates!) and returns the entire data. If *unshift_or_push* is set to true, then the object is added at the end of the array instead.

> LexiconMonoSeq.readClustal ( *clustalString* [ , *options* ] )

Reads a clustal file and returns a dataset to be used later with `update` method. Options is an *Object* that can have 2 properties, `charWidth` and `type`. Default `charWidth` is 1 and `type` is "aa".  

## Methods

Below are a non-exhaustive list of methods that might be of use to the user.

- `instance.generateRandomString ()` *// generates mostly 7-8 digit hex number*
- `instance.registerType` ( *name* [ , *colors* [ , *textColor* [ , *opacities* ] ] ] ) *// adds new color palette*
- `instance.reDraw` ( ) *// re-calculates layout and renders data, use this if you changed the viewport size or the font-family*
- `instance.repaint` ( [, *force* ] ) *// requests a repaint without triggering layout calculations, if force is true, then it also forces rendering of tiles that do not need repaint. reDraw method internally calls this method but it additionally forces layout calculations. This method is lighter*
- `instance.detach` ( ) *// clears the last update Object from cache, loosing reference to it*
- `instance.toggleClass` ( *node* , *className* [ , *boolean* ] ) *// changes class of a node, it is chainable, when chaining you can omit the first parameter*
- `instance.getInfoFromEvent` ( *event* ) *// returns info from a pointer coordiante*
- `instance.garbage` ( ) *// removes itself from Parent Node, call this when you want to clear the instance. Make sure you do not have reference to it anywhere*
- `instance.getInfoFromRect` ( DOM Rect ) *// returns the minimal rectangle ofsequences that contain the given boundaries*
- `instance.scrollToPos` ( *horizontalPos* [ , *verticalPos* [, *options* ] ] ) *// options can have keys ease and duration. Default ease is [{x:0.75,y:0},{x:0.25,y:1}]*
- `instance.enableDrag` ( [ , options ] ) *// allows drag behavior, an options object can be passed with start, drag and end properties where each is a function to execute on dragStart, drag and dragEnd event. The functions have "this" point to the instance and have the current DOM event as the first argument. The second argument is the options Object itself*
- `instance.disableDrag` ( ) *// disables drag behavior*
- `instance.skipFrames` ( *frameCount* ) *//Waits for specified amount of frames before executing the following thenable. It returns an object with 2 properties `then` and `skipFrames`. Function inside the thenable is executed with `this` pointing to the `instance` itself. This is usually used to delay update right after an instance is created, allowing CSS styles to kick in:
```JavaScript
    LexiconMonoSeq("#test",{parallelRendering:5})
    .skipFrames(30)
    .then(function(){
        this.update(yourDataSet,{durationPaint:500,duration:500})
    }).then(function(){
        console.log(this)
    }).skipFrames(5)
    .then(function(){
        console.log("done!");
    })
 ```
 Above would first create an `instace`, wait half a second, then update with new data, then after 1 frame (~17ms) `console.log` the `instance` itself, wait another 5 frames and finaly log "done!".

## Properties

Some non-exhaustive list of properties

- `instance.displayPadding` *// gets or sets the surplus residues rendered at the edges of the viewport. Default is 0.2, meaning if viewport is 100 letters wide, then 10 letters overflow on each side will be rendered*
- `instance.maxAllowedLabelLength` *// maximum label length in letters, overflowed part will be rendered in ellipsis (...)*
- `instance.painters` *// returns array of painter objects as determined by the parallelRendering option while instantiating LexiconMonoSeq*
- `painter.nodeLimit` *// each painter object has a default limit of 80 nodes to animate per duration. Remaining nodes will take turn*
- `instance._trackHeight` *//Gives the height of 1 sequence in pixels. Recalculated on reDraw*
- `instance._getMaxTrackLength` *//Returns an object with info about the longest sequence. Recalculated on reDraw*
- `instance._getMaxDisplayableChars` *//Returns the maximum displayable characters. Recalculated on reDraw*
- `instance._getMaxDisplayableSequences` *//Returns the max number of sequences that can be displayed. Recalculated on reDraw*
- `instance._dragEnabled` *//Returns true if drag behavior is enabled, otherwise returns a falsey value* 
- `instance._labels` *//Returns whether labels are enabled or not*

## Customizing CSS

The DOM hierachy looks like below:

> Container <-- div.LexiconMonoSeq.wrapper <-- div.LexiconMonoSeq.main <-- div.LexiconMonoSeq.sequence(s)..

Wrapper is the main element that fully extends to cover the container and gets vertical/horizontal scrollbars as necessary. This element is called the "viewport". 

When the script is first loaded a style object is appended to head with "data-name" attribute of "LexcionMonoSeqStyle". You can override these values by adding your custom style a "custom" class:

```CSS
div.LexiconMonoSeq.wrapper.custom {
    overflow: hidden;
}
```

## Extending LexiconMonoSeq

The inner constructor is not exposed, if you want to attach new methods directly attach it on the `LexiconMonoSeq`.

## Questions

You can contact me by opening an issue or twitter: **@ibrhmTanyalcin**




