/* 
#include <stddef.h>
//#include <stdio.h>

int main(void) {
	char *value = NULL;

	return 0;
}
*/
/* 
#include <stdio.h>

int main(void) {
		printf("sizeof(0): %lu, sizeof(NULL): %lu\n",
			   sizeof(0), sizeof(NULL));

		return 0;
}
*/
#if 1
#include <stdio.h>
#include <stdarg.h>

int expect(const char *fmt, ...) {
	va_list ap;
	char *val;

	va_start(ap, fmt);

	while (val = va_arg(ap, char *))
		printf("value: %s\n", val);

	va_end(ap);

	return 0;
}

int main(void) {
	expect("aaa", "bbb", "ccc", "ddd", "fff", "ggg", "hhh", "iii", 0);
	//expect("aaa", "bbb", "ccc", "ddd", "fff", "ggg", "hhh", "iii", NULL);

	return 0;
}
#endif
#if 0
#include <stdarg.h>
#include <stdio.h>

void f(int arg, ...) {
  va_list args;
  va_start(args, arg);
  int *p;
  int i;
 
  for (i = 0; i < arg; ++i) {
    p = va_arg(args, int*);
  }
}

int main(void) {
  f(7, 0, 0, 0, 0, 0, 0, 0);
  return 0;
}
#endif
