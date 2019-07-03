#include <stdio.h>

int main(void) {
	//char a = (1 << 8) - 1;
	/* in stack overflow  */
	printf("%d\n", '\x80');
	//printf("%d\n", a);

	return 0;
}
