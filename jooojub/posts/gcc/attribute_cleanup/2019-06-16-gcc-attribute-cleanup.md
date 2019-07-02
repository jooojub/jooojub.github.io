---
layout: post
title:  "gcc attribute: cleanup"
date:   2019-06-16
share:	false
tags: [gcc, attribute]
---

Requires :
 * compiler: gcc 3.3.1 later

In systemd code, we can find may `attribute` keywords. Among them, I decided to take a closer look at `cleanup`, which may be useful for security coding.

It says so on the gnu gcc documents.

***
<table>
    <thead>
        <tr>
            <th>cleanup</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <b>The cleanup attribute runs a function when the variable goes out of scope</b>. This attribute can only be applied to auto function scope variables; it may not be applied to parameters or variables with static storage duration. The function must take one parameter, a pointer to a type compatible with the variable. The return value of the function (if any) is ignored.
                <br><br>
                If -fexceptions is enabled, then cleanup_function is run during the stack unwinding that happens during the processing of the exception. Note that the cleanup attribute does not allow the exception to be caught, only to perform an action. It is undefined what happens if cleanup_function does not return normally.
                <br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***
The following phrases are noticeable:
> The cleanup attribute runs a function when the variable goes out of scope

It means, if used well, we will be able to prevent situations where a leak occur due to failure to maintain the pair like {malloc/free, open/close, ...}
### Check with code
#### -> sample source code: simple
{% highlight c %}
#include <stdio.h>

void auto_function(int *arg) {
	printf("%s: called by __clean_up__: %d\n", __func__, *arg);

	return;
}

int main(int argc, char **argv) {
	__attribute__ ((__cleanup__(auto_function))) int val = 5;

	return 0;
}
{% endhighlight %}
#### -> result
{% highlight bash %}
auto_function: called by __clean_up__: 5
{% endhighlight %}

#### -> assembly: x86_64 AT&T
{% highlight x86asm %}
00000000004005c1 <main>:
  ...
  4005ec:	48 8d 45 e4             lea    -0x1c(%rbp),%rax
  4005f0:	48 89 c7                mov    %rax,%rdi
  4005f3:	e8 9e ff ff ff          callq  400596 <auto_function>
  ...
{% endhighlight %}
We can see that auto_function(& val) was called automatically.<br>
In other words, we can called the free() or close() without forgetting.

#### -> sample source code: fclose
{% highlight c %}
...
void fclosep(FILE **f) {
	fclose(f);
}

int main(int argc, char **argv) {
	__attribute__ ((__cleanup__(fclosep))) FILE *f = fopen(name, "r");
    ...
    /* We don't need to call fclose(f) manually */

	return 0;
}
{% endhighlight %}

The point at which the function is called by the `__cleanup__` attribute is important.<br>
The document specifies `The cleanup attribute runs a function when the variable goes out of scope`. Let's check.

#### -> sample source code: scope
{% highlight c %}
#include <stdio.h>
#include <stdlib.h>

void freep(void *p) {
	free(*(void **) p);
	printf("value freed\n");
}

int main(int argc, char **argv) {
	{
		__attribute__ ((__cleanup__(freep))) void *p = malloc(10);
	}

	printf("before return\n");

	return 0;
}
{% endhighlight %}
#### -> result
<div class="noline" markdown="1">
{% highlight bash%}
value freed
before return
{% endhighlight %}
</div>

#### -> assembly: x86_64 AT&T
{% highlight x86asm %}
  ...
  40066a:	31 c0                	xor    %eax,%eax
	{
		__attribute__ ((__cleanup__(freep))) void *p = malloc(10);
  40066c:	bf 0a 00 00 00       	mov    $0xa,%edi
  400671:	e8 9a fe ff ff       	callq  400510 <malloc@plt>
  400676:	48 89 45 f0          	mov    %rax,-0x10(%rbp)
  40067a:	48 8d 45 f0          	lea    -0x10(%rbp),%rax
  40067e:	48 89 c7             	mov    %rax,%rdi
     # The function is called by the life cycle of the variable
  400681:	e8 a0 ff ff ff       	callq  400626 <freep>
	}

	printf("before return\n");
  400686:	bf 40 07 40 00       	mov    $0x400740,%edi
  40068b:	e8 50 fe ff ff       	callq  4004e0 <puts@plt>

	return 0;
  400690:	b8 00 00 00 00       	mov    $0x0,%eax
}

{% endhighlight %}
So, be careful to make the following mistakes.

#### -> sample source code: be careful with scope
{% highlight c %}
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

void freep(void *p) {
	free(*(void **) p);
}

void *new_buffer(int size) {
	__attribute__ ((__cleanup__(freep))) int *p = malloc(size);

	return p;
}

int main(int argc, char **argv) {
	char *value = NULL;

	value = (char *)new_buffer(5);
	strncpy(value, "test", 5);

	printf("value: %s\n", value);

	return 0;
}
{% endhighlight %}

{% highlight bash %}
Segmentation fault (core dumped)
{% endhighlight %}

<div align="right">
jooojub.
</div>
