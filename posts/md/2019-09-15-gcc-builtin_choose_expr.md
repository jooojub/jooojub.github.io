---
layout: post
title:  "gcc builtin: choose_expr"
date:   2019-09-15
share:	true
tags: [gcc_builtin]
keywords: [gcc-builtin, gcc, builtin, __builtin_choose_expr]
description: "You can use the built-in function __builtin_choose_expr to evaluate code depending on the value of a constant expression. This built-in function returns exp1 if const_exp, which is an integer constant expression, is nonzero. Otherwise it returns exp2."
---

#### Requires
: compiler : gcc 3.1 later
***

This time, let's take a look at <mark>__builtin_choose_expr</mark> among gcc builtin.
This built-in function does not exist in C++, it exists only in C.

It behaves like a C's 3-way operator`(? : operator)`.
However, it should be borne in mind that this works at <mark>compile-time</mark>, not run-time.

This built-in was added to gcc-3.1 through the 'Aldy Hernandez' patch.

Let's check the explanation in the gcc documentation.

> #### __builtin_choose_expr (const_exp, exp1, exp2)
> You can use the built-in function <b>__builtin_choose_expr</b> to evaluate code depending on the value of a constant expression.
This built-in function returns exp1 if const_exp, which is an integer constant expression, is nonzero. Otherwise it returns exp2.<br>
This built-in function is analogous to the ‘? :’ operator in C, except that the expression returned has its <b>type unaltered by promotion rules</b>.
Also, the built-in function does not evaluate the expression that is not chosen.
For example, if const_exp evaluates to true, exp2 is not evaluated even if it has side effects...<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins"><code>https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins</code></a></cite>

We can easily understand how this builtin function works by looking at the gcc code.
Let's look at the code from gcc 7.4.

```c
: git checkout gcc-7_4_0-release
$ cat ./gcc/c/c-parser.c

	...
	case RID_CHOOSE_EXPR:
	  {
	    ...
	    e1_p = &(*cexpr_list)[0];
	    e2_p = &(*cexpr_list)[1];
	    e3_p = &(*cexpr_list)[2];

	    c = e1_p->value;
	    mark_exp_read (e2_p->value);
	    mark_exp_read (e3_p->value);
	    if (TREE_CODE (c) != INTEGER_CST
		|| !INTEGRAL_TYPE_P (TREE_TYPE (c)))
	      error_at (loc,
			"first argument to %<__builtin_choose_expr%> not"
			" a constant");
	    constant_expression_warning (c);
	    expr = integer_zerop (c) ? *e3_p : *e2_p;
	    set_c_expr_source_range (&expr, loc, close_paren_loc);
		...
```
If you look closely at the codes, you can see that it is implemented as a 3-way ooperator.

```c
expr = integer_zerop (c) ? *e3_p : *e2_p;
-> const_exp ? exp1 : exp2
```

> Don't confuse gcc builtin as a function called at compile time

The first argument must be <mark>const_exp</mark>.
In other words, even if a variable is set at compile time, it cannot be used as an argument.

```c
: can we use the variables for the first argument?
#include <stdio.h>

int main(void) {
	const int cond = 1;
	char *boolean = __builtin_choose_expr(cond, "true", "false");

	printf("boolean: %s\n", boolean);

	return 0;
}
```
```bash
: gcc version 7.4.0 –target=x86_64-linux-gnu
$ gcc -o cond_expr cond_expr.c

cond_expr.c: In function ‘main’:
cond_expr.c:5:18: error: first argument to ‘__builtin_choose_expr’ not a constant
  char *boolean = __builtin_choose_expr(cond, "true", "false");
```
We can see that a compile error occurs.

That is, you can only use `const expr` like this:

```c
: use const expr for the first argument
#define BOOL_TO_STR(__x) \
	__builtin_choose_expr(((__x)), "true", "false")

int main(void) {
	printf("%s\n", BOOL_TO_STR(0));
	printf("%s\n", BOOL_TO_STR(1));

	return 0;
}
```
```bash
: gcc version 7.4.0 –target=x86_64-linux-gnu
$ gcc -o bool_to_str bool_to_str.c
$ ./bool_to_str

false
true
```
```x86asm
: assembly - x86_64 AT&T
int main(void) {
  400526:       55                      push   %rbp
  400527:       48 89 e5                mov    %rsp,%rbp
        printf("%s\n", BOOL_TO_STR(0));
  40052a:       bf d4 05 40 00          mov    $0x4005d4,%edi
  40052f:       e8 cc fe ff ff          callq  400400 <puts@plt>
        printf("%s\n", BOOL_TO_STR(1));
  400534:       bf da 05 40 00          mov    $0x4005da,%edi
  400539:       e8 c2 fe ff ff          callq  400400 <puts@plt>

        return 0;
  40053e:       b8 00 00 00 00          mov    $0x0,%eax
}
  400543:       5d                      pop    %rbp
  400544:       c3                      retq   
  400545:       66 2e 0f 1f 84 00 00    nopw   %cs:0x0(%rax,%rax,1)
  40054c:       00 00 00 
  40054f:       90                      nop
```
```bash
$ strings -t x bool_to_str
...
    5d4 false
    5da true
```

You can see that <mark>__builtin_choose_expr</mark> is converted to `exp1` or `exp2` respectively at compile-time.

Since only `constant exp` can be used, you may think that it is an unnecessary build-in function.

However, it can be surprisingly useful.

For example, the `IS_MASKED macro` that checks whether a specific bit is set at compile time can be written as follows.

```c
: e.g. masked
#define IS_MASKED(__value) \
	__builtin_choose_expr(((__value) & 0x1), 1, 0)

int main(void) {
	printf("masked: %d\n", IS_MASKED(0xff));
	printf("masked: %d\n", IS_MASKED(0x02));
	printf("masked: %d\n", IS_MASKED(0x03));
}
```
```bash
: gcc version 7.4.0 –target=x86_64-linux-gnu
$ gcc -o masked masked.c
$ ./masked

masked: 1
masked: 0
masked: 1
```
It can also be used with `sizeof`.
Looking at the `eBPF` code in the kernel, there is an example of using sizeof as shown below.
```c
: e.g. sizeof in BPF
$ cat ./include/trace/bpf_probe.h

/* cast any integer, pointer, or small struct to u64 */
#define UINTTYPE(size) \
	__typeof__(__builtin_choose_expr(size == 1,  (u8)1, \
		   __builtin_choose_expr(size == 2, (u16)2, \
		   __builtin_choose_expr(size == 4, (u32)3, \
		   __builtin_choose_expr(size == 8, (u64)4, \
					 (void)5)))))
#define __CAST_TO_U64(x) ({ \
	typeof(x) __src = (x); \
	UINTTYPE(sizeof(x)) __dst; \
	memcpy(&__dst, &__src, sizeof(__dst)); \
	(u64)__dst; })
}
```
This `builtin` differs slightly from the 3-way operator.

The 3-way operator returns a `type cast` to a larger type, whereas the <mark>builtin function</mark> returns a `type` of either `exp1` or `exp2`.

```c
: check return type
#include <stdio.h>

#define RET_TYPE(__x) \
	__builtin_choose_expr((__x), ret_int(), ret_char())

int ret_int(void) {
	return 1;
}

char ret_char(void) {
	return 'a';
}

int main(void) {
	/* return char */
	printf("sizeof: %lu\n", sizeof(RET_TYPE(0)));
	/* return int */
	printf("sizeof: %lu\n", sizeof(RET_TYPE(1)));

	return 0;
}
```
```bash
: gcc version 7.4.0 –target=x86_64-linux-gnu
$ gcc -o return_type return_type.c

./return_type
sizeof: 1
sizeof: 4
```
It can be used more nicely with <mark>__builtin_types_compatible_p</mark>, but I will save it for the next post. :)

<mark>__builtin_choose_expr</mark> is often used in combination with other build-in functions that return `const expr`.

For example, Combined with <mark>__builtin_types_compatible_p</mark>,
it is possible to implement `function overloading` for `type-arguments` which seemed impossible in C.

```c
: functon overloading in c 
#include <stdio.h>

#define debug(var) \
	printf(			\
		__builtin_choose_expr( 	\
			__builtin_types_compatible_p(typeof(var), int) 	\
			,"%d\n", __builtin_choose_expr(					\
				__builtin_types_compatible_p(typeof(var), char []) 	\
				,"%s\n", "0x%x\n")), var);

int main(void) {
	debug(1234);
	debug("jooojub");

	return 0;
}
```
```bash
: gcc version 7.4.0 –target=x86_64-linux-gnu
$ gcc -o function_overloading function_overloading.c 
$ ./function_overloading

1234
jooojub
```
<mark>__builtin_types_compatible_p</mark> will be covered in another post.
> Also in standard C, you can implement `number of arguments` using macros.
> If I get a chance, I'll cover this in another post as well.

<mark>__builtin_choose_expr</mark> is simple and easy to understand, but if used usefully, it can reduce unnecessary code, so please use it a lot.