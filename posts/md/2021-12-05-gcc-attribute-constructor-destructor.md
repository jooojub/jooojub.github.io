---
layout: post
title:  "gcc attribute: constructor and destructor"
date:   2021-12-05
share:	true
tags: [gcc_attribute]
keywords: [gcc-attribute, gcc, attribute, constructor, destructor]
description: "gcc provides a constructor that can be executed before the main function and descturtor that can be executed after the main function. If you use it well, you can make a hooking library and use it for debugging, etc."
---

#### Requires
: compiler : gcc 2.7.2 later
***

C++ has a `constructor` that is called when a class instance is created and a `destructor` that is called when the life-cycle ends.

Unfortunately in c there is no such concept of `constructor` and `destructor` for variables. (However, functions can be hooked using `weak` and `LD_PRELOAD`)

Instead, gcc supports `attributes` that you can specify an executable <mark>constructor</mark> before main and <mark>destructor</mark> after main.

> #### gcc-4.7.0/Function-Attributes<br>
> <b>constructor</b>
> <b>destructor</b>
> <b>constructor (priority)</b>
> <b>destructor (priority)</b><br>
> The <b>constructor</b> attribute causes the function to be called automatically before execution enters main ().
> Similarly, the <b>destructor</b> attribute causes the function to be called automatically after main () has completed or exit () has been called.<br>
> Functions with these attributes are useful for initializing data that will be used implicitly during the execution of the program.<br>
> You may provide an optional integer priority to control the order in which <mark>constructor</mark> and <mark>destructor</mark> functions are run.<br>
> A constructor with a smaller priority number runs before a `constructor` with a larger priority number; the opposite relationship holds for `destructors`.<br>
> So, if you have a `constructor` that allocates a resource and a `destructor` that deallocates the same resource, both functions typically have the same priority.<br>
> The priorities for `constructor` and `destructor` functions are the same as those specified for namespace-scope C++ objects<br>
> **ref:&nbsp;**<a target="_blank" href="https://gcc.gnu.org/onlinedocs/gcc-4.7.0/gcc/Function-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc-4.7.0/gcc/Function-Attributes.html</code></a></cite>

It's simple to use.

```c
: sampe source code - usage.c
#include <stdio.h>

__attribute__((constructor))
void ctor_func() {
	printf("-> before main\n");	
}

__attribute__((destructor))
void dtors_func() {
	printf("<- after main\n");	
}

int main(void) {
	printf("main\n");

	return 0;
}
```
```bash
: compile
$ gcc -o usage usage.c
$ ./usage
```
```bash
: output
-> before main
main
<- after main
```
You can see that `ctor_func` defined with <mark>__attribute__((constructor))</mark> is called first, and `dtors_func` defined with <mark>__attribute__((destructor))</mark> is called after main.

We need to look at how `constructor` and `destructor` are called.

First, let's see how gcc manages and calls it.

Prior to gcc 4.7, `constructors` was managed using <b>.ctors</b> section of ELF and `destructors` was managed using <b>.dtors</b> section.

On the other hand, after gcc 4.7, <b>TARGET_ASM_CONSTRUCTOR</b> is defined as <b>default_elf_init_array_asm_out_constructor</b> and it calls <b>get_elf_initfini_array_priority_section</b> and stores the functions in `.init_array` secion and `.fini_array` of ELF.

Let's look at the calling process. Let's check it based on `.init_array`.
Looking at the start address of the previously generated sample code.

```bash
: check start address
$ objdump -f usage
```
```bash
: output
usage:     file format elf64-x86-64
architecture: i386:x86-64, flags 0x00000150:
HAS_SYMS, DYNAMIC, D_PAGED
start address 0x0000000000001060
```

We can check the start address.
This value is the e_entry value of the <b>ELF header</b>.

If you look at the function at the start address value with objdump, you can see that it is the <b>_start</b> function.

```x86asm
: The starting position of ELF is
$ objdump -d usage | grep -A15 0000000000001060
0000000000001060 <_start>:
    1060:	f3 0f 1e fa          	endbr64 
    1064:	31 ed                	xor    %ebp,%ebp
    1066:	49 89 d1             	mov    %rdx,%r9
    1069:	5e                   	pop    %rsi
    106a:	48 89 e2             	mov    %rsp,%rdx
    106d:	48 83 e4 f0          	and    $0xfffffffffffffff0,%rsp
    1071:	50                   	push   %rax
    1072:	54                   	push   %rsp
    1073:	4c 8d 05 96 01 00 00 	lea    0x196(%rip),%r8        # 1210 <__libc_csu_fini>
    107a:	48 8d 0d 1f 01 00 00 	lea    0x11f(%rip),%rcx        # 11a0 <__libc_csu_init>
    1081:	48 8d 3d ef 00 00 00 	lea    0xef(%rip),%rdi        # 1177 <main>
    1088:	ff 15 52 2f 00 00    	callq  *0x2f52(%rip)        # 3fe0 <__libc_start_main@GLIBC_2.2.5>
    108e:	f4                   	hlt    
    108f:	90                   	nop
```

Looking at the `_start` function, Store the function addresses of  `__libc_csu_init`, `__libc_csu_fini` and `main` and call <mark>_libc_start_main</mark>

<mark>__libc_start_main</mark> is a csu (C start up) or crt (C runtime) routine processed by `glibc` before calling ELF's main.

For reference, you can see the link process by using the -v option when building gcc.
```bash
: Check link process
$ gcc -v constructor.c

 /usr/lib/gcc/x86_64-linux-gnu/9/collect2 
 -plugin /usr/lib/gcc/x86_64-linux-gnu/9/liblto_plugin.so
 -plugin-opt=/usr/lib/gcc/x86_64-linux-gnu/9/lto-wrapper 
 -plugin-opt=-fresolution=/tmp/ccSPNgPY.res 
 -plugin-opt=-pass-through=-lgcc -plugin-opt=-pass-through=-lgcc_s 
 -plugin-opt=-pass-through=-lc -plugin-opt=-pass-through=-lgcc 
 -plugin-opt=-pass-through=-lgcc_s --build-id --eh-frame-hdr -m 
 elf_x86_64 --hash-style=gnu --as-needed -dynamic-linker 
 /lib64/ld-linux-x86-64.so.2 
 -pie -z now -z relro
 /usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/Scrt1.o
 /usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crti.o
 /usr/lib/gcc/x86_64-linux-gnu/9/crtbeginS.o
 -L/usr/lib/gcc/x86_64-linux-gnu/9
 -L/usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu
 -L/usr/lib/gcc/x86_64-linux-gnu/9/../../../../lib
 -L/lib/x86_64-linux-gnu
 -L/lib/../lib
 -L/usr/lib/x86_64-linux-gnu
 -L/usr/lib/../lib
 -L/usr/lib/gcc/x86_64-linux-gnu/9/../../..
 /tmp/cclu3MJY.o -lgcc --push-state --as-needed -lgcc_s
 --pop-state -lc -lgcc --push-state --as-needed -lgcc_s
 --pop-state /usr/lib/gcc/x86_64-linux-gnu/9/crtendS.o
 /usr/lib/gcc/x86_64-linux-gnu/9/../../../x86_64-linux-gnu/crtn.o
```
<mark>crt*.o</mark> in sysroot are used in startup routine.

<mark>call_init()</mark> and <mark>call_fini()</mark> are called in `LIBC_START_MAIN` in glibc.
<b>call_init()</b> calls <mark>__init_array_start</mark> and <b>call_fini()</b> calls <mark>__fini_array_start</mark>.

```c
: check libc-start.c in glibc
static void
call_init (int argc, char **argv, char **envp) {
...
  const size_t size = __init_array_end - __init_array_start;
  for (size_t i = 0; i < size; i++)
      (*__init_array_start [i]) (argc, argv, envp);
...
}
...

static void
call_fini (void *unused)
{
  size_t i = __fini_array_end - __fini_array_start;
  while (i-- > 0)
    (*__fini_array_start [i]) ();
...
}
```
Now we need to look at which functions are registered in <mark>init_array</mark> and <mark>fini_array</mark>.

Looking at the ELF dynamic section of the sample program, there are `INIT_ARRAY/FINI_ARRAY` and `INIT_ARRAYSZ/FINI_ARRAYSZ`.

```bash
: Check ELF dynamic section
$ readelf -d ./usage
...
 0x0000000000000019 (INIT_ARRAY)         0x3da8
 0x000000000000001b (INIT_ARRAYSZ)       16 (bytes)
 0x000000000000001a (FINI_ARRAY)         0x3db8
 0x000000000000001c (FINI_ARRAYSZ)       16 (bytes)
...
```
Let's print <mark>INIT_ARRAY</mark> as much as <mark>INIT_ARRAYSZ</mark> using gdb.

```bash
: what's in INIT_ARRAY
(gdb) x/2g 0x3da8
0x3da8:	0x0000000000001140	0x0000000000001149

(gdb) disassemble 0x0000000000001140
Dump of assembler code for function frame_dummy:
   0x0000000000001140 <+0>:	endbr64 
   0x0000000000001144 <+4>:	jmpq   0x10c0 <register_tm_clones>
End of assembler dump.

(gdb) disassemble 0x0000000000001149
Dump of assembler code for function ctor_func:
   0x0000000000001149 <+0>:	endbr64 
   0x000000000000114d <+4>:	push   %rbp
   0x000000000000114e <+5>:	mov    %rsp,%rbp
   0x0000000000001151 <+8>:	lea    0xeac(%rip),%rdi        # 0x2004
   0x0000000000001158 <+15>:	callq  0x1050 <puts@plt>
   0x000000000000115d <+20>:	nop
   0x000000000000115e <+21>:	pop    %rbp
   0x000000000000115f <+22>:	retq   
End of assembler dump.
```

`ctor_func` function address is in <mark>INIT_ARRAY</mark>.

The same goes for <mark>FINI_ARRAY</mark>.

```bash
: what's in FINI_ARRAY
(gdb) x/2g 0x3db8
0x3db8:	0x0000000000001100	0x0000000000001160
(gdb) disassemble 0x0000000000001100
Dump of assembler code for function __do_global_dtors_aux:
   0x0000000000001100 <+0>:	endbr64 
   0x0000000000001104 <+4>:	cmpb   $0x0,0x2f05(%rip)        # 0x4010 <completed.8059>
   0x000000000000110b <+11>:	jne    0x1138 <__do_global_dtors_aux+56>
   0x000000000000110d <+13>:	push   %rbp
   0x000000000000110e <+14>:	cmpq   $0x0,0x2ee2(%rip)        # 0x3ff8
   0x0000000000001116 <+22>:	mov    %rsp,%rbp
   0x0000000000001119 <+25>:	je     0x1127 <__do_global_dtors_aux+39>
   0x000000000000111b <+27>:	mov    0x2ee6(%rip),%rdi        # 0x4008
   0x0000000000001122 <+34>:	callq  0x1040 <__cxa_finalize@plt>
   0x0000000000001127 <+39>:	callq  0x1090 <deregister_tm_clones>
   0x000000000000112c <+44>:	movb   $0x1,0x2edd(%rip)        # 0x4010 <completed.8059>
   0x0000000000001133 <+51>:	pop    %rbp
   0x0000000000001134 <+52>:	retq   
   0x0000000000001135 <+53>:	nopl   (%rax)
   0x0000000000001138 <+56>:	retq   
   0x0000000000001139 <+57>:	nopl   0x0(%rax)
End of assembler dump.
(gdb) disassemble 0x0000000000001160

Dump of assembler code for function dtors_func:
   0x0000000000001160 <+0>:	endbr64 
   0x0000000000001164 <+4>:	push   %rbp
   0x0000000000001165 <+5>:	mov    %rsp,%rbp
   0x0000000000001168 <+8>:	lea    0xea4(%rip),%rdi        # 0x2013
   0x000000000000116f <+15>:	callq  0x1050 <puts@plt>
   0x0000000000001174 <+20>:	nop
   0x0000000000001175 <+21>:	pop    %rbp
   0x0000000000001176 <+22>:	retq   
End of assembler dump.
```
Managing as an array means that <b>multiple functions</b> can be registered.
It also means you can set `priorities`.

```c
: Also support priority
#include <stdio.h>

__attribute__((constructor(101)))
void constructor_101() {
	printf("-> constructor priority 101\n");	
}

__attribute__((constructor(102)))
void constructor_102() {
	printf("-> constructor priority 102\n");	
}

__attribute__((destructor(101)))
void destructor_101() {
	printf("<- descriptor priority 101\n");	
}

__attribute__((destructor(102)))
void destructor_102() {
	printf("<- descriptor priority 102\n");	
}

int main(void) {
	printf("main\n");
	return 0;
}
```
```bash
: result
gcc -o ctor_pri ctor_pri.c
./ctor_pri

-> constructor priority 101
-> constructor priority 102
main
<- descriptor priority 102
<- descriptor priority 101
```

In the case of constructors, the smaller the value, the faster it is called.
on the contrary, In the case of the destructor the higher the value, the faster it is called. (Available from 101)

So what if the priorities are the same?
```c
: how are the same priorities handled?
#include <stdio.h>

__attribute__((constructor(101)))
void ctor_func_1() {
	printf("-> constructor priority 101\n");	
}

__attribute__((constructor(101)))
void ctor_func_2() {
	printf("-> me too constructor priority 101\n");	
}

__attribute__((destructor(101)))
void dtors_func_1() {
	printf("<- descriptor priority 101\n");	
}

__attribute__((destructor(101)))
void dtors_func_2() {
	printf("<- me too descriptor priority 101\n");	
}

int main(void) {
	printf("main\n");
	return 0;
}
```
```bash
: result
gcc -o ctor_pri_same ctor_pri_same.c
./ctor_pri_same

-> constructor priority 101
-> me too constructor priority 101
main
<- me too descriptor priority 101
<- descriptor priority 101
```

If the priority is the same, it appears to be a structure that enters the array in the order parsed by the compiler and executes them sequentially.
The destructor will be called in reverse, right?

Even in scenarios where it is terminated by a combination of signal handler and exit rather than normal termination
Let's make sure the destructor is called.

```c
: does it work in signal handler too?
#include <stdio.h>
#include <signal.h>
#include <stdlib.h>
#include <unistd.h>

void sig_handler(int signo) {
	if (signo == SIGINT) {
		printf("received SIGINT\n");

		exit(0);
	}
}

__attribute__((constructor))
void ctor_func() {
	printf("-> before main\n");	
}

__attribute__((destructor))
void dtors_func() {
	printf("<- after main\n");	
}

int main(void) {
	signal(SIGINT, sig_handler);

	printf("main\n");

	while (1) {}

	return 0;
}
```

This attribute comes into its own when used with the dynamic library.

We can add something before main without rebuilding the already compiled process.

```c
: add constructor / descriptor in shared library for preload
#include <stdio.h>

__attribute__((constructor))
void ctor() {
	printf("hook lib constructor!\n");
}

__attribute__((destructor))
void dtors() {
	printf("hook lib destructor!\n");
}
```
```bash
gcc -shared -o hooklib.so hooklib.c

LD_PRELOAD=`pwd`/hooklib.so ./pre-compiled

hook lib constructor!
main
hook lib destructor!
```
Of course, it can also be used in the dynamic library you are using.

```c
: add constructor / descriptor in shared library: hooklib.c
#include <stdio.h>

void foo(void) {
	printf("I'm foo!\n");
}

__attribute__((constructor))
void ctor() {
	printf("hook lib constructor!\n");
}

__attribute__((destructor))
void dtors() {
	printf("hook lib destructor!\n");
}
```
```c
: add constructor / descriptor in shared library: sample.c 
#include <stdio.h>

int main(void) {
	printf("I'm main\n");

	foo();
	return 0;
}
```
```bash
gcc -shared -o hooklib.so hooklib.c
gcc -o sample sample.c ./hooklib.so

gcc -o sample sample.c ./hooklib.so

./sample
hook lib constructor!
I'm main
I'm foo!
hook lib destructor!
```
There are many utilize ways to use it

You can create a hooking library for debugging already built binaries.
and also can prevent leaks by alloc/free of global variables.