---
layout: post
title:  "gcc attribute: nonnull"
date:   2019-07-01
share:	true
tags: [gcc-attribute]
keywords: [gcc-attribute, gcc, attribute, nonnull]
description: "A new function attribute, nonnull, has been added which allows pointer arguments to functions to be specified as requiring a non-null value."
---

Requires :
 * compiler: gcc 3.3 later

`nonnull attribute`를 사용하면, function argument에 NULL을 넘기면 안되는 함수에 NULL을 사용하는 경우를 compile-time에 검출할 수 있습니다.<br><br>
그러나 NULL이 implicitly(묵시적) 으로 지정된 경우에만 감지되고, 그렇지 않은 상황을 검출할 수 없는 한계가 있습니다.<br>
이러한 한계는 이후에 다시 자세히 설명하겠습니다.

이 attribute는 `-Wnonnull` 와 `-Werror=nonnull` compile options과 함께 사용되어야 의미가 있습니다.<br>
`-Wno-nonnull`를 사용하면 애써 `nonnull attribute`를 사용한 의미가 없게 됩니다.<br>

gcc-3.3 release note에서 nonnull이 처음 소개되었고, kernel이나 glibc와 같이 많은 오픈소스에서 사용되고 있습니다. 

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

자세한 내용은 gcc 문서에 친절하게 나와 있습니다.

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

단순한 attribute이기 때문에 간단한 sample code로 이해할 수 있습니다.<br>
중요한 것은 argument index list가 0-based가 아니라 1-based 라는 것입니다.

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
my_test_function()에서 `dest` 와 `src`는 NULL이 되면 안 된다고 명시했습니다.
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
compiler가 친절하게 argument 1, 2에는 NULL을 사용하면 안 된다고 warning 메시지를 줬습니다.<br>
Compile warning은 가끔 실수로 지나칠 수 있으니, compile이 실패 발생하도록 error로 바꾸는 게 좋겠네요.<br>
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
중요한 건, `nonnull attribute`을 사용했다고 해서, my_test_function() 함수 안에서 NULL check를 하지 않아도 된다는 뜻은 아닙니다.<br>
이 attribute는 오직 compile-time에서 예측 가능한 상황에서만 동작합니다.<br>
compile-time 검출의 한계이며 어찌 보면 당연한 한계 입니다.<br>

#### -> Can not detect for the following situations:
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
위 상황은 compiler 입장에서 충분히 예측 가능한 NULL인데도 불구하고 검출을 못 하네요..<br><br>

만약 `nonnull attribute`을 사용할 때, argument index list를 주지 않으면, 모든 argument에 대해서 nonnull check를 하게 됩니다.
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
비록 검출의 한계가 있지만, user의 실수를 compile-time에 검출할 가능성이 있다는 것은 큰 이점으로 보입니다.<br>
Compiler attribute는 Runtime overhead도 없기 때문에, 이러한 `attribute`을 많이 활용할 계획입니다.<br>
<div align="right">
jooojub.
</div>
