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
	printf("sizeof: %lu\n", sizeof(RET_TYPE(0)));
	printf("sizeof: %lu\n", sizeof(RET_TYPE(1)));

	return 0;
}
