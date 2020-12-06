#include <stdio.h>
#include <stdarg.h>

//int report(const char *fmt, ...) __attribute__((format(printf, 1, 2)));
//-Wmissing-format-attribute
//__attribute__((format(printf, 1, 2)))
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
