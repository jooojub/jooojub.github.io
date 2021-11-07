---
layout: post
title:  "gcc options: -Wformat"
date:   2020-11-28
share:	true
tags: [gcc_options]
keywords: [gcc-options, gcc, options, -Wformat]
description: "Check calls to printf and scanf, etc., to make sure that the arguments supplied have types appropriate to the format string specified, and that the conversions specified in the format string make sense."
---

#### Requires
: compiler : gcc 2.8 later
: glibc : 2.2 later
***

When using glibc functions that use format like printf, you may have often seen that a `compile warning` occurs if you use the wrong format.

```c
: If format is used incorrectly, a compile warning occurs.
$ cat ./format_warning.c
#include <stdio.h>

int main(void) {
	printf("%d, %d\n", (int)1, (unsigned long)2);

	return 0;
}
```
```bash
$ gcc -o format_warning format_warning.c
format_warning.c: In function ‘main’:
format_warning.c:4:15: warning: format ‘%d’ expects argument \
  of type ‘int’, but argument 3 has type ‘long unsigned int’ [-Wformat=]
  printf("%d, %d\n", (int)1, (unsigned long)2);
              ~^             ~~~~~~~~~~~~~~~~
```

The compiler kindly informs why you use to print `unsigned long` as `%d`.

Not only the argument type but also the situation where the number of arguments is incorrect is displayed as a warning.

```c
: Even if the number of arguments is incorrectly set.
$ cat ./format_warning2.c
#include <stdio.h>

int main(void) {
	printf("%d, %d\n", 1);

	return 0;
}
```
```bash
$ gcc -o format_warning2 format_warning2.c
format_warning2.c: In function ‘main’:
format_warning2.c:4:15: warning: format ‘%d’ expects a matching ‘int’ argument [-Wformat=]
    printf("%d, %d\n", 1);
```
For <mark>-Wformat</mark>, let's look at the gcc documentation first.

> #### gcc-7.5.0/Warning-Options
> <b>-Wformat</b>
> <b>-Wformat=n</b><br>
> Check calls to <b>printf</b> and <b>scanf</b>, etc.,<br>
to make sure that the arguments supplied have types appropriate to the format string specified, and that the conversions specified in the format string make sense.<br> This includes <b>standard functions</b>, and <b>others specified by format attributes</b> (see Function Attributes),<br> in the printf, scanf, strftime and strfmon (an X/Open extension, not in the C standard) families (or other target-specific families).<br> Which functions are checked without format attributes having been specified depends on the standard version selected, and such checks of functions without the attribute specified are disabled by -ffreestanding or -fno-builtin.<br>
> The formats are checked against the format features supported by <b>GNU libc version 2.2</b>.<br> These include all ISO C90 and C99 features, as well as features from the Single Unix Specification and some BSD and GNU extensions.<br>Other library implementations may not support all these features; GCC does not support warning about features that go beyond a particular library’s limitations.<br> However, if <b>-Wpedantic</b> is used with <b>-Wformat</b>, warnings are given about format features not in the selected standard version (but not for strfmon formats, since those are not in any version of the C standard).<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc-7.5.0/gcc/Warning-Options.html#Warning-Options"><code>https://gcc.gnu.org/onlinedocs/gcc-7.5.0/gcc/Warning-Options.html#Warning-Options</code></a></cite>

It is stated that some standard functions after glibc 2.2 are supported.

So which functions in glibc support <mark>-Wformat</mark>?
If you look at the gcc code, you can see the list of supported functions.

```c
: git checkout releases/gcc-3.0
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
```

The gcc code is too complex to understand in detail, but it seems to be broadly classified into `printf`, `scanf`, and `strftime`.

Then, isn't there a way to add your own function defined using `va_arg()` instead of the glibc standard function as a detection target for <mark>-Wformat</mark>?

You can use <mark>__attribute__((format))</mark> as mentioned in the above document.

`__attribute__((format))` will be discussed in detail in another post.
> Actually, I want to introduce `__attribute__((format))`, so I am explaining `-Wformat` first.

There are many kinds of options of the <mark>-Wformat</mark> type. Let's check these briefly.

Let's take a look at gcc-7.5.0.
***
#### -Wformat-contains-nul
Checks whether format contains a NUL string ('\0').
```c
: sample source code - format_contains_nul.c
#include <stdio.h>

int main(void) {
    char buf[16];
    sprintf(buf, "%s\0", "test");

    return 0;
}
```
```bash
: compile
$ gcc -o format_contains_nul format_contains_nul.c -Wformat-contains-nul
```
```bash
: output
format_contains_nul.c: In function ‘main’:
format_contains_nul.c:5:21: warning: embedded ‘\0’ in format [-Wformat-contains-nul]
    5 |     sprintf(buf, "%s\0", "test");
      |                     ^~
```
***
#### -Wformat-extra-args
Check if there are more arguments than format specifiers.
```c
: sample source code - format_extra_args.c
#include <stdio.h>

int main(void) {
    printf("excess arguments: %s", __LINE__, "what");

    return 0;
}
```
```bash
: compile
$ gcc -o format_extra_args format_extra_args.c -Wformat-extra-args
```
```bash
: output
format_extra_args.c: In function ‘main’:
...
format_extra_args.c:4:12: warning: too many arguments for format [-Wformat-extra-args]
    4 |     printf("excess arguments: %s", __LINE__, "what");
```
***
#### -Wformat-overflow
When writing to the destination buffer according to the format like `sprintf` or `vsprintf`, A value larger than the buffer size is entered and it is checked whether overflow occurs.
```c
: sample source code - format_overflow.c
#include <stdio.h>

int main(void) {
    char buf[10];
    sprintf(buf, "overflow %s", "ho!");

    return 0;
}
```
```bash
: compile
$ gcc -o format_overflow format_overflow.c -Wformat-overflow
```
```bash
: output
format_overflow.c: In function ‘main’:
format_overflow.c:5:28: warning: ‘%s’ directive writing 3 bytes into a region of size 1 [-Wformat-overflow=]
    5 |     sprintf(buf, "overflow %s", "ho!");
      |                            ^~   ~~~~~
format_overflow.c:5:5: note: ‘sprintf’ output 13 bytes into a destination of size 10
    5 |     sprintf(buf, "overflow %s", "ho!");
      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```

What happens if it's hard to predict in a compile time?
```c
: sample source code - format_overflow.c
#include <stdio.h>

int main(int argc, const char *argv[]) {
    char buf[10];
    sprintf(buf, "overflow %s", argv[0]);

    return 0;
}
```
```bash
: compile
$ gcc -o format_overflow format_overflow.c -Wformat-overflow
```
```c
: output
...
```
In fact, regardless of the argv value, the code already causes a buffer overflow by format, but `-Wformat-overflow` is not detecting overflow.
In this case, you can specify the level of <mark>Wformat-overflow</mark>.
```bash
: compile with -Wformat-overflow=2
$  gcc -o format_overflow format_overflow.c -Wformat-overflow=2
```
```bash
: output
format_overflow.c: In function ‘main’:
format_overflow.c:5:30: warning: ‘sprintf’ may write a terminating nul past the end of the destination [-Wformat-overflow=]
    5 |     sprintf(buf, "overflow %s", argv[0]);
      |                              ^
format_overflow.c:5:5: note: ‘sprintf’ output 10 or more bytes (assuming 11) into a destination of size 10
    5 |     sprintf(buf, "overflow %s", argv[0]);
      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
***
#### -Wformat-zero-length
Check if format is zero length.
```c
: sample source code - format_zero_length.c
#include <stdio.h>

int main(void) {
    printf("","zero-length");
    return 0;
}
```
```bash
: compile
$ gcc -o format_zero_length format_zero_length.c -Wformat-zero-length
```
```bash
: output
format_zero_length.c: In function ‘main’:
format_zero_length.c:4:12: warning: zero-length gnu_printf format string [-Wformat-zero-length]
    4 |     printf("","zero-length");
      |            ^~
```
In fact, such code cannot be written, right? However, this code happens surprisingly often.
```c
    const char fmt[] = "";
    printf(fmt,"zero-length");
```
***
#### -Wformat-nonliteral
Checks if format is a string literal.
```c
: sample source code - format_nonliteral.c
#include <stdio.h>

int main(void) {
    char fmt[] = "%s";
    printf(fmt,"test");

    return 0;
}
```
```bash
: compile
$ gcc -o format_nonliteral format_nonliteral.c -Wformat-nonliteral
```
```bash
: output
format_nonliteral.c: In function ‘main’:
format_nonliteral.c:5:12: warning: format not a string literal, argument types not checked [-Wformat-nonliteral]
    5 |     printf(fmt,"test");
      |            ^~~
```
If fmt is specified as const char, this warning disappears.
```diff
- char fmt[] = "%s";
+ const char fmt[] = "%s";
```
However, sometimes you need to write code that needs to dynamically change fmt.
```c
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
```
So, sometimes we add code that ignores this option.
```c
#pragma GCC diagnostic ignored "-Wformat-nonliteral"
...
#pragma GCC diagnostic warning "-Wformat-nonliteral"
```
***
#### -Wformat-security
Detects when format is not string internal and there is no argument.
```c
: sample source code - format_security.c
#include <stdio.h>

int main(void) {
    char *fmt = "%s";
    printf(fmt);

    return 0;
}
```
```bash
: compile
$ gcc -o format_security format_security.c -Wformat-security
```
```bash
: output
format_security.c: In function ‘main’:
format_security.c:5:5: warning: format not a string literal and no format arguments [-Wformat-security]
    5 |     printf(fmt);
      |     ^~~~~~
```
What causes this to be detected? There's a reason the option name is security.

If it is a non-iternal string, the format can be changed to `%n`, and since the arugment can be manipulated through stack overflow, etc., it becomes a code capable of `Format String Bug Exploration`.

That is, the code with the security hole.

I plan to deal with `Format String Bug Exploration` in a post if I get a chance.
***
#### -Wformat-signedness
As the name suggests, when format is signed but argument is used as unsigned, or vice versa.
```c
: sample source code - format_signedness
#include <stdio.h>

int main(void) {
    unsigned int a = 10;
    signed int b = -10;

    printf("%d %u", a, b);

    return 0;
}
```
```bash
: compile
$ gcc -o format_signedness format_signedness.c -Wformat-signedness
```
```bash
: output
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
```
***
#### -Wformat-truncation
It detects and warns that the result is truncated by a function that specifies length, such as snprintf.
```c
: sample source code - format_truncation
#include <stdio.h>

int main(void) {
    char buf[10];
    snprintf(buf, sizeof(buf), "%s", "string truncation");

    return 0;
}
```
```bash
: compile
$ gcc -o format_truncation format_truncation.c -Wformat-truncation
```
```bash
: output
format_truncation.c: In function ‘main’:
format_truncation.c:5:33: warning: ‘%s’ directive output truncated writing 17 bytes into a region of size 10 [-Wformat-truncation=]
    5 |     snprintf(buf, sizeof(buf), "%s", "string truncation");
      |                                 ^~   ~~~~~~~~~~~~~~~~~~~
format_truncation.c:5:5: note: ‘snprintf’ output 18 bytes into a destination of size 10
    5 |     snprintf(buf, sizeof(buf), "%s", "string truncation");
      |     ^~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
```
***
The above problems may seem trivial, but depending on the situation, a stack overflow may occur at runtime, and it may become a security hole.

As the project grows, it can be a great advantage to be able to recognize these issues at compile time and fix them in advance.

Therefore, it is recommended to add <mark>-Wformat</mark> or <mark>-Werror=format</mark> to the compile option as much as possible.