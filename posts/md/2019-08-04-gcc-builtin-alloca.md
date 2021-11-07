---
layout: post
title:  "gcc builtin: alloca"
date:   2019-08-04
share:	true
tags: [gcc_builtin]
keywords: [gcc-builtin, gcc, builtin, alloca]
description: "The alloca() function allocates size bytes of space in the stack frame of the caller.  This temporary space is automatically freed when the function that called alloca() returns to its caller."
---

#### Requires
: compiler: gcc 2.8 later
***

Let's take a look at <mark>__builtin_alloca</mark>, one of the gcc builtins.

The first thing to keep in mind is that many books and posts advise against using <mark>alloca</mark> built-in' from a `security standpoint`.

I hope that through this post, you can clearly understand why.

If you've looked at open-source code a lot, you'll often see <mark>__builtin_alloca</mark>.

For example, glibc's `strdupa` macro is defined as follows:

```c
: strdupa macro (glibc/string/string.h)
# define strdupa(s)							   			\
  (__extension__							     		\
    ({									      			\
      const char *__old = (s);							\
      size_t __len = strlen (__old) + 1;				\
      char *__new = (char *) __builtin_alloca (__len);	\
      (char *) memcpy (__new, __old, __len);			\
    }))
```

<mark>__builtin_alloca</mark> is a gcc built-in function that can be set to be allocated on the `stack` instead of the `heap` when allocating dynamic variables.

So if you look at glibc's `strdupa` code, you can see that it doesn't call free().

Since it is not allocated on the heap like malloc(), its life-time becomes a `function block`.

Therefore, as with any local variable, without a separate free(), the effect of freeing can be exerted only by restoring the stack pointer to the caller function.

As a result, both `cpu-time` and `memory` have advantages over malloc.

<mark>__builtin_alloca</mark> is a function called by gcc at `compile-time`, not a function called by process at run-time.
It works like a macro, but not strictly a macro.

You can see that <mark>__builtin_alloca</mark> is converted to other code by gcc via disassemble.

```x86asm
: builtin_alloca was replaced to
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
```
You can see that it is not in the form of a function call like `callq __builtin_alloca`

This builtin allocates a dynamic variable and is used where it is guaranteed to be used temporarily in a function, such as a local variable.

Let's take a look at the gcc documentation.

> #### Built-in Function: void *__builtin_alloca (size_t size)
> The `__builtin_alloca` function must be called at block scope<br>.
> The function allocates an object size bytes large on the stack of the calling function. The object is aligned on the default `stack` alignment boundary for the target determined by the __BIGGEST_ALIGNMENT__ macro.<br>
> The __builtin_alloca function returns a pointer to the first byte of the allocated object.
The lifetime of the allocated object ends just before the <b>calling function returns to its caller</b>.<br>
> This is so even when __builtin_alloca is called within a nested block.<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins"><code>https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins</code></a></cite>

I haven't looked closely at the gcc code, but it's a builtin that has been around since gcc 2.8.

Let's easily check how to use it through the sample code.

```c
: sample code - alloca.c
#include <stdio.h>
#include <string.h>

void func(const size_t n, const char* src) {
	char *val = (char *)__builtin_alloca(n);
	strncpy(val, src, n - 1);
	val[n - 1] = '\0';

	printf("val: %s\n", val);
}

int main(void) {
	func(4, "simple");

	return 0;
}
```
```bash
: gcc version 7.4.0 --target=x86_64-linux-gnu
$ gcc -g -o alloca alloca.c
$ ./alloca
val: sim
```

```x86asm
: assembly - x86_64 AT&T
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
```

The align routines were also added by the compiler, but the important part is that the stack size is just increased for variable allocation, and when the function returns, it simply `retq` without free().

The gcc documentation describes scope as follows:
> The lifetime of the allocated object ends just before the calling function returns to its caller

In glibc 1.09, <mark>__builtin_alloca</mark> was defined as <mark>alloca</mark> to shorten the long names.

```c
: __builtin_alloca is defined as alloca in glibc/stdlib/alloca.h
#ifdef	__GNUC__
# define alloca(size)	__builtin_alloca (size)
#endif /* GCC.  */
```
So if you include `alloca.h`, you can simply use `alloca`.

However, in my personal opinion, since gcc built-in is not a function called at run-time, but a function called by gcc at compile-time, I think it would be better to express the prefix <mark>__builtin</mark> as it is.

However, this is simply a matter of coding style, and if it is a multi-person project, you can make a promise (coding rules) about how to use it and use it.

It looks like ->[^1]VLA[/^] supported by C99, but the lifetime is different from VLA.








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


***
<ol>

[^1]: variable-length array (VLA), also called variable-sized, runtime-sized, is an array data structure whose length is determined at run time instead of at compile time

</ol>