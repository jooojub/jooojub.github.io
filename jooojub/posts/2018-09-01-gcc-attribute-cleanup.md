---
layout: post
title:  "attribute cleanup"
date:   2018-09-01
tags: [gcc]
---

In systemd code, we can find may <mark>attribute</mark> keywords. Among them, I decided to take a closer look at <mark>cleanup</mark>, which may be useful for security coding.

It says so on the gnu gcc documents.

<table>
    <thead>
        <tr>
            <th>cleanup</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td>
                <mark>The cleanup attribute runs a function when the variable goes out of scope</mark>. This attribute can only be applied to auto function scope variables; it may not be applied to parameters or variables with static storage duration. The function must take one parameter, a pointer to a type compatible with the variable. The return value of the function (if any) is ignored.
                <br><br>
                If -fexceptions is enabled, then cleanup_function is run during the stack unwinding that happens during the processing of the exception. Note that the cleanup attribute does not allow the exception to be caught, only to perform an action. It is undefined what happens if cleanup_function does not return normally.
                <br><br>
                <cite>ref. <a href="https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html"><code>https://gcc.gnu.org/onlinedocs/gcc/Common-Variable-Attributes.html</code></a></cite>
            </td>
        </tr>
    </tbody>
</table>

The following phrases are noticeable:
> The cleanup attribute runs a function when the variable goes out of scope

It means, if used well, we will be able to prevent situations where a leak occur due to failure to maintain the pair like {malloc/free, open/close, ...}

# HoHoHo
{% highlight c linenos %}
#include <stdio.h>

/* comment */
int main(void) {
  int val = 1;

























  printf("Test: %d\n", val);
  return 0;
}
{% endhighlight %}

{% highlight c %}
int val = 1;
{% endhighlight %}