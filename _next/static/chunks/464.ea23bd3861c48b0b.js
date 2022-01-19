"use strict";(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[464],{1464:function(n){n.exports=JSON.parse('{"content":"\\n\\n#### Requires\\n: compiler : gcc 3.3.1 later\\n***\\n\\nIn systemd project code, you will see a lot of <mark>attribute</mark> keywords.\\nAmong them, let\'s look at the <mark>cleanup</mark> keyword, which can be very helpful for <cd>security coding</cd>.\\n\\nThe <mark>cleanup</mark> keyword is described as follows in the gcc documentation.\\n\\n> #### cleanup\\n> <b>The cleanup attribute runs a function when the variable goes out of scope</b>.<br>\\n> This attribute can only be applied to auto function scope variables; it may not be applied to parameters or variables with static storage duration.<br>\\n> The function must take one parameter, a pointer to a type compatible with the variable.\\n> The return value of the function (if any) is ignored.<br>\\n> If -fexceptions is enabled, then cleanup_function is run during the stack unwinding that happens during the processing of the exception.\\n> Note that the cleanup attribute does not allow the exception to be caught, only to perform an action.\\n> It is undefined what happens if cleanup_function does not return normally.<br>\\n> **ref:&nbsp;**<a target=\\"_blank\\" href=\\"https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html\\"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html</code></a></cite>\\n\\nI think the following explanation is an important point.\\n> The cleanup attribute runs a function when the variable goes out of scope\\n\\nIn other words, if used well, the code that needs to match the pair ( <mark>malloc/free</mark> or <mark>open/close</mark>... ) is easy to manage, and it seems to prevent leaks.\\n\\n```c\\n: sample source code - usage\\n#include <stdio.h>\\n\\nvoid auto_function(int *arg) {\\n\\tprintf(\\"%s: called by __clean_up__: %d\\\\n\\", __func__, *arg);\\n\\n\\treturn;\\n}\\n\\nint main(int argc, char **argv) {\\n\\t__attribute__ ((__cleanup__(auto_function))) int val = 5;\\n\\n\\treturn 0;\\n}\\n```\\n```bash\\n: result\\nauto_function: called by __clean_up__: 5\\n```\\n\\nIf you look at the assembly code, You can see that the code that calls <cd>auto_function()</cd> has been added automatically by gcc.\\n\\n```x86asm\\n: assembly - x86_64 AT&T (usage)\\n00000000004005c1 <main>:\\n  ...\\n  4005ec:\\t48 8d 45 e4             lea    -0x1c(%rbp),%rax\\n  4005f0:\\t48 89 c7                mov    %rax,%rdi\\n  4005f3:\\te8 9e ff ff ff          callq  400596 <auto_function>\\n  ...\\n```\\nIf you put <mark>free()</mark> or <mark>close()</mark> here, secure coding is possible without worrying about leaks like this,\\n\\n```c\\n: sample source code - fclose\\n...\\nvoid fclosep(FILE **f) {\\n\\tfclose(f);\\n}\\n\\nint main(int argc, char **argv) {\\n\\t__attribute__ ((__cleanup__(fclosep))) FILE *f = fopen(name, \\"r\\");\\n    ...\\n    /* We don\'t need to call fclose(f) manually */\\n\\n\\treturn 0;\\n}\\n```\\nThe timing of the function being called by the <mark>__cleanup__</mark> attribute is important.\\n\\nThe documentation describes it as:\\n> The cleanup attribute runs a function when the variable goes out of scope\\n\\nLet\'s check if the above explanation is correct\\n\\n```c\\n: sample source code - scope\\n#include <stdio.h>\\n#include <stdlib.h>\\n\\nvoid freep(void *p) {\\n\\tfree(*(void **) p);\\n\\tprintf(\\"value freed\\\\n\\");\\n}\\n\\nint main(int argc, char **argv) {\\n\\t{\\n\\t\\t__attribute__ ((__cleanup__(freep))) void *p = malloc(10);\\n\\t}\\n\\n\\tprintf(\\"before return\\\\n\\");\\n\\n\\treturn 0;\\n}\\n```\\n```bash\\n: result\\nvalue freed\\nbefore return\\n```\\n```x86asm\\n: assembly - x86_64 AT&T (scope)\\n  ...\\n  40066a:\\t31 c0                \\txor    %eax,%eax\\n\\t{\\n\\t\\t__attribute__ ((__cleanup__(freep))) void *p = malloc(10);\\n  40066c:\\tbf 0a 00 00 00       \\tmov    $0xa,%edi\\n  400671:\\te8 9a fe ff ff       \\tcallq  400510 <malloc@plt>\\n  400676:\\t48 89 45 f0          \\tmov    %rax,-0x10(%rbp)\\n  40067a:\\t48 8d 45 f0          \\tlea    -0x10(%rbp),%rax\\n  40067e:\\t48 89 c7             \\tmov    %rax,%rdi\\n     # The function is called by the life cycle of the variable\\n  400681:\\te8 a0 ff ff ff       \\tcallq  400626 <freep>\\n\\t}\\n\\n\\tprintf(\\"before return\\\\n\\");\\n  400686:\\tbf 40 07 40 00       \\tmov    $0x400740,%edi\\n  40068b:\\te8 50 fe ff ff       \\tcallq  4004e0 <puts@plt>\\n\\n\\treturn 0;\\n  400690:\\tb8 00 00 00 00       \\tmov    $0x0,%eax\\n}\\n```\\nBe mindful of the timing.\\nMistakes such as the following may also occur\\n\\n```c\\n: sample source code - be careful with scope\\n#include <stdio.h>\\n#include <stdlib.h>\\n#include <string.h>\\n\\nvoid freep(void *p) {\\n\\tfree(*(void **) p);\\n}\\n\\nvoid *new_buffer(int size) {\\n\\t__attribute__ ((__cleanup__(freep))) int *p = malloc(size);\\n\\n\\treturn p;\\n}\\n\\nint main(int argc, char **argv) {\\n\\tchar *value = NULL;\\n\\n\\tvalue = (char *)new_buffer(5);\\n\\tstrncpy(value, \\"test\\", 5);\\n\\n\\tprintf(\\"value: %s\\\\n\\", value);\\n\\n\\treturn 0;\\n}\\n```\\n\\n```bash\\n: result\\nSegmentation fault (core dumped)\\n```"}')}}]);