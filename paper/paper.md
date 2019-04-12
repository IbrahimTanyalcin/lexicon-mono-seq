---
title: 'Async Modules Supporting ES5 and ES6 with Control Flow'
tags:
 - ES5
 - async
 - javascript
 - requestAnimationFrame
 - js
 - biojs
 - bionode
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

*Lexicon-Mono-Seq* is a Multiple Sequence Alignment viewer ([MSA](https://en.wikipedia.org/wiki/Multiple_sequence_alignment)) that uses native DOM Text + SVG instead of HTML5 canvas.
The library uses requestAnimationFrame (rAF) to asychronously render blocks of sequences with the desired animation,duration and node limit.
It's about 11kB (as of version 0.15.12) minimized and does not need any transpiling to use in older browsers that do not support ES6.
The amount of sequences is limited to your browsers capacity, recommended limit is 8000 sequences with 100000 characters long each.

# References