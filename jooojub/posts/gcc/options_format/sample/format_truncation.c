#include <stdio.h>

int main(void) {
    char buf[10];
    snprintf(buf, sizeof(buf), "%s", "string truncation");

    return 0;
}