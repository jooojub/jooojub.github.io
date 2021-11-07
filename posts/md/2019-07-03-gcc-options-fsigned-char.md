---
layout: post
title:  "gcc options: -fsigned-char"
date:   2019-07-03
share:	true
tags: [gcc_options]
keywords: [gcc-options, gcc, options, fsigned-char]
description: "These options control whether a bit-field is signed or unsigned, when the declaration does not use either signed or unsigned. By default, such a bit-field is signed, because this is consistent: the basic integer types such as int are signed types."
---

#### Requires
: compiler: gcc 2.8 later
***

If I use `char` without the compile option, is it `signed` or `unsigned`?
Results will vary by `architecture` and `compiler`.

Many people mostly write code thinking that `char` is `signed char`.
But this is dangerous code because it depends on architecture or compiler option.
This is a coding practice you should absolutely avoid, especially if you need to write architecture independent code.

The gcc compiler has a ->[^1]gcc option[/^] whether to treat `char` as `signed` or `unsigned`.

> -fsigned-char, -funsigned-char, -fno-signed-char", -fno-unsigned-char

There are many options, but in the end they are used in two senses.

> <b>char -> signed char</b>: -fsigned-char == -fno-unsigned-char<br>
> <b>char -> unsigned char</b>: -funsigned-char == -fno-signed-char

It's a very simple gcc option, and is also described in detail in the gcc documentation.

> #### gcc-7.4.0/C-Dialect-Options
> <b>-funsigned-char</b><br>
> Let the type `char` be `unsigned`, like `unsigned char</`.<br>
> <b>Each kind of machine has a default for what char should be. It is either like unsigned char by default or like signed char by default</b>.<br>
> Ideally, a portable program should always use signed char or unsigned char when it depends on the signedness of an object. But many programs have been written to use plain `char` and `expect it to be signed, or expect it to be unsigned`, depending on the machines they were written for. This option, and its inverse, let you make such a program work with the opposite default.<br>
> The type char is always a distinct type from each of signed char or unsigned char, even though its behavior is always just like one of those two.<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/C-Dialect-Options.html#C-Dialect-Optionsll"><code>https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/C-Dialect-Options.html#C-Dialect-Options</code></a></cite>

I haven't looked closely at the gcc version where this option first appeared, but gcc 2.8 already includes it.

```c
: git checkout gcc-2_8_0-release
$ cat ./gcc/toplev.c

char *lang_options[] =
{
	...
  "-fsigned-char",
  "-funsigned-char",
  "-fno-signed-char",
  "-fno-unsigned-char",
  ...
```
I can't find it in the gcc release notes, but in cpp it seems to have been added to gcc 3.1.

```c
: git checkout gcc-3_1-release
$ cat ./gcc/cppinit.c

#define COMMAND_LINE_OPTIONS                                      \
....
  DEF_OPT("fsigned-char",             0,      OPT_fsigned_char)
...
  DEF_OPT("funsigned-char",           0,      OPT_funsigned_char)
```

Let's take a look at the code to see if the option works as intended.

```c
: sample source code - char.c
#include <stdio.h>

int main(void) {
	char a = (1 << 8) - 1;

	printf("%d\n", a);

	return 0;
}
```
```bash
: gcc version 7.4.0 --target=x86_64-linux-gnu
$ gcc -o char char.c 
$ ./char
-1
```
`x86_64` and my compiler treat `char` as `signed char`.
Let's add the `-funsigned-char` option.

```bash
: gcc version 7.4.0 --target=x86_64-linux-gnu
$ gcc -funsigned-char -o char char.c 
$ ./char
255
```
Added <mark>-funsigned-char</mark> option to make `char` used as `unsigned char`
I looked at how each architecture handles `char' by default.

```x86asm
: x86_64 - default signed char
...
 652:	c6 45 ff ff          	movb   $0xff,-0x1(%rbp)
 /* 
  - movsbl (Move a Sign-extended Byte): signed char
  - movzbl (Move a Zero-extended Byte): unsigned char
 */
 656:	0f be 45 ff          	movsbl -0x1(%rbp),%eax
...
```

```armasm
: aarch64 - default unsigned char
...
 72c:	12800000 	mov	w0, #0xffffffff            	// #-1
 730:	39007fa0 	strb	w0, [x29, #31]
 /*
  - ldrsb (Load Register Signed Byte): signed char
  - ldrb (Load Register Byte): unsigned char
 */
 734:	39407fa1 	ldrb	w1, [x29, #31]
...
```
```mipsasm
: mips64 -default signed char
...
 10000b20:	2402ffff 	li	v0,-1
 10000b24:	a3c20000 	sb	v0,0(s8)
 /*
  - lb (Load Byte): signed char
  - lbu (Load Byte unsigned): unsigned char
 */
 10000b28:	83c20000 	lb	v0,0(s8)
...
```
```x86asm
: ppc - default unsigned char
 /*
  - lis (Load Immediate Shifted): signed char
  - li (Load Immediate): unsigned char
 */
 1000046c:	38 00 ff ff 	li      r0,-1
 10000470:	98 1f 00 0a 	stb     r0,10(r31)
```
I found a sample code on stack-overflow to easily check if a `char` is `signed` or `unsigned`.

```c
: sample code to check if a `char` is `signed` or `unsigned`
#include <stdio.h>

int main(void) {
  printf("%d\n", '\x80');

	return 0;
}
```
```bash
: result
{% highlight bash %}
$ gcc -o simple simple.c 
$ ./simple
-128

$ gcc -funsigned-char -o simple simple.c 
$ ./simple
128
```

In large projects, compile options are added globally, so it is common to unify the compile options for each process.

In other words, it seems better to write code explicitly using `signed char` or `unsigned char` instead of `char` in code where signed or unsigned is important rather than writing code depending on the compile option.

***
<ol>

[^1] The gcc documentation calls them <b>gcc commands</b>. I will use both terms interchangeably :)

</ol>