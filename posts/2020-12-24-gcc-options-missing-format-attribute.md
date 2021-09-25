---
layout: post
title:  "gcc options: -Wmissing-format-attribute"
date:   2020-12-20
share:	true
tags: [gcc_options]
keywords: [gcc-options, gcc, options, -Wmissing-format-attribute, -Wsuggest-attribute=format]
description: "Warn about function pointers that might be candidates for format attributes. Note these are only possible candidates, not absolute ones. GCC guesses that function pointers with format attributes that are used in assignment, initialization, parameter passing or return statements should have a corresponding format attribute in the resulting type."
---

Requires:
 1. Wmissing-format-attribute:
    * compiler: gcc 3.0 later
 2. Wsuggest-attribute=format
    * compiler: gcc 4.8 later

Prior knowledge:
 * gcc options: [-Wformat]({% post_url 2020-11-28-gcc-options-format %})
 * gcc attribute: [format attribute]({% post_url 2020-12-06-gcc-attribute-format %})

이전 [post]({% post_url 2020-12-06-gcc-attribute-format %}) `format attribute`를 이용하면 자신이 만든 custom 함수에서도 `-wformat` gcc option을 사용할 수 있다고 하였습니다.

초반에는 `format attribute`을 열심히 추가하며 코드를 작성하다가 프로젝트의 규모가 점점 커지다 보면 어느새 attribute 추가를 잊어버리게 되어 누락되는 경우가 자주 발생하게 됩니다.

이러한 경우를 대비해서 gcc에서는 친절하게 `suggest` 관련 option들을 추가해 주었습니다.





printf 와 같이 format을 사용하는 glibc 함수들을 사용할 때, 잘못된 format을 사용할 경우 compile warning이 발생하는 것을 종종 보았을 것입니다.
#### -> If format is used incorrectly, a compile warning occurs.
{% highlight c %}
$ cat ./format_warning.c
#include <stdio.h>

int main(void) {
	printf("%d, %d\n", (int)1, (unsigned long)2);

	return 0;
}
{% endhighlight %}
{% highlight bash %}
$ gcc -o format_warning format_warning.c
format_warning.c: In function ‘main’:
format_warning.c:4:15: warning: format ‘%d’ expects argument \
  of type ‘int’, but argument 3 has type ‘long unsigned int’ [-Wformat=]
  printf("%d, %d\n", (int)1, (unsigned long)2);
              ~^             ~~~~~~~~~~~~~~~~
{% endhighlight %}
compiler라 `unsigned long`을 왜 `%d`로 출력하려고 하냐고 친절하게 warning으로 알려줍니다.<br>
argument type 뿐만 아니라 argument 갯수가 잘못된 상황도 warning으로 보여줍니다.
#### -> Even if the number of arguments is incorrectly set.
{% highlight c %}
$ cat ./format_warning2.c
#include <stdio.h>

int main(void) {
	printf("%d, %d\n", 1);

	return 0;
}
{% endhighlight %}
{% highlight bash %}
$ gcc -o format_warning2 format_warning2.c
format_warning2.c: In function ‘main’:
format_warning2.c:4:15: warning: format ‘%d’ expects a matching ‘int’ argument [-Wformat=]
    printf("%d, %d\n", 1);
{% endhighlight %}

-Wformat에 대해서 우선 gcc 문서를 살펴 보겠습니다.

***
<table>
    <thead>
        <tr>
            <th>gcc-7.5.0/Warning-Options</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <b>-Wformat</b><br>
                <b>-Wformat=n</b><br>
                Check calls to <b>printf</b> and <b>scanf</b>, etc.,<br>
                to make sure that the arguments supplied have types appropriate to the format string specified, and that the conversions specified in the format string make sense.<br> This includes <b>standard functions</b>, and <b>others specified by format attributes</b> (see Function Attributes),<br> in the printf, scanf, strftime and strfmon (an X/Open extension, not in the C standard) families (or other target-specific families).<br> Which functions are checked without format attributes having been specified depends on the standard version selected, and such checks of functions without the attribute specified are disabled by -ffreestanding or -fno-builtin.<br><br>
                The formats are checked against the format features supported by <b>GNU libc version 2.2</b>.<br> These include all ISO C90 and C99 features, as well as features from the Single Unix Specification and some BSD and GNU extensions.<br>Other library implementations may not support all these features; GCC does not support warning about features that go beyond a particular library’s limitations.<br> However, if <b>-Wpedantic</b> is used with <b>-Wformat</b>, warnings are given about format features not in the selected standard version (but not for strfmon formats, since those are not in any version of the C standard).
                <br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc-7.5.0/gcc/Warning-Options.html#Warning-Options"><code>https://gcc.gnu.org/onlinedocs/gcc-7.5.0/gcc/Warning-Options.html#Warning-Options</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***

glibc 2.2 이후의 몇몇 standard function에 대해서 지원한다고 나와 있습니다.<br>
그럼 glibc의 어떤 함수들이 `-Wformat`을 지원할까요?<br>
gcc 코드를 살펴보면 지원되는 함수 종류들을 볼 수 있습니다.

#### -> git checkout releases/gcc-3.0
{% highlight c %}
$ cat ./gcc/c-format.c
...
void
init_function_format_info ()
{
  if (flag_hosted)
    {
      /* Functions from ISO/IEC 9899:1990.  */
      record_function_format (get_identifier ("printf"), NULL_TREE,
			      printf_format_type, 1, 2);
      record_function_format (get_identifier ("__builtin_printf"), NULL_TREE,
			      printf_format_type, 1, 2);
      record_function_format (get_identifier ("fprintf"), NULL_TREE,
			      printf_format_type, 2, 3);
      record_function_format (get_identifier ("__builtin_fprintf"), NULL_TREE,
			      printf_format_type, 2, 3);
      record_function_format (get_identifier ("sprintf"), NULL_TREE,
			      printf_format_type, 2, 3);
      record_function_format (get_identifier ("scanf"), NULL_TREE,
			      scanf_format_type, 1, 2);
      record_function_format (get_identifier ("fscanf"), NULL_TREE,
			      scanf_format_type, 2, 3);
      record_function_format (get_identifier ("sscanf"), NULL_TREE,
			      scanf_format_type, 2, 3);
      record_function_format (get_identifier ("vprintf"), NULL_TREE,
			      printf_format_type, 1, 0);
      record_function_format (get_identifier ("vfprintf"), NULL_TREE,
			      printf_format_type, 2, 0);
      record_function_format (get_identifier ("vsprintf"), NULL_TREE,
			      printf_format_type, 2, 0);
      record_function_format (get_identifier ("strftime"), NULL_TREE,
			      strftime_format_type, 3, 0);
    }

  if (flag_hosted && flag_isoc99)
    {
      /* ISO C99 adds the snprintf and vscanf family functions.  */
      record_function_format (get_identifier ("snprintf"), NULL_TREE,
			      printf_format_type, 3, 4);
      record_function_format (get_identifier ("vsnprintf"), NULL_TREE,
			      printf_format_type, 3, 0);
      record_function_format (get_identifier ("vscanf"), NULL_TREE,
			      scanf_format_type, 1, 0);
      record_function_format (get_identifier ("vfscanf"), NULL_TREE,
			      scanf_format_type, 2, 0);
      record_function_format (get_identifier ("vsscanf"), NULL_TREE,
			      scanf_format_type, 2, 0);
    }
  ...
{% endhighlight %}
gcc 코드는 너무 복잡해서 자세히는 이해 못 했지만, 크게 `printf`, `scanf`, `strftime`로 분류하는 것으로 보입니다.<br><br>
그렇다면 glibc standard 함수가 아닌 `va_arg()`를 이용해 정의한 자신만의 함수도 `-Wformat`의 검출 대상으로 추가하는 방법은 없을까요?<br>
위 문서에서도 살짝 언급했듯 `__attribute__((format))`를 사용하면 됩니다.<br>
`__attribute__((format))`에 대해서는 다른 post에서 자세히 설명하겠습니다.<br>
(사실 `__attribute__((format))`를 소개하고 싶어서 `-Wformat`를 먼저 설명하고 있는 것입니다...)<br>

`-Wformat` 종류의 option은 많은 종류가 있습니다. 이것들에 대해서 간략하게 확인해봅시다.<br>
gcc-7.5.0 기준으로 알아보겠습니다.<br>




## -Wformat-contains-nul
format에 NUL string('\0')이 포함되어 있는지를 검사합니다.
#### -> sample source code: format_contains_nul.c
{% highlight c %}
#include <stdio.h>

int main(void) {
    char buf[16];
    sprintf(buf, "%s\0", "test");

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_contains_nul format_contains_nul.c -Wformat-contains-nul
{% endhighlight %}
#### -> output
{% highlight bash %}
format_contains_nul.c: In function ‘main’:
format_contains_nul.c:5:21: warning: embedded ‘\0’ in format [-Wformat-contains-nul]
    5 |     sprintf(buf, "%s\0", "test");
      |                     ^~
{% endhighlight %}




## -Wformat-extra-args
format의 specifiers 보다 argument 개수가 많을 경우를 검사합니다.
#### -> sample source code: format_extra_args.c
{% highlight c %}
#include <stdio.h>

int main(void) {
    printf("excess arguments: %s", __LINE__, "what");

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_extra_args format_extra_args.c -Wformat-extra-args
{% endhighlight %}
#### -> output
{% highlight bash %}
format_extra_args.c: In function ‘main’:
...
format_extra_args.c:4:12: warning: too many arguments for format [-Wformat-extra-args]
    4 |     printf("excess arguments: %s", __LINE__, "what");
{% endhighlight %}




## -Wformat-overflow
sprintf나 vsprintf와 같이 format에 따라 destination buffer에 쓰는 경우,
buffer size 보다 큰 값이 들어와 overflow가 발생하는지를 검사합니다.
#### -> sample source code: format_overflow.c
{% highlight c %}
#include <stdio.h>

int main(void) {
    char buf[10];
    sprintf(buf, "overflow %s", "ho!");

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_overflow format_overflow.c -Wformat-overflow
{% endhighlight %}
#### -> output
{% highlight bash %}
format_overflow.c: In function ‘main’:
format_overflow.c:5:28: warning: ‘%s’ directive writing 3 bytes into a region of size 1 [-Wformat-overflow=]
    5 |     sprintf(buf, "overflow %s", "ho!");
      |                            ^~   ~~~~~
format_overflow.c:5:5: note: ‘sprintf’ output 13 bytes into a destination of size 10
    5 |     sprintf(buf, "overflow %s", "ho!");
      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{% endhighlight %}
만약 compile time에 예측하기 힘든 상황에서는 어떻게 될까요?

#### -> sample source code: format_overflow.c
{% highlight c %}
#include <stdio.h>

int main(int argc, const char *argv[]) {
    char buf[10];
    sprintf(buf, "overflow %s", argv[0]);

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_overflow format_overflow.c -Wformat-overflow
{% endhighlight %}
#### -> output
{% highlight c %}
...
{% endhighlight %}
사실 argv 값에 상관없이 format에 의해 이미 buffer overflow가 발생하는 코드지만,
-Wformat-overflow가 overflow를 감지하지 못하고 있습니다.

이럴 때는 Wformat-overflow의 level을 지정하면 됩니다.
#### -> compile with -Wformat-overflow=2
{% highlight bash %}
$  gcc -o format_overflow format_overflow.c -Wformat-overflow=2
{% endhighlight %}
#### -> output
{% highlight bash %}
format_overflow.c: In function ‘main’:
format_overflow.c:5:30: warning: ‘sprintf’ may write a terminating nul past the end of the destination [-Wformat-overflow=]
    5 |     sprintf(buf, "overflow %s", argv[0]);
      |                              ^
format_overflow.c:5:5: note: ‘sprintf’ output 10 or more bytes (assuming 11) into a destination of size 10
    5 |     sprintf(buf, "overflow %s", argv[0]);
      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{% endhighlight %}




## -Wformat-zero-length
format이 zero length일 경우를 검사합니다.
#### -> sample source code: format_zero_length.c
{% highlight c %}
#include <stdio.h>

int main(void) {
    printf("","zero-length");
    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_zero_length format_zero_length.c -Wformat-zero-length
{% endhighlight %}
#### -> output
{% highlight bash %}
format_zero_length.c: In function ‘main’:
format_zero_length.c:4:12: warning: zero-length gnu_printf format string [-Wformat-zero-length]
    4 |     printf("","zero-length");
      |            ^~
{% endhighlight %}
사실상 이런 코드는 작성될 리가 없겠죠? 하지만 이런 코드는 의외로 자주 발생됩니다.
{% highlight c %}
    const char fmt[] = "";
    printf(fmt,"zero-length");
{% endhighlight %}





## -Wformat-nonliteral
format이 string literal 인지 검사합니다.
#### -> sample source code: format_nonliteral.c
{% highlight c %}
#include <stdio.h>

int main(void) {
    char fmt[] = "%s";
    printf(fmt,"test");

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_nonliteral format_nonliteral.c -Wformat-nonliteral
{% endhighlight %}
#### -> output
{% highlight bash %}
format_nonliteral.c: In function ‘main’:
format_nonliteral.c:5:12: warning: format not a string literal, argument types not checked [-Wformat-nonliteral]
    5 |     printf(fmt,"test");
      |            ^~~
{% endhighlight %}
fmt를 const char로 지정할 경우 이 warning은 사라지게 됩니다.
{% highlight diff %}
- char fmt[] = "%s";
+ const char fmt[] = "%s";
{% endhighlight %}
하지만 경우에 따라 fmt를 dynamic 하게 변경해야 하는 코드를 작성해야 하는 경우도 있습니다.
{% highlight c %}
#include <stdio.h>

char* get_format(int value) {
    if (value == 1)
        return "%d";
    else
        return "%s";
}

int main(void) {
    printf(get_format(1),"test");

    return 0;
}
{% endhighlight %}
그래서 경우에 따라 이 option을 무시하는 코드를 추가하기도 합니다.
{% highlight c %}
#pragma GCC diagnostic ignored "-Wformat-nonliteral"
...
#pragma GCC diagnostic warning "-Wformat-nonliteral"
{% endhighlight %}



## -Wformat-security
format이 string iternal이 아니면서, argument가 없을 경우를 감지합니다.<br>
#### -> sample source code: format_security.c
{% highlight c %}
#include <stdio.h>

int main(void) {
    char *fmt = "%s";
    printf(fmt);

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_security format_security.c -Wformat-security
{% endhighlight %}
#### -> output
{% highlight bash %}
format_security.c: In function ‘main’:
format_security.c:5:5: warning: format not a string literal and no format arguments [-Wformat-security]
    5 |     printf(fmt);
      |     ^~~~~~
{% endhighlight %}
이것을 감지하는 이유는 무엇일까요? option 이름이 security인 이유가 있습니다.<br>
non-iternal string일 경우 format을 `%n`으로 변경 가능하며, stack overflow 등을 통해서 arugment를 조작 가능하기 때문에 `Format String Bug Exploration` 가능한 코드가 됩니다.<br>
즉 security hole이 있는 코드가 됩니다.<br>
`Format String Bug Exploration`에 대해서는 기회가 된다면 post로 다뤄볼 계획입니다.




## -Wformat-signedness
이름 그대로 format이 signed인데 argument를 unsigned로 사용했을 경우, 또는 그 반대의 경우를 감지합니다.
#### -> sample source code: format_signedness
{% highlight c %}
#include <stdio.h>

int main(void) {
    unsigned int a = 10;
    signed int b = -10;

    printf("%d %u", a, b);

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_signedness format_signedness.c -Wformat-signedness
{% endhighlight %}
#### -> output
{% highlight bash %}
format_signedness.c: In function ‘main’:
format_signedness.c:7:14: warning: format ‘%d’ expects argument of type ‘int’, but argument 2 has type ‘unsigned int’ [-Wformat=]
    7 |     printf("%d %u", a, b);
      |             ~^      ~
      |              |      |
      |              int    unsigned int
      |             %d
format_signedness.c:7:17: warning: format ‘%u’ expects argument of type ‘unsigned int’, but argument 3 has type ‘int’ [-Wformat=]
    7 |     printf("%d %u", a, b);
      |                ~^      ~
      |                 |      |
      |                 |      int
      |                 unsigned int
      |                %u
{% endhighlight %}





## -Wformat-truncation
snprintf와 같이 length를 지정하는 function에 의해 결과가 잘린다는 것을 감지하고 경고해 줍니다.
#### -> sample source code: format_truncation
{% highlight c %}
#include <stdio.h>

int main(void) {
    char buf[10];
    snprintf(buf, sizeof(buf), "%s", "string truncation");

    return 0;
}
{% endhighlight %}
#### -> compile
{% highlight bash %}
$ gcc -o format_truncation format_truncation.c -Wformat-truncation
{% endhighlight %}
#### -> output
{% highlight bash %}
format_truncation.c: In function ‘main’:
format_truncation.c:5:33: warning: ‘%s’ directive output truncated writing 17 bytes into a region of size 10 [-Wformat-truncation=]
    5 |     snprintf(buf, sizeof(buf), "%s", "string truncation");
      |                                 ^~   ~~~~~~~~~~~~~~~~~~~
format_truncation.c:5:5: note: ‘snprintf’ output 18 bytes into a destination of size 10
    5 |     snprintf(buf, sizeof(buf), "%s", "string truncation");
      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
{% endhighlight %}

위와 같은 문제들은 사소해 보일 수도 있지만, 상황에 따라 runtime에 stack overflow가 발생할 수도 있으며, security hole이 될 수도 있습니다.<br>
프로젝트가 커질수록 이러한 문제들을 Compile time에 인지하고 미리 수정 가능하다는 것이 큰 이점으로 작용할 수 있습니다.<br>
따라서, 최대한 compile option에 `-Wformat` 혹은 `-Werror=format`을 추가하는 것을 권장 드립니다.
<div align="right">
jooojub.
</div>







74ff46299b5d4b97dc736fc77fb3a2618c119e85
e6c69da096bf607239e04f97ad2a402bcac924c0

90137d8f2c5dfb3cb589e4b3497c63d7f810767e


74ff46299b5d4b97dc736fc77fb3a2618c119e85


54d62f5148fe