#include <stdio.h>

// __attribute__((format_arg(3)))
char *debug_format(char *buf, size_t len, char *fmt) {
    snprintf(buf, len, "[debug] %s", fmt);

    return buf;
}

int main(void) {
    char buf[32];

    printf(debug_format(buf, sizeof(buf), "%s\n"), "arg1", "excess");

    return 0;
}