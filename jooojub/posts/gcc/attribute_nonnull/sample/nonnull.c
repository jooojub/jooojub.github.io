#include <stdio.h>
#include <string.h>
#include <stdlib.h>

void __attribute__((nonnull)) my_test_function(char *dest, const char *src, int len) {
	strncpy(dest, src, len);
}

int main(void) {
//	char *a = NULL;

	my_test_function(NULL, NULL, 5);

	return 0;
}
