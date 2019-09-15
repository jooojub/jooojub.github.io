---
layout: post
title:  "gcc builtin: choose_expr"
date:   2019-09-15
share:	true
tags: [gcc-builtin]
keywords: [gcc-builtin, gcc, builtin, __builtin_choose_expr]
---

Requires:
 * compiler: gcc 3.1 later

Let's take a look at `__builtin_choose_expr` that one of the gcc builtins.

This only include in C not C++. It behaves like a 3-way operator(? : operator) in C,
However, this is determined at compile time, not runtime.

This was added by the 'Aldy Hernandez' patch in gcc-3.1.

Let's look at the description in the gcc document.

***
<table>
    <thead>
        <tr>
            <th>Built-in Function: type __builtin_choose_expr (const_exp, exp1, exp2)</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
				You can use the built-in function <b>__builtin_choose_expr</b> to evaluate code depending on the value of a constant expression. This built-in function returns exp1 if const_exp, which is an integer constant expression, is nonzero. Otherwise it returns exp2.<br><br>
				This built-in function is analogous to the ‘? :’ operator in C, except that the expression returned has its <b>type unaltered by promotion rules</b>. Also, the built-in function does not evaluate the expression that is not chosen. For example, if const_exp evaluates to true, exp2 is not evaluated even if it has side effects...<br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins"><code>https://gcc.gnu.org/onlinedocs/gcc-7.4.0/gcc/Other-Builtins.html#Other-Builtins</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

***

Looking at the gcc code will help you understand how this builtin function works.<br>
Let's look at gcc 7.4.

#### -> git checkout gcc-7_4_0-release
{% highlight c %}
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
{% endhighlight %}


If you look at the gcc implementation, you can see that it is implemented as a 3-way ooperator.

{% highlight c %}
expr = integer_zerop (c) ? *e3_p : *e2_p;
-> 
	const_exp ? exp1 : exp2
{% endhighlight %}

> Don't confuse gcc builtin as a function called at compile time

The first argument must be `const_exp`. In other words, even variables that can be determined at compile time cannot be used as the first argument.

#### -> can we use the variables for the first argument?
{% highlight c %}
#include <stdio.h>

int main(void) {
	const int cond = 1;
	char *boolean = __builtin_choose_expr(cond, "true", "false");

	printf("boolean: %s\n", boolean);

	return 0;
}
{% endhighlight %}
#### -> gcc version 7.4.0 –target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -o cond_expr cond_expr.c

cond_expr.c: In function ‘main’:
cond_expr.c:5:18: error: first argument to ‘__builtin_choose_expr’ not a constant
  char *boolean = __builtin_choose_expr(cond, "true", "false");
{% endhighlight %}

Notice that a compile error occurs. That is, only `const expr` can be used as follows.

#### -> use const expr for the first argument
{% highlight c %}
#define BOOL_TO_STR(__x) \
	__builtin_choose_expr(((__x)), "true", "false")

int main(void) {
	printf("%s\n", BOOL_TO_STR(0));
	printf("%s\n", BOOL_TO_STR(1));

	return 0;
}
{% endhighlight %}
#### -> gcc version 7.4.0 –target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -o bool_to_str bool_to_str.c
$ ./bool_to_str

false
true
{% endhighlight %}
#### -> assembly: x86_64 AT&T
{% highlight x86asm %}
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
{% endhighlight %}
{% highlight bash %}
$ strings -t x bool_to_str
...
    5d4 false
    5da true
{% endhighlight %}
You can see that `__builtin_choose_expr` has been changed at compile time to `exp1` or `exp2` each.

You might think that this is a rather unnecessary builtin function due to the constraint that only `const exp` is available in first arugments.

However, There are many ways to use it.

For example, you can write the following to determine the behavior of a particular bit of its value at compile time.

#### -> e.g. masked
{% highlight c %}
#define IS_MASKED(__value) \
	__builtin_choose_expr(((__value) & 0x1), 1, 0)

int main(void) {
	printf("masked: %d\n", IS_MASKED(0xff));
	printf("masked: %d\n", IS_MASKED(0x02));
	printf("masked: %d\n", IS_MASKED(0x03));
}
{% endhighlight %}
#### -> gcc version 7.4.0 –target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -o masked masked.c
$ ./masked

masked: 1
masked: 0
masked: 1
{% endhighlight %}
Another example may be used with sizeof.
In the eBPF code of the kernel, It used the following with sizeof:
#### -> e.g. sizeof in BPF
{% highlight c %}
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
{% endhighlight %}

***

This builtin function has a slightly different mechanism than the 3-way operator that we know well.

For the 3-way operator, the return type will be `type cast` to larger type, but the return type of this `builtin function` is the `type` of each `exp1` or `exp2`.
#### -> check return type
{% highlight c %}
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
{% endhighlight %}
#### -> gcc version 7.4.0 –target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -o return_type return_type.c

./return_type
sizeof: 1
sizeof: 4
{% endhighlight %}
we can make the sample code to more nice with `__builtin_types_compatible_p`, but I'll save it for the next post :)

The `__builtin_choose_expr` is come into its own when combined with other built-in functions that return const exp.
For example, In combination with `__builtin_types_compatible_p`, we can provide `function overloading` for `type-arguments` that were previously impossible in std C.
#### -> functon overloading 
{% highlight c %}
#include <stdio.h>

#define debug(var)																					\
	printf(																										\
		__builtin_choose_expr( 																	\
			__builtin_types_compatible_p(typeof(var), int) 				\
			,"%d\n", __builtin_choose_expr(												\
				__builtin_types_compatible_p(typeof(var), char []) 	\
				,"%s\n", "0x%x\n")), var);

int main(void) {
	debug(1234);
	debug("jooojub");

	return 0;
}
{% endhighlight %}
#### -> gcc version 7.4.0 –target=x86_64-linux-gnu
{% highlight bash %}
$ gcc -o function_overloading function_overloading.c 
$ ./function_overloading

1234
jooojub
{% endhighlight %}

A detailed description of `__builtin_types_compatible_p` will be given in the another post.
> Also possible to overlading the `number of arguments` in std C using macro. If there is a chance, I'll cover it in another post also.

This built-in function is simple to operate and understand, yet powerful. A good use will help remove unnecessary code and refactoring. So, please remember that there is `__builtin_choose_expr` function in gcc.

<div align="right">
jooojub.
</div>