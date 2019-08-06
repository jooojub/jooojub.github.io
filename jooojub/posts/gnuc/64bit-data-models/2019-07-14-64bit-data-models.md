---
layout: post
title:  "64bit data models"
date:   2019-07-14
share:	true
tags: [GNUC]
keywords: [gunc, c, 64bit, data-model]
descriptions: ""
---

Environmets:
 * code base: glibc 2.23.90

All

32bit 환경에서는 int와 pointer의 사이즈는 4byte로 같다. 하지만 모두 알고 있듯 64비트 환경에서는 pointer사이즈는 8byte가 된다. 그렇다면 long의 사이즈는 어떻게 될까요? 답은 역시 아키텍쳐마다 다릅니다.

데이터 모델이란 표준 데이터 타입에 할당되는 크기를 정의하고 있습니다.

LLP64	Windows
LP64	Most UNIX
ILP64  	SPARC64
SILP64 clasic UNICOS

참조: https://en.wikipedia.org/wiki/64-bit_computing
	https://queue.acm.org/detail.cfm?id=1165766
