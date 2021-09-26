---
layout: post
title:  "gcc builtin: choose_expr"
date:   2019-09-15
share:	true
tags: [gcc_builtin]
keywords: [gcc-builtin, gcc, builtin, __builtin_choose_expr]
description: "test"
---

Requires:
 * compiler: gcc 3.1 later

이번은 gcc builtin 중 `__builtin_choose_expr`에 대해서 살펴봅시다.<br>
이 built-in function은 C++에는 없고 C에만 존재합니다.<br>

마치 C의 3-way operator(? : operator)처럼 동작합니다.<br>
그러나 run-time이 아니라 compile-time에 동작한다는 것을 명심해야 합니다.

이 built-in은 gcc-3.1에 'Aldy Hernandez' patch를 통해 추가되었습니다.

gcc 문서의 설명을 확인해보겠습니다.

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

gcc code를 살펴보면 이 builtin function이 어떻게 동작하는지에 대해 쉽게 이해하실 수 있을 겁니다.<br>
gcc 7.4의 코드를 살펴보겠습니다.

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

코드들 자세히 보시면 3-way ooperator로 구현이 되었다는 것을 보실 수 있습니다.

{% highlight c %}
expr = integer_zerop (c) ? *e3_p : *e2_p;
-> 
	const_exp ? exp1 : exp2
{% endhighlight %}

> Don't confuse gcc builtin as a function called at compile time

첫 번째 argument는 `const_exp` 이어야 합니다.<br>
다시 말해, variable이 compile time에 정해진다고 해도 argument로 사용할 수 없다는 뜻입니다.<br>

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

compile error가 발생하는걸 볼 수 있습니다.<br>
즉, 다음과 같이 `const expr`만 사용할 수 있습니다.

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
`__builtin_choose_expr`가 compile-time에 각각 `exp1` 또는 `exp2`로 변환 된 것을 볼 수 있습니다.

`const exp`만 사용할 수 있기 때문에, 불필요한 builtin function 아닌가 생각할 수도 있습니다.

그러나, 의외로 많은 활용을 할 수 있습니다.

예를 들어, 특정 bit가 설정되어 있는지 compile time에 확인하는 IS_MASKED macro를 다음과 같이 작성할 수 있습니다.

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
sizeof와 같이 활용할 수도 있습니다.<br>
Kernel에서 eBPF code를 살펴보면, 아래와 같이 sizeof와 같이 활용한 예가 있습니다.
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

이 builtin function 3-way operator와는 약간 다른 차이점이 있습니다.

3-way operator는 더욱 사이즈가 큰 type으로 `type cast` 되어 return 되지만, `builtin function`은 `exp1` 또는 `exp2` 각자의 `type`이 return 됩니다.

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
`__builtin_types_compatible_p`와 같이 사용하면 더욱 멋진 활용이 가능합니다만, 다음 post를 위해 아껴두겠습니다. :)<br>

`__builtin_choose_expr`은 const expr를 return 하는 다른 build-in function과 조합해서 많이 사용합니다.<br>
예를 들어 `__builtin_types_compatible_p`와 조합하면 C에서 불가능해만 보였던 `type-arguments`을 위한 `function overloading` 구현도 가능합니다.

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

`__builtin_types_compatible_p`에 대해서는 다른 post에서 다루겠습니다.
> 또한 standard C에서도 macro를 이용해 `number of arguments`를 구현할 수 있습니다. 기회가 된다면 이 또한 다른 post에서 다루겠습니다.

`__builtin_choose_expr`는 쉽게 단순해서 이해하기 쉽지만, 유용하게 사용한다면 불필요한 코드를 줄일 수 있으므로, 많이 활용하길 바랍니다.

<div align="right">
jooojub.
</div>