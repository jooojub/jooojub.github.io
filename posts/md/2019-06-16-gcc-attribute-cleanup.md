---
title:  "gcc attribute: cleanup"
date:   2019-06-16
share:	true
tags: [gcc_attribute, gccs]
keywords: [gcc-attribute, gcc, attribute, cleanup]
description: "The cleanup attribute runs a function when the variable goes out of scope. This attribute can only be applied to auto function scope variables."
---

#### Requires
: compiler : gcc 3.3.1 later
***

> #### The quarterly results look great!
>
> - Revenue was off the chart.
> - Profits were higher than ever.
>
>  *Everything* is going according to **plan**.


```c
: title sample
#include <stdio.h>

const int test = 0;
```
systemd 코드에서, <mark>attribute</mark> keyword 들을 많이 볼 수 있습니다. 그중에서 <cd>security coding</cd>에 많은 도움이 될 수 있는 'cleanup' keyword에 대해서 살펴보겠습니다.

**cleanup** keyword에 대해서 gcc 문서에서는 다음과 같이 설명합니다.

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
다음 설명이 중요한 요점 같네요.
> The cleanup attribute runs a function when the variable goes out of scope

즉, 잘 사용한다면, pair를 맞춰야 하는 코드 {malloc/free, open/close, ...} 관리가 편해, leak이 발생하는 상황을 막을 수 있어 보입니다.
### Check with code
```c
: sample source code - simple
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
#### result
```bash
auto_function: called by __clean_up__: 5
```

#### assembly: x86_64 AT&T
```asm
00000000004005c1 <main>:
  ...
  4005ec:	48 8d 45 e4             lea    -0x1c(%rbp),%rax
  4005f0:	48 89 c7                mov    %rax,%rdi
  4005f3:	e8 9e ff ff ff          callq  400596 <auto_function>
  ...
```
auto_function(& val)이 자동으로 호출되는 것을 볼 수 있습니다.<br>
이곳에 free() 또는 close()를 추가하게 되면 신경 쓰지 않아도 자동으로 호출되게 할 수 있습니다.

#### -> sample source code: fclose
```c
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
`__cleanup__` attribute에 의해 호출되는 함수의 시점이 중요합니다.<br>
문서에는 다음과 같이 명시되어 있습니다.<br>
`The cleanup attribute runs a function when the variable goes out of scope`<br>
확인해봅시다.

#### -> sample source code: scope
```c
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
#### -> result
```bash
value freed
before return
```

#### -> assembly: x86_64 AT&T
```x86asm
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
즉, 다음과 같은 실수를 하지 않도록 조심해야 합니다.

#### -> sample source code: be careful with scope
```c
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
Segmentation fault (core dumped)
```