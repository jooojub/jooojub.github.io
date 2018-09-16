#include <stdio.h>
#define cleanup \
	__attribute__ ((__cleanup__(clean_up)))

void clean_up(int *arg) {
	printf("%s: called by __clean_up__: %d\n", __func__, *arg);

	return;
}

int main(int argc, char **argv) {
	cleanup int val = 5;

	return 0;
}