---
layout: post
title:  "gcc attribute: format, format_arg"
date:   2020-12-06
share:	true
tags: [gcc-attribute]
keywords: [gcc-attribute, gcc, attribute, format, format_arg]
description: "The format attribute specifies that a function takes printf, scanf, strftime or strfmon style arguments which should be type-checked against a format string."
---

Requires :
 * compiler: gcc 2.8.0 later

Prior knowledge:
 * gcc options: [-Wformat]({% post_url 2020-11-28-gcc-options-format %})

이전 [post]({% post_url 2020-11-28-gcc-options-format %})에서 다뤘듯이 gcc option의 -Wformat를 이용하면 printf, scanf와 같이 arugment를 다루는 glibc 함수 사용 시 format 관련 실수를 compile-time에 확인할 수 있어 많은 이점이 있다고 하였습니다.

그렇다면 printf, scanf와 같이 glibc 함수가 아닌 다른 함수에서는 -Wformat의 도움을 받을 수 없을까요?<br>
다음과 같은 코드를 작성했다고 가정해 보겠습니다.

#### -> sample source code: format
{% highlight c %}
#include <stdio.h>
#include <stdarg.h>

int report(const char *fmt, ...) {
	va_list arg;

	va_start(arg, fmt);
	vfprintf(stderr, fmt, arg);
	va_end(arg);

	return 0;
}

int main(void) {
	report("%s\n", "report!", "excess");

	return 0;
}
{% endhighlight %}
#### -> Compile with -Wformat
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -o format format.c -Wformat
...
{% endhighlight %}
report의 format과 argument의 개수가 맞지 않음에도 아무런 warning 없이 컴파일 성공하였습니다.<br>
그렇다면 제가 작성한 report() 함수의 -Wformat 지원을 위해서는 어떻게 해야 할까요?<br>
gcc 문서를 잘 찾아보면, `format`이라는 `attribute`를 찾을 수 있습니다.

***
<table>
    <thead>
        <tr>
            <th>format (archetype, string-index, first-to-check)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                The format attribute specifies that a function takes <b>printf, scanf, strftime or strfmon</b> style arguments which should be type-checked against a format string.<br>
                ...<br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***

설명이 좀 길어서 다 생략했습니다...<br>
결론은 자신이 원하는 함수에도 `-Wformat`을 사용할 수 있다는 설명입니다.<br><br>
그럼 위 예제 코드에서 `attribute foramt`을 추가해 compile-time에 -Wformat 검출 가능한 코드로 변경해 보겠습니다.

#### -> sample source code: format.c
{% highlight c %}
#include <stdio.h>
#include <stdarg.h>

__attribute__((format(printf, 1, 2)))
int report(const char *fmt, ...) {
	va_list arg;

	va_start(arg, fmt);
	vfprintf(stderr, fmt, arg);
	va_end(arg);

	return 0;
}

int main(void) {
	report("%s\n", "report!", "excess");

	return 0;
}
{% endhighlight %}
#### -> Compile with -Wformat
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -o format format.c -Wformat

format.c: In function ‘main’:
format.c:16:9: warning: too many arguments for format [-Wformat-extra-args]
   16 |  report("%s\n", "report!", "excess");
      |         ^~~~~~
{% endhighlight %}
제가 작성한 report 함수에 대해서도 `-Wformat` option에 의해 warning으로 검출되었습니다.<br><br>
사용법은 간단합니다.
<div class="noline" markdown="1">
{% highlight c %}
__attribute__((format(archetype, string-index, first-to-check)))
{% endhighlight %}
- archetype에는 `printf`, `scanf`, `strftime`을 사용할 수 있습니다. target에 따라 glibc의 gnu_*를 붙일 수도 있고, MinGW의 ms_*를 붙일수도 있다고 합니다.
- string-index에는 `format argument`의 위치를 지정하면 됩니다. 중요한 점은 index가 0이 아닌 1부터 시작한다는 것입니다. 예제의 `int report(const char *fmt, ...)` 함수에서는 `fmt`가 첫 번째 argument이기 때문에 1을 지정했습니다.
- first-to-check에는 argument에 위치를 지정하면 됩니다.

참고로<br>
`vprintf`와 같이 argument(like ...)가 없는 함수에는 `first-to-check`를 0으로 지정하면 됩니다.
#### -> sample source code: format_vprintf.c
{% highlight c %}
#include <stdio.h>
#include <stdarg.h>

__attribute__((format(printf, 2, 0)))
int _va_report(int n, const char *fmt, va_list ap) {
    return vfprintf(stdout, fmt, ap);
}

int report(int n, ...) {
	va_list arg;

	va_start(arg, n);
  _va_report(n, "%s\0\n", arg);
	va_end(arg);

	return 0;
}

int main(void) {
  report(2, "1");
	return 0;
}
{% endhighlight %}
#### -> Compile with -Wformat
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -o format_vprintf format_vprintf.c -Wformat

format_vprintf.c: In function ‘report’:
format_vprintf.c:13:22: warning: embedded ‘\0’ in format [-Wformat-contains-nul]
   13 |     _va_report(n, "%s\0\n", arg);
      |                      ^~
{% endhighlight %}
이 경우에는 format에 대해서만 check 합니다.<br>
즉 아래와 같은 코드는 검출이 안됩니다.
#### -> -Wformat-extra-args is not detected
{% highlight c %}
#include <stdio.h>
#include <stdarg.h>

__attribute__((format(printf, 2, 0)))
int _va_report(int n, const char *fmt, va_list ap) {
    return vfprintf(stdout, fmt, ap);
}

int report(int n, ...) {
	va_list arg;

	va_start(arg, n);
  _va_report(n, "%s\n", arg);
	va_end(arg);

	return 0;
}

int main(void) {
  report(3, "1", "2", "3");
	return 0;
}
{% endhighlight %}
#### -> Compile with -Wformat-extra-args, but not detected
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -o format_vprintf format_vprintf.c -Wformat -Wformat-extra-args
...
{% endhighlight %}
`strtime`도 마찬가지입니다. `first-to-check`를 0으로 설정해서 사용합니다.

#### -> sample source code: strftime.c
{% highlight c %}
#include <stdio.h>
#include <time.h>

__attribute__((format(strftime, 1, 0)))
void get_time(const char *fmt, struct tm * tptr) {
    char buf[64];

    strftime(buf, sizeof(buf), fmt, tptr);
    puts(buf);
}

int main(void) {
    time_t tmp;
    struct tm *tptr;

    tmp = time(NULL);
    tptr = localtime(&tmp);

    get_time("%A, %b %d.\nTime: %r..%i?", tptr);

    return 0;
}
{% endhighlight %}
#### -> Compile with -Wformat
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -o strftime strftime.c -Wformat

strftime.c: In function ‘main’:
strftime.c:19:38: warning: unknown conversion type character ‘i’ in format [-Wformat=]
   19 |     get_time("%A, %b %d.\nTime: %r..%i?", tptr);
      |                                      ^
{% endhighlight %}

함수 선언에 attribute를 설정해도 됩니다. 
{% highlight c %}
int report(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
{% endhighlight %}
이 attribute는 `gcc 2.8.0 release` 때부터 이미 포함되어 있었던 오래된 attribute입니다.
#### -> gcc 2.8.0 release: c-common.c
{% highlight c %}
static void
init_attributes ()
{
  ...
  add_attribute (A_FORMAT, "format", 3, 3, 1);
  add_attribute (A_FORMAT_ARG, "format_arg", 1, 1, 1);
  ...
}

void
decl_attributes (node, attributes, prefix_attributes)
     tree node, attributes, prefix_attributes;
{
  ...
  case A_FORMAT:
  {
    ...
    if (TREE_CODE (format_type) == IDENTIFIER_NODE
		&& (!strcmp (IDENTIFIER_POINTER (format_type), "printf")
		    || !strcmp (IDENTIFIER_POINTER (format_type),
				"__printf__")))
	      is_scan = 0;
	    else if (TREE_CODE (format_type) == IDENTIFIER_NODE
		     && (!strcmp (IDENTIFIER_POINTER (format_type), "scanf")
			 || !strcmp (IDENTIFIER_POINTER (format_type),
				     "__scanf__")))
	      is_scan = 1;
	    else if (TREE_CODE (format_type) == IDENTIFIER_NODE)
	      {
		error ("`%s' is an unrecognized format function type",
		       IDENTIFIER_POINTER (format_type));
		continue;
	      }
	    else
	      {
		error ("unrecognized format specifier");
		continue;
	      }
  ...
}
{% endhighlight %}
이 당시에는 archetype이 `printf`와 `scanf` 만 지원됐었습니다.

`strftime`은 `gcc-2.9`에 추가되었습니다.
#### -> release/gcc-2.95: cat This-change-is-from-an-idea-suggested-by-Arthur-Davi.patch
{% highlight diff %}
+	* c-common.c (decl_attributes, record_function_format,
+	check_format_info, init_function_format_info):
+	Add support for strftime format checking.
...
+		char *p = IDENTIFIER_POINTER (format_type_id);
+		
+		if (!strcmp (p, "printf") || !strcmp (p, "__printf__"))
+		  format_type = printf_format_type;
+		else if (!strcmp (p, "scanf") || !strcmp (p, "__scanf__"))
+		  format_type = scanf_format_type;
+		else if (!strcmp (p, "strftime")
+			 || !strcmp (p, "__strftime__"))
+		  format_type = strftime_format_type;
+		else
+		  {
+		    error ("`%s' is an unrecognized format function type", p);
+		    continue;
+		  }
{% endhighlight %}
### format_arg
gcc 코드와 document를 살펴보면 `format_arg`라는 `attribute`도 볼 수 있습니다.<br>
이 attribute도 `format attribute`와 같은 역할을 합니다.<br>
다른 점은 `format`만 있는 함수에서 사용합니다.
예를 들어 다음과 같이 format string에 prefix를 추가하는 함수를 만들 수 있습니다.<br>
이 경우에는 `format_arg`를 사용하면 됩니다.
#### -> sample source code: format_arg.c
{% highlight c %}
#include <stdio.h>

__attribute__((format_arg(3)))
char *debug_format(char *buf, size_t len, char *fmt) {
    snprintf(buf, len, "[debug] %s", fmt);

    return buf;
}

int main(void) {
    char buf[32];

    printf(debug_format(buf, sizeof(buf), "%s\n"), "arg1", "excess");

    return 0;
}
{% endhighlight %}
#### -> Compile with -Wformat
<div class="noline" markdown="1">
{% highlight bash %}
$ gcc -o format_arg format_arg.c -Wformat

format_arg.c: In function ‘main’:
format_arg.c:13:43: warning: too many arguments for format [-Wformat-extra-args]
   13 |     printf(debug_format(buf, sizeof(buf), "%s\n"), "arg1", "excess");
      |                                           ^~~~~~
{% endhighlight %}
개인적으로 `-Wformat`은 자칫 run-time에 발생할 수 있는 문제를 compile-time에 미리 알 수 있는 강력한 option이라고 생각합니다.<br>
그래서 전 코드 작성할 때 가능하면 `-Werror=format`을 추가해 compile error를 발생시키도록 하고 있습니다.<br>
하지만 사실 코드를 작성하다 보면, 제가 작성한 코드에 대해서 -Wformat 관련 attribute 추가하는 것을 잊어버릴 때가 많이 있습니다.

이럴 때를 위해 gcc는 `-Wmissing-format-attribute`이라는 option도 제공해 줍니다.<br>
`-Wmissing-format-attribute`에 대해서도 추가 post를 작성할 계획입니다.

결론은 `-Wformat`때와 동일합니다. compile-time에 예측 가능한 문제들을 미리 해결할 수 있도록 `format attribute`를 많이 활용하길 권장 드립니다.
<div align="right">
jooojub.
</div>
