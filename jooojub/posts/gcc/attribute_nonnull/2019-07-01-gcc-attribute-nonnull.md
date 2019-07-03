---
layout: post
title:  "gcc attribute: nonnull"
date:   2019-07-01
share:	false
tags: [gcc-attribute]
---

Requires :
 * compiler: gcc 3.3 later

If use the `nonnull attribute`, can check in compile-time for situations where NULL is passed as a function argument.

However, it only detects when NULL is specified implicitly, and its functionality is limited because it can not detect situations that are implicitly used.<br>
I'll go into more detail below about that.

This attribute is use with `-Wnonnull` or `-Werror=nonnull` compile options.<br>
Meaning is lost when use with `-Wno-nonnull`options.

In the gcc-3.3 release note, nonnull was first introduced and used in many places, including the kernel and glibc.

***
<table>
    <thead>
        <tr>
            <th>GCC 3.3 Changes</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
              <b>C/ObjC/C++</b><br>
              ...<br>
              A new function attribute, <b>nonnull</b>, has been added which allows pointer arguments to functions to be specified as requiring a non-null value. The compiler currently uses this information to issue a warning when it detects a null value passed in such an argument slot.
              <br><br>
              <cite>ref. <a href="https://gcc.gnu.org/gcc-3.3/changes.html"><code>https://gcc.gnu.org/gcc-3.3/changes.html</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>
***

Details are kindly documented in the gcc documentation.

***
<table>
    <thead>
        <tr>
            <th>gcc 7.3/Common-Function-Attributes/nonnull</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
              <b>nonnull (arg-index, …)</b><br><br>
              The nonnull attribute specifies that some function parameters should be non-null pointers. For instance, the declaration:
              <div class="noline" markdown="1">
              {% highlight c %}
extern void *
    my_memcpy (void *dest, const void *src, size_t len)
    __attribute__((nonnull (1, 2)));{% endhighlight %}</div>
causes the compiler to check that, in calls to my_memcpy, arguments dest and src are <b>non-null</b>. If the compiler determines that a <b>null pointer is passed in an argument slot marked as non-null</b>, and the <b>-Wnonnull</b> option is enabled, a warning is issued. The compiler may also choose to make optimizations based on the knowledge that certain function arguments will never be null.<br><br>

If no argument index list is given to the nonnull attribute, all pointer arguments are marked as non-null. To illustrate, the following declaration is equivalent to the previous example:
              <div class="noline" markdown="1">
              {% highlight c %}
extern void *
    my_memcpy (void *dest, const void *src, size_t len)
    __attribute__((nonnull));{% endhighlight %}</div>
              <cite>ref. <a href="https://gcc.gnu.org/gcc-3.3/changes.html"><code>https://gcc.gnu.org/gcc-3.3/changes.html</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>
***

As this is a simple attribute, it can be easily understood by sample code.<br>
The importants thing is the argument index list is 1-based, rather than 0-based.

### Check with code
#### -> sample source code: nonnull.c
{% highlight c %}
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void __attribute__((nonnull(1, 2)))
  my_test_function(char *dest, const char *src, int len) {
	strncpy(dest, src, len);
}

int main(void) {
	my_test_function(NULL, NULL, 10);

	return 0;
}
{% endhighlight %}
I have specified that `dest` and `src` in my_test_function() should not be NULL.
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -Wnonnull nonnull.c

nonnull.c: In function ‘main’:
nonnull.c:11:2: warning: null argument where non-null required
										(argument 1) [-Wnonnull]
  my_test_function(NULL, NULL, 10);
  ^~~~~~~~~~~~~~~~
nonnull.c:11:2: warning: null argument where non-null required
										(argument 2) [-Wnonnull]
{% endhighlight %}
</div>
The compiler kindly warned that we could not use NULL for argnument 1, 2.<br>
Because warning can overlook sometimes, we can print it out as an error to cause a compilation failure.
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -Werror=nonnull nonnull.c

nonnull.c: In function ‘main’:
nonnull.c:11:2: error: null argument where non-null required
										(argument 1) [-Werror=nonnull]
  my_test_function(NULL, NULL, 10);
  ^~~~~~~~~~~~~~~~
nonnull.c:11:2: error: null argument where non-null required
										(argument 2) [-Werror=nonnull]
cc1: some warnings being treated as errors
{% endhighlight %}
</div>
Using the `nonnull attribute` does not mean that don't need to NULL check about the argument inside the my_test_function() function.<br>
This attribute only check the detectable state at compile-time, which also has limited functionality.<br>
`-Wnonnull` can not detect for the following situations:
{% highlight c %}
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void __attribute__((nonnull(1, 2)))
		my_test_function(char *dest, const char *src, int len) {
	strncpy(dest, src, len);
}

int main(void) {
	char *a = NULL;

	my_test_function(a, "test", 5);

	return 0;
}
{% endhighlight %}
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -Werror=nonnull nonnull.c
/* build success! */
{% endhighlight %}
</div>
If no argument index list is given to the `nonnull attribute`, NULL is checked for all arguments.
{% highlight c %}
#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void __attribute__((nonnull))
		my_test_function(char *dest, const char *src, int len) {
	strncpy(dest, src, len);
}

int main(void) {
	my_test_function(NULL, NULL, 5);

	return 0;
}
{% endhighlight %}
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -Werror=nonnull nonnull.c

nonnull.c: In function ‘main’:
nonnull.c:11:2: error: null argument where non-null required
										(argument 1) [-Werror=nonnull]
  my_test_function(NULL, NULL, 10);
  ^~~~~~~~~~~~~~~~
nonnull.c:11:2: error: null argument where non-null required
										(argument 2) [-Werror=nonnull]
cc1: some warnings being treated as errors
{% endhighlight %}
</div>
Although it is limited in functionality, it may be a good attribute to cover the user's mistakes to some extent because it can be checked at compile-time for situations where NULL is explicitly used.

<div align="right">
jooojub.
</div>
