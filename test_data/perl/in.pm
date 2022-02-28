####
# Before
####
sub helloWorld20210104 {
    print("hello world")
}

###
# After
###
sub helloWorld20211111 {
    print("Hello, World!")
}

#####
# Before API Call 
#####
sub apiCall20200511: ExposeAPIMethod(+{}) {
    print("before api call")
}

#####
# After API Call 
#####
sub apiCall20220203: ExposeAPIMethod(+{}) {
    print("after api call")
}