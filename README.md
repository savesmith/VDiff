# VDiff - A Diff Tool for Versioned Methods
VDiff generates a diff of a file's versioned methods. To perserve legacy code, we may implement a change to _hello01()_ by copying it and adding the change in a new method _hello02()_. This way we don't introduce any bugs in legacy, but we lose source control's diff to easily show us the changes. VDiff will comb through a file and create a diff between the two methods. 

![With VDiff](https://user-images.githubusercontent.com/21265432/153798175-71123d70-6c4b-4fc2-a2ee-2a610c6d6506.gif)

