#########################################################################################
# test before 
#########################################################################################
subtest test_object => sub {  # 01/12/2020
	plan tests => 1;

	cmp_ok("before", "==", "before", "pass");
};