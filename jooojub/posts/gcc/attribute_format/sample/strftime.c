#include <stdio.h>
#include <time.h>

__attribute__((format(strftime, 1, 0)))
void get_time(const char *fmt, struct tm * tptr) {
    char buf[64];

    strftime(buf, sizeof(buf), fmt, tptr);
    puts(buf);
}

int main(void) {
    time_t tmp;
    struct tm *tptr;

    tmp = time(NULL);
    tptr = localtime(&tmp);

    get_time("%A, %b %d.\nTime: %r..%i?", tptr);

    return 0;
}