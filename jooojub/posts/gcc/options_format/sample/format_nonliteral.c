#include <stdio.h>

char* get_format(int value) {
    if (value == 1)
        return "%d";
    else
        return "%s";
}

int main(void) {
    printf(get_format(1),"test");

    return 0;
}