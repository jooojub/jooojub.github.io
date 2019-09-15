#include <stdio.h>

#define debug(var)													\
	printf(															\
		__builtin_choose_expr( 										\
			__builtin_types_compatible_p(typeof(var), int) 			\
			,"%d\n", __builtin_choose_expr(							\
				__builtin_types_compatible_p(typeof(var), char []) 	\
				,"%s\n", "0x%x\n")), var);

int main(void) {
	debug(1234);
	debug("jooojub");

	return 0;
}
