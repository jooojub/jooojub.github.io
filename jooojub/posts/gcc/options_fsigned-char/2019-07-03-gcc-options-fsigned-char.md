---
layout: post
title:  "gcc options: -fsigned-char"
date:   2019-07-03
share:	true
tags: [gcc-options]
keywords: [gcc-options, gcc, options, fsigned-char]
description: "This option, and its inverse, let you make such a program work with the opposite default."
---

Requires :
 * compiler: gcc 2.8 later


If I declare `char` with no compile options, will it be regarded as `signed` or `unsigned`?<br>
The results are different for each of architecture. Maybe it depends on the compiler version.

Most of the time, naturally writing code with assuming that `char` is a `signed char`, but it is depends on the compiler options, which can sometimes be dangerous. Especially if you want to write architecture independent code.

The gcc ompiler has a options[^1] that allows you to set whether `char` is treated as `signed` or `unsigned`.

[^1]: The gcc documentation is also referred to as <b>gcc commands</b>. I will use it together.
> -fsigned-char, -funsigned-char, -fno-signed-char", -fno-unsigned-char

It looks like there's a lot of options, in the end it means just two things.
> <b>char -> signed char</b>: -fsigned-char == -fno-unsigned-char<br>
> <b>char -> unsigned char</b>: -funsigned-char == -fno-signed-char

It is a simple and explicit option, so it is also briefly described in the gcc documentation.

***
<table>
    <thead>
        <tr>
            <th>gcc-7.4.0/C-Dialect-Options</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <b>-funsigned-char</b><br>
                Let the type <b>char</b> be <b>unsigned</b>, like <b>unsigned char</b>.<br>
                <b>Each kind of machine has a default for what char should be. It is either like unsigned char by default or like signed char by default</b>.
                Ideally, a portable program should always use signed char or unsigned char when it depends on the signedness of an object. But many programs have been written to use plain <b>char</b> and <b>expect it to be signed, or expect it to be unsigned</b>, depending on the machines they were written for. This option, and its inverse, let you make such a program work with the opposite default.<br>
                The type char is always a distinct type from each of signed char or unsigned char, even though its behavior is always just like one of those two.
                <br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/C-Dialect-Options.html#C-Dialect-Optionsl"><code>https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/C-Dialect-Options.html#C-Dialect-Options</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***
I haven't checked in detail which version of the option was added, but it was already included in gcc 2.8.

#### -> git checkout gcc-2_8_0-release
{% highlight c %}
$ cat ./gcc/toplev.c

char *lang_options[] =
{
	...
  "-fsigned-char",
  "-funsigned-char",
  "-fno-signed-char",
  "-fno-unsigned-char",
  ...
{% endhighlight %}
It isn't noted in the release note, but in cpp, these options were added in gcc 3.1.
#### -> git checkout gcc-3_1-release
{% highlight c %}
$ cat ./gcc/cppinit.c

#define COMMAND_LINE_OPTIONS                                      \
....
  DEF_OPT("fsigned-char",             0,      OPT_fsigned_char)
...
  DEF_OPT("funsigned-char",           0,      OPT_funsigned_char)

{% endhighlight %}
Let's check the code to see if the options are work correctly.
### Check with code
#### -> sample source code: char.c
{% highlight c %}
#include <stdio.h>

int main(void) {
	char a = (1 << 8) - 1;

	printf("%d\n", a);

	return 0;
}
{% endhighlight %}
#### -> gcc version 7.4.0 --target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -o char char.c 
$ ./char
-1
{% endhighlight %}
x86_64 gcc treats `char` as a `signed char`.
Let's build with `-funsigned-char` options.
#### -> gcc version 7.4.0 --target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -funsigned-char -o char char.c 
$ ./char
255
{% endhighlight %}
-funisgned-char option is added, so `char` is treated as `unsigned char`.

I have seen how to treat `char` by default for each architecture.
#### -> x86_64: default signed char
{% highlight x86asm %}
...
 652:	c6 45 ff ff          	movb   $0xff,-0x1(%rbp)
 /* 
  - movsbl (Move a Sign-extended Byte): signed char
  - movzbl (Move a Zero-extended Byte): unsigned char
 */
 656:	0f be 45 ff          	movsbl -0x1(%rbp),%eax
...
{% endhighlight %}
#### -> aarch64: default unsigned char
{% highlight armasm %}
...
 72c:	12800000 	mov	w0, #0xffffffff            	// #-1
 730:	39007fa0 	strb	w0, [x29, #31]
 /*
  - ldrsb (Load Register Signed Byte): signed char
  - ldrb (Load Register Byte): unsigned char
 */
 734:	39407fa1 	ldrb	w1, [x29, #31]
...
{% endhighlight %}
#### -> mips64: default signed char
{% highlight mipsasm %}
...
 10000b20:	2402ffff 	li	v0,-1
 10000b24:	a3c20000 	sb	v0,0(s8)
 /*
  - lb (Load Byte): signed char
  - lbu (Load Byte unsigned): unsigned char
 */
 10000b28:	83c20000 	lb	v0,0(s8)
...
{% endhighlight %}
#### -> ppc: default unsigned char
{% highlight x86asm %}
 /*
  - lis (Load Immediate Shifted): signed char
  - li (Load Immediate): unsigned char
 */
 1000046c:	38 00 ff ff 	li      r0,-1
 10000470:	98 1f 00 0a 	stb     r0,10(r31)
{% endhighlight %}
I have found that simpler test code whether the defaults are `signed` or `unsigned` in stackoverflow.
{% highlight c %}
#include <stdio.h>

int main(void) {
  printf("%d\n", '\x80');

	return 0;
}
{% endhighlight %}
#### -> result
{% highlight bash %}
$ gcc -o simple simple.c 
$ ./simple
-128

$ gcc -funsigned-char -o simple simple.c 
$ ./simple
128
{% endhighlight %}
If we are working on a large project, we will not be able to set the compile-options for each process because it use compile options globally.

That is, because we can't rely on the compile options, should always use `signed char` or `unsigned char` when it depends on the signedness of type.

<div align="right">
jooojub.
</div>
