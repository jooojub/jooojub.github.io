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