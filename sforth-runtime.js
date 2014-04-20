/**
The MIT License (MIT)

Copyright (c) 2013-2014 Bernd Amend <bernd.amend+sforth@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

// TODO optimize functions
String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

// TODO. ugly hack
String.prototype.replaceWholeWord = function(search, replacement, ch) {
    var target = this;
	ch = ch || [" ", "\t", "\n"];
	for(var i=0;i<ch.length;++i)
		for(var j=0;j<ch.length;++j)
			target = target.split(ch[i] + search + ch[j]).join(ch[i] + replacement + ch[j]);

	// handle the case where the search word is at the beginning
	if(target.substr(0, search.length) == search)
		target = replacement + target.substr(search.length);

	// or the end
	if(target.substr(target.length - search.length) == search)
		target = target.substr(0, target.length - search.length) + replacement;

	return target;
};

Number.isNumeric = function( obj ) {
	return !isNaN( parseFloat(obj) ) && isFinite( obj );
}

function forthClone(other) {
	return JSON.parse(JSON.stringify(other));
}

function forthCreateArgumentsArray(stack, count) {
	var args = new Array;
	for(var i=0;i<count; ++i)
		args.push(stack.pop());
	args.reverse();
	return args;
}

function ForthStack() {
	var intial_stack_size = 32;
	this.stac=new Array(intial_stack_size);
	this.pos = -1;

	this.pop=function() {
		if(this.pos == -1)
			throw new Error("Stack underflow");
		return this.stac[this.pos--];
	}

	this.push=function(item) {
		// TODO: should we throw an overflow?
		this.stac[++this.pos] = item;
	}

	this.pushIfNotUndefined=function(item) {
		if(item != undefined)
			this.stac[++this.pos] = item;
	}

	this.isEmpty=function() {
		return this.pos == -1;
	}

	this.size=function() {
		return this.pos+1;
	}

	this.top=function() {
		return this.get(0);
	}

	this.get=function(pos) {
		var realpos = this.pos-pos;
		if(realpos < 0)
			throw new Error("Stack underflow"); //?
		return this.stac[realpos];
	}

	this.remove=function(pos) {
		var realpos = this.pos-pos;
		if(realpos < 0)
			throw new Error("Stack underflow"); //?
		return this.stac.splice(realpos, 1);
	}

	this.clear=function() {
		this.stac = new Array(intial_stack_size);
		this.pos = -1;
	}

	this.getArray=function() {
		return this.stac.slice(0,Math.max(this.pos,0));
	}

	this.toString=function() {
		return this.getArray().toString();
	}

	this.toJSON=function() {
		return JSON.stringify(this.getArray());
	}

	this.fromJSON=function(str) {
		var l = JSON.parse(str);
		this.clear();
		for(var i=0;i<l.length;++i)
			this.push(l[i]);
	}
}

// create the global stack
var stack = new ForthStack();
var forth_macros = forth_macros || {};
