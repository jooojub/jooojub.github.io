---
layout: post
title:  "attribute cleanup"
date:   2018-09-01
tags: [gcc]
---

In systemd code, we can find may <mark>attribute</mark> keywords. Among them, I decided to take a closer look at <mark>cleanup</mark>, which may be useful for security coding.

It says so on the gnu gcc documents.

<table>
    <thead>
        <tr>
            <th>cleanup</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <mark>The cleanup attribute runs a function when the variable goes out of scope</mark>. This attribute can only be applied to auto function scope variables; it may not be applied to parameters or variables with static storage duration. The function must take one parameter, a pointer to a type compatible with the variable. The return value of the function (if any) is ignored.
                <br><br>
                If -fexceptions is enabled, then cleanup_function is run during the stack unwinding that happens during the processing of the exception. Note that the cleanup attribute does not allow the exception to be caught, only to perform an action. It is undefined what happens if cleanup_function does not return normally.
                <br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

The following phrases are noticeable:
> The cleanup attribute runs a function when the variable goes out of scope

It means, if used well, we will be able to prevent situations where a leak occur due to failure to maintain the pair like {malloc/free, open/close, ...}
## Check with code
sample source code:
{% highlight c %}
#include <stdio.h>
#define cleanup \
    __attribute__ ((__cleanup__(clean_up)))

void clean_up(int *arg) {
    printf("%s: called by __clean_up__: %d %lld\n", __func__, *arg);

    return;
}

int main(int argc, char **argv) {
    /* Use __cleanup__ attribute */
    cleanup int val = 5;

    return 0;
}
{% endhighlight %}
result:
{% highlight python %}
$ clean_up: called by __clean_up__: 5
{% endhighlight %}
assembly:
{% highlight x86asm %}
00000000004005c1 <main>:
...
  4005da:   mov    %rax,-0x18(%rbp)
  4005de:   xor    %eax,%eax
  4005e0:   movl   $0x5,-0x1c(%rbp)
  4005e7:   mov    $0x0,%ebx
  4005ec:   lea    -0x1c(%rbp),%rax
  4005f0:   mov    %rax,%rdi

  /* cleanup is called automatically before return */
  4005f3:   callq  400596 <clean_up>
...
  40060e:   add    $0x28,%rsp
  400612:   pop    %rbx
  400613:   pop    %rbp
  400614:   retq
  400615:   nopw   %cs:0x0(%rax,%rax,1)
  40061c:
  40061f:   nop
{% endhighlight %}
