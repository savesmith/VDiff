
# vDiff - A Diff for Versioned Methods
vDiff generates a diff of a file's versioned methods. To perserve legacy code, we may implement a change to _hello01()_ by copying it and adding the change in a new method _hello02()_. Now we won't introduce any bugs in legacy, but we won't be able to easily see the change in the source control's diff. However, vDiff will comb through a file and create a diff between the two methods. 


