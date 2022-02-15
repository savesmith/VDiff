# vDiff - A Diff for Versioned Methods
vDiff generates a diff of a file's versioned methods. To perserve legacy code, we may implement a change to _hello01()_ by copying it and adding the change in a new method _hello02()_. Now we won't introduce any bugs in legacy, but we won't be able to easily see the change in the source control's diff. However, vDiff will comb through a file and create a diff between the two methods. 

![vDiff_Example-1644822622867](https://user-images.githubusercontent.com/21265432/153816493-b20566b0-d1f7-4bac-8561-c6148418900e.gif)

## How to use
- Configure your file's versioning by defining its methodPattern in settings. The first perl example shown is configured by default. 
- Right click on your active editor or a file in the explorer and select _Version Diff_

### Comparing between files
```
"vdiff.methodPatterns": [
  {
    ...,           
    "compareWith": [
        "__greetings__.pm"
    ],
  }
]
```

![vDiff_Example-1644963679611](https://user-images.githubusercontent.com/21265432/154159635-0cb2dde7-c0aa-4820-bf88-44e7250231b0.gif)


## Settings

### Method Patterns
Method patterns are the regex or string templates for parsing versioned methods

Here is the configuration for the example gif
```
"vdiff.methodPatterns": [
  {
    "filetype": ".pm", // The file extension that this pattern applies to
    "signature": "sub ([A-Za-z_]*)(\\d{4})(\\d{2})(\\d{2})\\s",// Regex expression that matches a method signature, with a capture group for the name and version
    "version": "(\\d{4})(\\d{2})(\\d{2})", // Regex expression for grabbing the version, with capture groups that are supplied to "versionExtraction" to add a comment
    "versionExtraction: "$2/$3/$1", // The template "version" uses to add an inline comment describing the version
    "description": "(^(?:#.*\\n)+)", // Regex expression for grabbing the comments before a method. 
    "versionType": "number" // the version type, it can be number, text, or date.
  }
]
```

You can add more method patterns to support other file types or version configurations
