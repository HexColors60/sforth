(
The MIT License (MIT)

Copyright (c) 2013 Bernd Amend <bernd.amend+sforth@gmail.com>

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
)

10 value consolebase

: type { x -- }
	x x " " === or x 0= or if
		typeof x " number " = if
			:[ process.stdout.write(x.toString(consolebase)) ]:d
		else
			:[ process.stdout.write(x.toString()) ]:d
		endif
	else
		:[ console.log(x); ]:d
	endif
;

: print { x -- }
	x type
	typeof x " number " = if space endif
;

: printnumberwithcomma { x -- }
	typeof x " number " = if
		:[ x.toString() ]: { y } " . " " , " y.replaceAll printdirect space
	endif
;

: hex2str { x1 -- x2 } " $ " 16 x1.toString + ;
: hexPrint hex2str . ;

: printstack
	" < " depth 1- " >  " + + . depth dup 0 swap 1
	?DO i
		dup i - pick type ."   "
	LOOP
	drop ;

: print-returnstack
	:[ if(!this.returnStack) return ]:d \ return if no return stack exists
	this.returnStack to returnStack \ get the return stack of the caller
	" < " rdepth " >  " + + . rdepth 1- rdepth 0 swap 1
	?DO i
		dup i - rpick type ."   "
	LOOP
	drop ;

: emit ( x -- ) String.fromCharCode . ;

: space ( -- ) ."   " ;
: cr ( -- ) ." \n " ;

: clearcurrentline ." \r\033[K " ;

: binary ( -- ) 2 to consolebase ;
: decimal ( -- ) 10 to consolebase ;
: hex ( -- ) 16 to consolebase ;
