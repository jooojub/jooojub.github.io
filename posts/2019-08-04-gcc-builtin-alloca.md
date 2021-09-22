---
layout: post
title:  "gcc builtin: alloca"
date:   2019-08-04
share:	true
tags: [gcc-builtin]
keywords: [gcc-builtin, gcc, builtin, alloca]
description: "test"
---

Requires:
 * compiler: gcc 2.8 later

gcc builtin 중의 하나인 `__builtin_alloca`에 대해서 살펴보겠습니다.

우선 명심해야 할 것은 많은 책이나 posts에서 `alloca built-in`을 security 관점에서 사용하지 말 것을 권고하고 있습니다.
이번 post를 통해서 왜 그런지 이유를 명확하게 이해했으면 좋겠습니다.

open-source code를 많이 살펴보셨다면, 종종 `__builtin_alloca`를 잧아 볼 수 있을 겁니다.<br>
예를 들어 glibc의 `strdupa` macro를 다음과 같이 정의되어 있습니다.

#### -> strdupa macro (glibc/string/string.h)
{% highlight c %}
# define strdupa(s)							   			\
  (__extension__							     		\
    ({									      			\
      const char *__old = (s);							\
      size_t __len = strlen (__old) + 1;				\
      char *__new = (char *) __builtin_alloca (__len);	\
      (char *) memcpy (__new, __old, __len);			\
    }))
{% endhighlight %}
`__builtin_alloca`는 dynamic variable를 할당할 때, heap 대신 stack에 할당되도록 설정할 수 있는 gcc built-in function입니다.<br>
그래서 glibc의 `strdupa` 코드를 살펴보면 free()를 따로 호출하지 않는 것을 볼 수 있습니다.<br>
malloc()처럼 heap에 할당되는 것이 아니기 때문에 life-time은 `function block`이 됩니다.<br>

따라서, 여느 local variable과 동일하게 별도의 free() 없이도, caller function으로의 stack pointer 복원만으로도 free를 하는 효과를 발휘할 수 있습니다.

결과적으로 malloc보다 cpu-time과 memory 모두 이점이 있습니다.

`__builtin_alloca`은 run-time에 process에 의해 호출되는 함수가 아닌 compile-time에 gcc에 의해서 호출되는 함수입니다.<br>
macro처럼 동작하지만, 엄연히 말해 macro는 아닙니다.<br>
disassemble을 통해 gcc에 의해 `__builtin_alloca`가 다른 코드로 변환되는 것을 확인할 수 있습니다.

#### -> builtin_alloca was replaced to
{% highlight x86asm %}
void func(size_t n, const char* src) {
    ...
	char *val = (char *)__builtin_alloca(n);
 739:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
 73d:	48 8d 50 0f          	lea    0xf(%rax),%rdx
 741:	b8 10 00 00 00       	mov    $0x10,%eax
 746:	48 83 e8 01          	sub    $0x1,%rax
 74a:	48 01 d0             	add    %rdx,%rax
 74d:	b9 10 00 00 00       	mov    $0x10,%ecx
 752:	ba 00 00 00 00       	mov    $0x0,%edx
 757:	48 f7 f1             	div    %rcx
 75a:	48 6b c0 10          	imul   $0x10,%rax,%rax
 75e:	48 29 c4             	sub    %rax,%rsp
 761:	48 89 e0             	mov    %rsp,%rax
 764:	48 83 c0 0f          	add    $0xf,%rax
 768:	48 c1 e8 04          	shr    $0x4,%rax
 76c:	48 c1 e0 04          	shl    $0x4,%rax
 770:	48 89 45 f0          	mov    %rax,-0x10(%rbp)

	memcpy(val, src, n);
	...
{% endhighlight %}
`callq __builtin_alloca`와 같은 함수 호출 형태가 아니라는 것을 볼 수 있습니다.

이 builtin은 dynamic variable을 할당하고 local variable처럼 임시적으로 함수 안에서 사용하는 게 보장되는 곳에서 사용하고 있습니다.

gcc 문서를 살펴보겠습니다.

***
<table>
    <thead>
        <tr>
            <th>Built-in Function: void *__builtin_alloca (size_t size)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
				The <b>__builtin_alloca</b> function must be called at block scope.
				The function allocates an object size bytes large on the stack of the calling function. The object is aligned on the default <b>stack</b> alignment boundary for the target determined by the __BIGGEST_ALIGNMENT__ macro. The __builtin_alloca function returns a pointer to the first byte of the allocated object. The lifetime of the allocated object ends just before the <b>calling function returns to its caller</b>.
				This is so even when __builtin_alloca is called within a nested block.<br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins"><code>https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***

gcc 코드를 자세히 살펴보진 않았지만, gcc 2.8에부터 존재했던 builtin입니다.

sample code를 통해 사용법을 쉽게 확인해 봅시다.
#### -> sample code: alloca.c
{% highlight c %}
#include <stdio.h>
#include <string.h>

void func(const size_t n, const char* src) {
	char *val = (char *)__builtin_alloca(n);
	strncpy(val, src, n);
	val[n] = '\0';

	printf("val: %s\n", val);
}

int main(void) {
	func(3, "simple");

	return 0;
}
{% endhighlight %}
#### -> gcc version 7.4.0 --target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -g -o alloca alloca.c
$ ./alloca
val: sim
{% endhighlight %}
#### -> assembly: x86_64 AT&T
{% highlight x86asm %}
void func(const size_t n, const char* src) {
 6fa:	55                   	push   %rbp
 6fb:	48 89 e5             	mov    %rsp,%rbp
 6fe:	48 83 ec 20          	sub    $0x20,%rsp
 702:	48 89 7d e8          	mov    %rdi,-0x18(%rbp)
 706:	48 89 75 e0          	mov    %rsi,-0x20(%rbp)
 70a:	64 48 8b 04 25 28 00 	mov    %fs:0x28,%rax
 711:	00 00 
 713:	48 89 45 f8          	mov    %rax,-0x8(%rbp)
 717:	31 c0                	xor    %eax,%eax
	char *val = (char *)__builtin_alloca(n);
 719:	48 8b 45 e8          	mov    -0x18(%rbp),%rax
 71d:	48 8d 50 0f          	lea    0xf(%rax),%rdx
 721:	b8 10 00 00 00       	mov    $0x10,%eax
 726:	48 83 e8 01          	sub    $0x1,%rax
 72a:	48 01 d0             	add    %rdx,%rax
 72d:	b9 10 00 00 00       	mov    $0x10,%ecx
 732:	ba 00 00 00 00       	mov    $0x0,%edx
 737:	48 f7 f1             	div    %rcx
 73a:	48 6b c0 10          	imul   $0x10,%rax,%rax
 73e:	48 29 c4             	sub    %rax,%rsp
 741:	48 89 e0             	mov    %rsp,%rax
 744:	48 83 c0 0f          	add    $0xf,%rax
 748:	48 c1 e8 04          	shr    $0x4,%rax
 74c:	48 c1 e0 04          	shl    $0x4,%rax
 750:	48 89 45 f0          	mov    %rax,-0x10(%rbp)
	strncpy(val, src, n);
 ...
 7a6:	c9                   	leaveq 
 7a7:	c3                   	retq   
{% endhighlight %}
compiler에 의해 align routines 또한 추가되었지만 중요한 부분은 variable 할당을 위해 단지 stack size를 증가시켰다는 것이며, 함수가 return 할 때 free() 없이 단순히 `retq` 하였다는 것입니다.<br>

gcc 문서에서는 scope에 대해 다음과 같이 설명되어 있습니다.
> The lifetime of the allocated object ends just before the calling function returns to its caller

glibc 1.09에서는 `__builtin_alloca`를 `alloca`로 define 하여 긴 이름을 줄였습니다.

#### -> __builtin_alloca is defined as alloca in glibc/stdlib/alloca.h
{% highlight c %}
#ifdef	__GNUC__
# define alloca(size)	__builtin_alloca (size)
#endif /* GCC.  */
{% endhighlight %}
그래서 만약 `alloca.h`를 include 한다면, 단순히 `alloca`라고 사용할 수 있습니다.

그러나 개인적인 의견으로는 gcc built-in은 run-time에 호출되는 함수가 아니라 compile-time에 gcc에 의해 호출되는 함수이기 때문에 이를 나타내는 `__builtin`이라는 prefix를 그대로 표현하게는 좋지 않을까 생각됩니다.<br>
그러나 이것은 단순히 coding style 문제이고 만약 여러 사람이 참여하는 프로젝트라면 어떤 식으로 사용할지에 대해 약속하고 그것을 사용하면 됩니다. 

C99에서 지원하는 VLA[^1]와 같아 보이지만 VLA와는 lifetime이 다릅니다.

[^1]: variable-length array (VLA), also called variable-sized, runtime-sized, is an array data structure whose length is determined at run time instead of at compile time

VLA의 litftime block scope이고 `alloca`는 function scope입니다.<br>
즉, 다음과 같은 상황에서는 VLA을 사용할 수 없습니다.

#### -> It is impossible in VLA
{% highlight c %}
#define COUNT 10

struct sample {
	unsigned char *p_x;
};

void func(void) {
	struct sample val[COUNT];
	int i;

	for (i = 0; i < COUNT; i++) {
		/* Use VLA */
		unsigned char x[i];
		/* unsigned char *x = (unsigned char *)__builtin_alloca(i); */
		memset(x, 0, i);

		val[i].p_x = x;
		/* The lifetime of x is terminated */
	}

	sumthing_to_do(val);

	return;
}
{% endhighlight %}

위에서 언급했던 거처럼, 많은 책과 post에서 stack에 변수를 동적 할당하는 VLA나 alloca는 security 측면에서 un-safe 하기 때문에 사용을 자제하라고 권고하고 있고, 저 또한 동의합니다.<br>
stack에 변수를 동적 할당하는 코드는 stack overflow를 유발 할 수 있으며 이것이 security hole이 될 수 있습니다.<br>
또한 length에 nagative number가 사용된다면 전혀 의도하지 않은 방향으로 코드가 흘러갈 수 있습니다.<br>
그리고 Standard C에서 흔히 동적 할당에 사용되는 alloc/free 짝을 맞춰 코딩하는 방식과는 다르기 때문에 `alloca`를 모르는 사람들에게 혼돈을 줄 수 있습니다.<br>
-> alloca는 standard가 아닙니다 - GNU extension 입니다...

위와 같은 이유에서, kernel 프로젝트에서는 VLA 코드 제거에 많은 노력을 하였으며 결과적으로 4.20에서 완벽하게 성공하였습니다.
> ref: https://www.phoronix.com/scan.php?page=news_item&px=Linux-Kills-The-VLA

GNU document에서는 `alloca`의 이점에 대해서 다음과 같이 설명하였습니다:

***
<table>
    <thead>
        <tr>
            <th>Advantages-of-Alloca</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
				* Using alloca wastes very <b>little space</b> and is very <b>fast</b>. (It is open-coded by the GNU C compiler.)<br><br>
                * Since alloca does not have separate pools for different sizes of blocks, space used for any size block can be reused for any other size. alloca <b>does not cause memory fragmentation.</b><br><br>
                * Nonlocal exits done with longjmp (see Non-Local Exits) automatically free the space allocated with alloca when they exit through the function that called alloca. This is the most important reason to use alloca.
                <br><br>
                <cite>ref. <a href="https://www.gnu.org/software/libc/manual/html_node/Advantages-of-Alloca.html#Advantages-of-Alloca"><code>https://www.gnu.org/software/libc/manual/html_node/Advantages-of-Alloca.html#Advantages-of-Alloca</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***

또한, 단점은 다음과 같이 설명하였습니다.

***
<table>
    <thead>
        <tr>
            <th>Disadvantages-of-Alloca</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
				* If you try to allocate more memory than the machine can provide, you don’t get a clean error message. Instead you get a fatal signal like the one you would get from an infinite recursion; probably a segmentation violation (see Program Error Signals).<br><br>
                * Some non-GNU systems fail to support alloca, so it is less portable. However, a slower emulation of alloca written in C is available for use on systems with this deficiency.
                <br><br>
                <cite>ref. <a href="https://www.gnu.org/software/libc/manual/html_node/Disadvantages-of-Alloca.html#Disadvantages-of-Alloca"><code>https://www.gnu.org/software/libc/manual/html_node/Disadvantages-of-Alloca.html#Disadvantages-of-Alloca</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***

gcc 4.7에는 `__builtin_alloca_with_align`가 추가되었으며 gcc 8.1에는 `__builtin_alloca_with_align_and_max`가 추가되었습니다.<br>
`alloca`를 좀 더 safe하게 사용할 수 있게 max_size 또는 align을 설정할 수 있도록 추가되었습니다.

단순한 추가입니다. 문서에서 확인하세요.
> https://gcc.gnu.org/onlinedocs/gcc/Other-Builtins.html<br><br>
> Built-in Function: void *__builtin_alloca_with_align (size_t size, size_t alignment)<br>
> Built-in Function: void *__builtin_alloca_with_align_and_max (size_t size, size_t alignment, size_t max_size)

`alloca`를 더욱 safe 하게 사용할 수 있도록 gcc 7.0에서는 alloca의 max size를 compile-time에 확인할 수 있는 compile option이 추가되었습니다.<br>
또한 코드에서 `alloca`가 사용되었는지도 확인할 수 있습니다.<br><br>

이것들은 이후 다른 post에서 설명하겠습니다.
> -Walloca-larger-than, -Walloca ...

만약 `alloca`를 사용하게 된다면, size와 range check에 신경 써야 합니다.<br>

참고로 `alloca`를 inline function에서 사용할 경우 의도하지 않은 동작이 될 수도 있습니다.<br>
이유는 구글링해 보시면 쉽게 아실 수 있습니다 :)
<div align="right">
jooojub.
</div>
