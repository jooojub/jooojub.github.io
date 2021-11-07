---
title:  "gcc attribute: cleanup"
date:   2019-06-16
share:	true
tags: [gcc_attribute]
keywords: [gcc-attribute, gcc, attribute, cleanup]
description: "The cleanup attribute runs a function when the variable goes out of scope. This attribute can only be applied to auto function scope variables."
---

#### Requires
: compiler : gcc 3.3.1 later
***

In systemd project code, you will see a lot of <mark>attribute</mark> keywords.
Among them, let's look at the <mark>cleanup</mark> keyword, which can be very helpful for <cd>security coding</cd>.

The <mark>cleanup</mark> keyword is described as follows in the gcc documentation.

> #### cleanup
> <b>The cleanup attribute runs a function when the variable goes out of scope</b>.<br>
> This attribute can only be applied to auto function scope variables; it may not be applied to parameters or variables with static storage duration.<br>
> The function must take one parameter, a pointer to a type compatible with the variable.
> The return value of the function (if any) is ignored.<br>
> If -fexceptions is enabled, then cleanup_function is run during the stack unwinding that happens during the processing of the exception.
> Note that the cleanup attribute does not allow the exception to be caught, only to perform an action.
> It is undefined what happens if cleanup_function does not return normally.<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html</code></a></cite>

I think the following explanation is an important point.
> The cleanup attribute runs a function when the variable goes out of scope

In other words, if used well, the code that needs to match the pair ( <mark>malloc/free</mark> or <mark>open/close</mark>... ) is easy to manage, and it seems to prevent leaks.

```c
: sample source code - usage
#include <stdio.h>

void auto_function(int *arg) {
	printf("%s: called by __clean_up__: %d\n", __func__, *arg);

	return;
}

int main(int argc, char **argv) {
	__attribute__ ((__cleanup__(auto_function))) int val = 5;

	return 0;
}
```
```bash
: result
auto_function: called by __clean_up__: 5
```

If you look at the assembly code, You can see that the code that calls <cd>auto_function()</cd> has been added automatically by gcc.

```x86asm
: assembly - x86_64 AT&T (usage)
00000000004005c1 <main>:
  ...
  4005ec:	48 8d 45 e4             lea    -0x1c(%rbp),%rax
  4005f0:	48 89 c7                mov    %rax,%rdi
  4005f3:	e8 9e ff ff ff          callq  400596 <auto_function>
  ...
```
If you put <mark>free()</mark> or <mark>close()</mark> here, secure coding is possible without worrying about leaks like this,

```c
: sample source code - fclose
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
```
The timing of the function being called by the <mark>__cleanup__</mark> attribute is important.

The documentation describes it as:
> The cleanup attribute runs a function when the variable goes out of scope

Let's check if the above explanation is correct

```c
: sample source code - scope
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
```
```bash
: result
value freed
before return
```
```x86asm
: assembly - x86_64 AT&T (scope)
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
```
Be mindful of the timing.
Mistakes such as the following may also occur

```c
: sample source code - be careful with scope
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
```

```bash
: result
Segmentation fault (core dumped)
```