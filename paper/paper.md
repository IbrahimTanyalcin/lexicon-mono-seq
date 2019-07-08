---
title: 'Lexicon-Mono-Seq, DOM Text Based Async MSA Viewer'
tags:
 - ES5
 - async
 - JavaScript
 - requestAnimationFrame
 - js
 - BioJs
 - Bionode
 - alignment
 - sequence
 - bioinformatics
 - msa
authors:
 - name: Ibrahim Tanyalcin
   orcid: 0000-0003-0327-5096
   affiliation: 1
affiliations:
 - name: Vrije Universiteit Brussel
   index: 1
date: 12 April 2019
bibliography: paper.bib
---

# Summary

In Bioinformatics, one of the most common problems is depiction of long amino-acid / DNA sequences and their comparison [@Li2018]. Routinely, these sequences are aligned to a reference and the data is stored in common formats such as [clustal](http://www.clustal.org/download/clustalw_help.txt) [@clustal]. These alignments are called Multiple Sequence Alignments ([MSA](https://en.wikipedia.org/wiki/Multiple_sequence_alignment)) and can be viewed with a variety of different [tools](https://en.wikipedia.org/wiki/List_of_alignment_visualization_software).

*Lexicon-Mono-Seq* is an MSA viewer specially designed for browsers that use native [DOM Text](https://www.w3.org/TR/dom/#dom-node-textcontent) + [SVG](https://www.w3.org/TR/SVG11/) [@SnipViz;@EnsemblMView] instead of [HTML5 canvas](https://www.w3.org/TR/2011/WD-html5-20110525/the-canvas-element.html) [@MSAViewer;@IGV] or CLI [@asciigenome].

Several MSA viewers rely on rendering characters as an image using the *canvas* element. Although reliable and convenient, this can result in problems such as higher memory usage and blurred text (increasing resolution increases memory usage). 

*Lexicon-Mono-Seq* aims to approach the alignment viewing problem from the [DOM](https://www.w3.org/DOM/) (Document Object Model) perspective, each character is a combination of a [textNode](https://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-1312295772) and an [SVG Graphics Element](https://developer.mozilla.org/en-US/docs/Web/SVG/Element#Graphics_elements). The script recycles these nodes and paints only regions that are necessary [@Lexicon]. Comparison of sequences with different character widths is also a possibility, this allows one to compare amino acids and DNA regions within the same applet (i.e. one amino acid every three nucleotides in the DNA). *Lexicon-Mono-Seq* is agnostic about the character width of sequences, a dataset can have multiple sequences with different character widths.

At its core *Lexicon-Mono-Seq* is a monospace font ASCII character animation framework and comes with its own pre-baked easing functions, much like [CSS Cubic Bezier](https://developer.mozilla.org/en-US/docs/Web/CSS/timing-function) functions, which provide customizable and cached timing points for animations. Other fields such as creative coding or data visualization can use *Lexicon-Mono-Seq* for transitioning between ASCII maps or large heatmaps.

With minimal technical debt (no dependencies), the library uses [requestAnimationFrame](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame) (rAF) to asynchronously render blocks of sequences with the desired animation, duration and node limit.
The library is about 50kB (as of version 0.19.0) and does not need any transpiling to use in older browsers that do not support ES6 [@TC39].
The amount of sequences is limited to your browser's capacity, the recommended limit is 1000 sequences with 100000 letters each for commodity laptops/mobile devices.

*Lexicon-Mono-Seq* is suitable for developers who only want the functionality of a minimal MSA Viewer but desire to design their own interface around it. The script provides several utility functions that can be hooked to custom buttons as desired [@Npm;@GitHub].

# References
