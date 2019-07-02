#if 0
void auto_function(int *arg) {
	printf("%s: called by __clean_up__: %d\n", __func__, *arg);

	return;
}

int main(int argc, char **argv) {
	__attribute__ ((__cleanup__(auto_function))) int val = 5;

	return 0;
}
#endif

#if 0
void fclosep(FILE **f) {
	fclose(f);
}

int main(int argc, char **argv) {
	__attribute__ ((__cleanup__(fclosep))) FILE *f = fopen(name, "r");

	return 0;
}
#endif

#if 0
void freep(void *p) {
	free(*(void **) p);
}

int main(int argc, char **argv) {
	__attribute__ ((__cleanup__(freep))) void *p = malloc(10);

	return 0;
}
#endif

#if 0
#include <stdio.h>
#include <stdlib.h>

void freep(void *p) {
	free(*(void **) p);
	printf("value freed\n");
}

int main(int argc, char **argv) {
	{
		__attribute__ ((__cleanup__(freep))) void *p = malloc(10);
	}

	printf("before return\n");

	return 0;
}
#endif

#include <stdio.h>
#include <stdlib.h>
//#include <string.h>

void freep(void *p) {
	free(*(void **) p);
}

void *new_buffer(int size) {
	__attribute__ ((__cleanup__(freep))) int *p = malloc(size);

	return p;
}

int main(int argc, char **argv) {
	char *value = NULL;

	value = (char *)new_buffer(5);
	strncpy(value, "test", 10);

	printf("value: %s\n", value);

	return 0;
}
