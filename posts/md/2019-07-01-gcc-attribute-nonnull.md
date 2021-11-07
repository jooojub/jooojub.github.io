---
layout: post
title:  "gcc attribute: nonnull"
date:   2019-07-01
share:	true
tags: [gcc_attribute]
keywords: [gcc-attribute, gcc, attribute, nonnull]
description: "A new function attribute, nonnull, has been added which allows pointer arguments to functions to be specified as requiring a non-null value."
---

#### Requires
: compiler: gcc 3.3 later
***

If you use <mark>nonnull attribute</mark>, you can detect at compile-time when NULL is used in a function that `should not pass NULL` as a function argument.

However, It is detected only if NULL is specified as implicitly. 
Therefore, there is a limit that it cannot detect a situation where it is not.
These limitations will be discussed in more detail later.

This attribute is meaningful only when used with the <mark>-Wnonnull</mark> or <mark>-Werror=nonnull</mark> compile options.
Using <mark>-Wno-nonnull</mark> makes it meaningless to use <mark>nonnull attribute</mark> it on purpose.

<mark>nonnull</mark> was first introduced in the gcc-3.3 release note, and is used in many open-sources such as kernel and glibc.

> #### GCC 3.3 Changes
> <b>C/ObjC/C++</b>
> ...
> A new function attribute, <b>nonnull</b>,has been added which allows pointerarguments to functions to be specified asrequiring a non-null value. The compilercurrently uses this information to issue awarning when it detects a null value passedin such an argument slot.<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/gcc-3.3/changes.html"><code>https://gcc.gnu.org/gcc-3.3/changes.html</code></a></cite>

More details are kindly given in the gcc documentation.



> #### gcc 7.3/Common-Function-Attributes/nonnull
> <b>nonnull (arg-index, …)</b><br>
> The nonnull attribute specifies that some function parameters should be non-null pointers. For instance, the declaration:<br><br>
> <pre><code>extern void *
>    my_memcpy (void *dest, const void *src, size_t len)
>    __attribute__((nonnull (1, 2)));</code></pre>
> causes the compiler to check that, in calls to my_memcpy, arguments dest and src are <mark>non-null</mark>.
> If the compiler determines that a <b>null pointer is passed in an argument slot marked as non-null</b>, and the <mark>-Wnonnull</mark> option is enabled, a warning is issued.
> The compiler may also choose to make optimizations based on the knowledge that certain function arguments will never be null.<br>
> If no argument index list is given to the nonnull attribute, all pointer arguments are marked as non-null. To illustrate, the following declaration is equivalent to the previous example:<br><br>
> <pre><code>extern void *
>    my_memcpy (void *dest, const void *src, size_t len)
>    __attribute__((nonnull));</pre></code>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/gcc-3.3/changes.html"><code>https://gcc.gnu.org/gcc-3.3/changes.html</code></a></cite>

Because it is a simple attribute, you can be understood with a simple sample code.
The important thing is that the argument index list is `1-based`, not 0-based.

```c 
: sample source code - nonnull.c
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
```

In my_test_function(), I specified that `dest` and `src` must not be `NULL`.

```bash
: result
$ gcc -Wnonnull nonnull.c

nonnull.c: In function ‘main’:
nonnull.c:11:2: warning: null argument where non-null required
										(argument 1) [-Wnonnull]
  my_test_function(NULL, NULL, 10);
  ^~~~~~~~~~~~~~~~
nonnull.c:11:2: warning: null argument where non-null required
										(argument 2) [-Wnonnull]
```
The compiler kindly gave me a warning message saying that arguments 1 and 2 should not be NULL.

Compile warnings can sometimes be overlooked by mistake, so it is better to change them to errors so that compilation fails.

```bash
: change to error with -Werror=
$ gcc -Werror=nonnull nonnull.c

nonnull.c: In function ‘main’:
nonnull.c:11:2: error: null argument where non-null required
										(argument 1) [-Werror=nonnull]
  my_test_function(NULL, NULL, 10);
  ^~~~~~~~~~~~~~~~
nonnull.c:11:2: error: null argument where non-null required
										(argument 2) [-Werror=nonnull]
cc1: some warnings being treated as errors
```

Importantly, just because you use a <mark>nonnull attribute</mark> doesn't mean you don't need to check for NULL in my_test_function().
This attribute only works in predictable situations at compile-time.
It is a limitation of compile-time detection and in a way it is a natural limitation.


```c
: can not detect for the following situations
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
```
a is `null` but the build succeeds.
```bash
: result
$ gcc -Werror=nonnull nonnull.c
/* build success! */
```

Although the above situation is NULL, which is sufficiently predictable from the point of view of the compiler, it cannot be detected... hmm

When using <mark>nonnull attribute</mark>, if argument index list is not provided, nonnull check is performed for all arguments.

```c
: use without argument index list
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
```
```bash
: result - build fail
$ gcc -Werror=nonnull nonnull.c
nonnull.c: In function ‘main’:
nonnull.c:11:2: error: null argument where non-null required
										(argument 1) [-Werror=nonnull]
  my_test_function(NULL, NULL, 10);
  ^~~~~~~~~~~~~~~~
nonnull.c:11:2: error: null argument where non-null required
										(argument 2) [-Werror=nonnull]
cc1: some warnings being treated as errors
```

Although there is a limit to detection, the possibility of detecting user mistakes at compile-time seems to be a big advantage.

Compiler attribute has no `runtime overhead`, so I plan to make a lot of use of these `attributes`.