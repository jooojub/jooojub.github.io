---
layout: post
title:  "gcc options: -fno-zero-initialized-in-bss"
date:   2020-10-30
share:	true
tags: [gcc-options]
keywords: [gcc-options, gcc, options, -fno-zero-initialized-in-bss]
description: "초기화 되지 않은 global variable가 무조건 bss section에 들어가는 것은 아니다."
---

Requires :
 * compiler: gcc 3.3 later

만약 compile option 없이 `char`를 사용한다면, `signed` 일까요 `unsigned`? <br>
결과는 architecture에 따라, 그리고 compiler version에 따라 다를 것입니다.

많은 사람들은 대부분 `char`는 `signed char`라고 생각하며 코드를 작성합니다.<br>
그러나 이건 architecture 또는 compiler option에 따라 다르기 때문에 위험한 코드입니다.<br>
특히 architecture independent code를 작성해야 한다면 절대로 피해야 하는 코딩 습관입니다.

gcc compiler에는 `char`를 `signed` 또는 `unsigned`로 다룰지에 대한 gcc option[^1]이 있다.

[^1]: gcc 문서에는 <b>gcc commands</b>라고 명명하고 있습니다. 저는 두 용어 모두 혼용해서 사용하겠습니다 :)
> -fsigned-char, -funsigned-char, -fno-signed-char", -fno-unsigned-char

많은 option이 있지만 결국은 두 가지 의미로 사용됩니다.
> <b>char -> signed char</b>: -fsigned-char == -fno-unsigned-char<br>
> <b>char -> unsigned char</b>: -funsigned-char == -fno-signed-char

아주 심플한 gcc option이며, gcc 문서에서도 자세히 설명되어 있습니다.

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
이 option이 처음 등장했던 gcc version을 자세히 살펴보진 않았지만, gcc 2.8에는 이미 해당 option이 포함되어 있습니다.

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
gcc release note에서는 찾아볼 수 없으나, cpp에서는 gcc 3.1에 추가된 걸로 보입니다.
#### -> git checkout gcc-3_1-release
{% highlight c %}
$ cat ./gcc/cppinit.c

#define COMMAND_LINE_OPTIONS                                      \
....
  DEF_OPT("fsigned-char",             0,      OPT_fsigned_char)
...
  DEF_OPT("funsigned-char",           0,      OPT_funsigned_char)

{% endhighlight %}
option이 의도대로 잘 동작하는지 코드로 살펴봅시다.
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
x86_64에서는 `char`를 `signed char`로 취급합니다.
`-funsigned-char` option을 추가해 봅시다.
#### -> gcc version 7.4.0 --target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -funsigned-char -o char char.c 
$ ./char
255
{% endhighlight %}
`-funisgned-char` option이 추가되어 `char`를 `unsigned char`로 취급합니다.

각 architecture 별로 `char`를 어떻게 다루는지 살펴보았습니다.
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
stack overflow에서 `char`가 `signed`인지 `unsigned`인지를 쉽게 확인할 수 있는 sample code를 찾았습니다.
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
거대한 project에서는 global 하게 compile option이 추가되기 때문에, 각 process 별로 compile option을 통일하는 게 일반적입니다.

즉, compile option에 의존해서 코드를 작성하는 것 보다는 signed 인지 unsigned 인지가 중요한 코드에서는 `char`가 아닌 명시적으로 `signed char` 또는 `unsigned char`를 이용해서 코드를 작성하는 게 좋아 보입니다.
<div align="right">
jooojub.
</div>
