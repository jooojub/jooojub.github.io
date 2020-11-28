#include <stdio.h>

int main(void) {
    char buf[16];
    sprintf(buf, "%s\0", "test");

    return 0;
}