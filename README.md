# vDiff - A Diff for Versioned Methods
vDiff generates a diff of a file's versioned methods. To perserve legacy code, we may implement a change to _hello01()_ by copying it and adding the change in a new method _hello02()_. Now we won't introduce any bugs in legacy, but we won't be able to easily see the change in the source control's diff. However, vDiff will comb through a file and create a diff between the two methods. 

![vDiff_Example-1644822622867](https://user-images.githubusercontent.com/21265432/153816493-b20566b0-d1f7-4bac-8561-c6148418900e.gif)

## Download
This extension is currently in development and not published to vscode marketplace. If you'd like to use and early and give any feedback please download the latest version vdiff.vsix version.

## How to use
- Right click on your active editor and select _Version Diff_
- Right click on a file in the explorer and select _Version Diff_

## Settings

### Method Patterns
Method patterns are the regex or string templates for parsing versioned methods

Here is the configuration for the example gif
```
"vdiff.methodPatterns": [
  {
    "filetype": ".pm", // The file extension that this pattern applies to
    "signature": "sub ([A-Za-z_]*)(\\d*)\\s",// Regex expression that matches a method signature, with a capture group for the name and version
    "version": "(\\d{4})(\\d{2})(\\d{2})", // Regex expression for grabbing the version, with capture groups that are supplied to "versionExtraction" to add a comment
    "versionExtraction: "  # $2/$3/$1", // The template "version" uses to create a version comment
    "description": "(^(?:#.*\\n)+)" // Regex expression for grabbing the comments before a method. 
  }
]
```

You can add more method patterns to support other file types. Currently only one pattern for a file is supported, but it is a feature expected to be added.
