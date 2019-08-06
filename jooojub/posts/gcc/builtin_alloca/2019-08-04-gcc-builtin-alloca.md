---
layout: post
title:  "gcc builtin: alloca"
date:   2019-08-04
share:	true
tags: [gcc-builtin]
keywords: [gcc-builtin, gcc, builtin, alloca]
---

Requires:
 * compiler: gcc 2.8 later

Let's take a look at `__builtin_alloca` that one of the gcc builtins.

The first thing to keep in mind is that many books and posts recommend that you do not use this `alloca built-in` function for security code. 
I hope you understand the reason in this post.

If you look at several open-source code, you'll often find it called `__builtin_alloca`. For example, you can see it if you look at a macro called `strdupa`.

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
`__builtin_alloca` is a function of gcc that can be assigned to the stack rather than the heap for dynmaic variables. So, if you look at the code that uses `strdupa`, you will see that it doesn't have a free().
Unlike malloc which assigns to heap, Its lifetime is a `function block`. 
Therefore restoration to the caller function's stack pointer is enough.
In conclusion, There is a speed and time advantage over malloc.

The `__builtin_alloca` function in gcc is a function called by the gcc compiler at compile-time, not a function called run-time of the process.
It's like a macro, but technically it's not a macro. You can see that `__builtin_alloca` was replaced by code other than function calling code in assembly.

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
It isn't calling function like `callq __builtin_alloca`

It is used when you want to assign a dynamic variable and it is guaranteed to be used only temporarily inside a function

Let's look at the description in the gcc document.

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


ref: I haven't checked in detail which version of the option was added, but it was already included in gcc 2.8.

We can easily see how it compiles using sample code.
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
The complicated align routines have been added, but the key is simply increase the size of the stack and then `retq`. And also we can see the scope of the variable specified in the document.
> The lifetime of the allocated object ends just before the calling function returns to its caller

`__builtin_alloca` is defined as `alloca` from glibc 1.09 to avoid using the tremendous name.
#### -> __builtin_alloca is defined as alloca in glibc/stdlib/alloca.h
{% highlight c %}
#ifdef	__GNUC__
# define alloca(size)	__builtin_alloca (size)
#endif /* GCC.  */
{% endhighlight %}
So if you include `alloca.h`, you can simply use `alloca`. But in my personal opinion, since gcc builtin functions are functions that are called at compile-time rather than we usually think of run-time function, it seems to be better to use `__builtin` prefix to represent this. But this is a just problmes of coding style. So, If it is a project where many people participate, it is enough to unify the style through appropriate discussion.

Although alloca seems to have the same functionality as a VLA[^1] supporting C99, lifetime is different from VLA.

[^1]: variable-length array (VLA), also called variable-sized, runtime-sized, is an array data structure whose length is determined at run time instead of at compile time

VLA litftime is block scope but, alloca is function scope.
In other words, it cann't be solved by VLA in the following situations.

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

Of course, many books and posts comments suggest that code that assigns variables to the stack, like alloca and VLA, should not be used as un-safe code, and I agree with them.
Variables assigned to the stack cause stack overflow, which is a security hole. And also passing the negative number in alloca could be executed in not intended at all. In addition, this is different from the typical alloc/free sequence in Standard C, beginners can be confusing.<br>
-> alloca is not a standrad - it is GNU extension...

For various reasons, The kernel has been working on eliminating code that uses VLAs, and all of them have been removed in 4.20 perfectly.
> ref: https://www.phoronix.com/scan.php?page=news_item&px=Linux-Kills-The-VLA

In the GNU document, The advantages of the alloca are described as follows:

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

And also described of disadvantages

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

Since gcc 4.7, `__builtin_alloca_with_align` has been added, and since gcc 8.1, `__builtin_alloca_with_align_and_max` has also been added. Its added to set align and max_size to make `alloca` safer.

It's simple, please check the document.
> https://gcc.gnu.org/onlinedocs/gcc/Other-Builtins.html<br><br>
> Built-in Function: void *__builtin_alloca_with_align (size_t size, size_t alignment)<br>
> Built-in Function: void *__builtin_alloca_with_align_and_max (size_t size, size_t alignment, size_t max_size)

As discussion continues about stability of alloca, gcc 7.0 has added gcc options to detect whether `alloca` is used or make it safer to use. We will discuss this in a separate post later.
> -Walloca-larger-than, -Walloca ...

If you get a situation where you have to use `alloca`, pay attention to the size and range check. Note that even if you do a range range check, using it in an inline function can lead to unpredictable situations, so it's better not to use it in an inline function.

<div align="right">
jooojub.
</div>
