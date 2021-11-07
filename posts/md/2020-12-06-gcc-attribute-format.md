---
layout: post
title:  "gcc attribute: format, format_arg"
date:   2020-12-06
share:	true
tags: [gcc_attribute]
keywords: [gcc-attribute, gcc, attribute, format, format_arg]
description: "The format attribute specifies that a function takes printf, scanf, strftime or strfmon style arguments which should be type-checked against a format string."
---

#### Requires
: compiler : gcc 2.8.0 later
***

#### Prior knowledge
: gcc options : [-Wformat](/post/2020-11-28-gcc-options-format)

As discussed in the previous post [-Wformat](/post/2020-11-28-gcc-options-format), using <mark>-Wformat</mark> of the gcc option has many advantages because format-related mistakes can be checked at `compile-time` when using glibc functions that deal with arugments such as printf and scanf.


If so, can't we get help from <mark>-Wformat</mark> in functions other than glibc functions like printf and scanf?<br>
Let's say you wrote the following code:

```c
: sample source code - format
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
```
```bash
: Compile with -Wformat
$ gcc -o format format.c -Wformat
...
```
Compile was successful without any warning even though the format of the report and the number of arguments did not match.

Then, what should I do to support the <mark>-Wformat</mark> of the report() function I wrote?

If you look carefully in the gcc documentation, you will find an `attribute` called <mark>format</mark>.

> #### format (archetype, string-index, first-to-check)
> The format attribute specifies that a function takes <b>printf, scanf, strftime or strfmon</b> style arguments which should be type-checked against a format string.<br>
>...<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html</code></a></cite>

The explanation is a bit long, so I skipped it all.
The conclusion is that you can use <mark>-Wformat</mark> for any function you want.

Then, in the above example code, add <mark>attribute format</mark> and change it to detectable `-Wformat` code at compile-time.
```c
: sample source code - format.c
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
```
```bash
: Compile with -Wformat
$ gcc -o format format.c -Wformat

format.c: In function ‘main’:
format.c:16:9: warning: too many arguments for format [-Wformat-extra-args]
   16 |  report("%s\n", "report!", "excess");
      |         ^~~~~~
```

The report function I wrote was also detected as a warning by the `-Wformat` option.

Usage is simple.
```c
__attribute__((format(archetype, string-index, first-to-check)))
```

You can use `printf`, `scanf`, `strftime` for archetype. Depending on the target, gnu_* of glibc may be attached, or ms_* of MinGW may be attached.

For string-index, specify the position of `format argument`. The important thing is that the index starts at 1, not 0. In the example function `int report(const char *fmt, ...)`, we specified 1 because `fmt` is the first argument.

For first-to-check, you can specify the position in the argument.

Note that
For functions with no argument(like ...), such as `vprintf`, you can set `first-to-check` to 0.

```c
: sample source code - format_vprintf.c
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
```
```bash
: Compile with -Wformat
$ gcc -o format_vprintf format_vprintf.c -Wformat

format_vprintf.c: In function ‘report’:
format_vprintf.c:13:22: warning: embedded ‘\0’ in format [-Wformat-contains-nul]
   13 |     _va_report(n, "%s\0\n", arg);
      |                      ^~
```
In this case, we only check the format.
In other words, the following code cannot be detected.
```c
: -Wformat-extra-args is not detected
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
```
```bash
: Compile with -Wformat-extra-args, but not detected
$ gcc -o format_vprintf format_vprintf.c -Wformat -Wformat-extra-args
...
```
The same goes for `strtime`. Used with `first-to-check` set to 0.
```c
: sample source code - strftime.c
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
```
```bash
: Compile with -Wformat
$ gcc -o strftime strftime.c -Wformat

strftime.c: In function ‘main’:
strftime.c:19:38: warning: unknown conversion type character ‘i’ in format [-Wformat=]
   19 |     get_time("%A, %b %d.\nTime: %r..%i?", tptr);
      |                                      ^
```
You can also set the attribute in the function declaration.
```c
int report(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
```

This attribute is an old attribute that has already been included since `gcc 2.8.0 release`.
```c
: gcc 2.8.0 release - c-common.c
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
```
At this time only archetypes `printf` and `scanf` were supported.

`strftime` was added to `gcc-2.9`.
```diff
: release/gcc-2.95 - cat This-change-is-from-an-idea-suggested-by-Arthur-Davi.patch
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
```
***
#### format_arg
If you look at the gcc code and documentation, you will also see an `attribute` called `format_arg`.
This attribute also works the same as `format attribute`.
The difference is that you use it in functions that only have `format`.

For example, you can create a function that adds a prefix to the format string like this:
In this case you can use `format_arg`
```c
: sample source code - format_arg.c
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
```
```bash
: Compile with -Wformat
$ gcc -o format_arg format_arg.c -Wformat

format_arg.c: In function ‘main’:
format_arg.c:13:43: warning: too many arguments for format [-Wformat-extra-args]
   13 |     printf(debug_format(buf, sizeof(buf), "%s\n"), "arg1", "excess");
      |                                           ^~~~~~
```
Personally, I think that <mark>-Wformat</mark> is a powerful option that can detect problems that may occur at run-time in advance at compile-time.
So, when writing code, if possible, add <mark>-Werror=format</mark> to generate a compile error.

However, in fact, when writing code, there are many times when I forget to add `-Wformat` related attribute to my code.

For this, gcc also provides an option called `-Wmissing-format-attribute`.
I plan to write an additional post about `-Wmissing-format-attribute` as well.

The conclusion is the same as when `-Wformat`. It is recommended to use the <mark>format attribute</mark> a lot to solve predictable problems at compile-time in advance.