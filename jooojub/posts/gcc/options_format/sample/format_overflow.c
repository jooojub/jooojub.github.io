#include <stdio.h>

// int main(void) {
//     char buf[10];
//     sprintf(buf, "overflow %s", "ho!");

//     return 0;
// }

int main(int argc, const char *argv[]) {
    char buf[10];
    sprintf(buf, "overflow %s", argv[0]);

    return 0;
}