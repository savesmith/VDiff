# vDiff - A Diff for Versioned Methods
vDiff generates a diff of a file's versioned methods. To perserve legacy code, we may implement a change to _hello01()_ by copying it and adding the change in a new method _hello02()_. Now we won't introduce any bugs in legacy, but we won't be able to easily see the change in the source control's diff. However, vDiff will comb through a file and create a diff between the two methods. 

![vDiff_Example-1644822622867](https://user-images.githubusercontent.com/21265432/153816493-b20566b0-d1f7-4bac-8561-c6148418900e.gif)

## How to use
- Configure your file's versioning by defining its methodPattern in settings. The first perl example shown is configured by default. 
- Right click on your active editor or a file in the explorer and select _Version Diff_



### Customizing your signature
Currently the signature pattern should consist of two capture groups. The first capture group is expected to be the method's identifier. This is what matches two different versions together. The second is the version.
```
"vdiff.methodPatterns": [
  {
    ...,
    "signature": "sub $NAME$$VERSION$\\s",
    "name": "[A-Za-z_]*",
    "version": "(\\d{4})(\\d{2})(\\d{2})"
  }
]
```
![vDiff_Example-1644822622867](https://user-images.githubusercontent.com/21265432/153816493-b20566b0-d1f7-4bac-8561-c6148418900e.gif)

```
"vdiff.methodPatterns": [
  {
    ...,
    "signature": "public .* $NAME$_$VERSION$\\(.*\\)",
    "name": "[A-Za-z_]*",
    "version": "(\\d{2})_(\\d{2})_(\\d{4})
  }
]
```
![vDiff_Example-1645056973466](https://user-images.githubusercontent.com/21265432/154379420-4abf8fd8-9540-41bc-85f5-250ac768113a.gif)

### Extracting your version
```
"vdiff.methodPatterns": [
  {
    ...,
    "version": "(\\d{4})(\\d{2})(\\d{2})",
    "formattedVersion:":"Year: $1 | Month: $2 | Day: $3"
  }
]
```
![image](https://user-images.githubusercontent.com/21265432/154384744-403a437e-5b2f-42a4-95bb-2d601c7c218c.png)

### Version Type
Setting your version type (and versionDateFormat if the type is date) is very important as it orders the methods determining which one is new and old. The default value is text.



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

### Using Regex
Regex is a sequence of characters that specifies a search pattern in text. It is used heavily in this extension to find versioned methods and to extract information about them. If you are new to regex, I would recommend using a regex testing website like https://regex101.com/ to test if your regex matches your methods' signatures when configuring your settings.

Here is also a cheat sheet: https://quickref.me/regex#regex-in-javascript

The regex expression in your settings should be for javascript regex. Not the language you are trying to parse. 

The regex in the settings comes in as a string, so the proper escape characters must be included. That is why in the examples you will see "\\d" instead of "\d". 

Here are some basics for understanding the README:

#### Matching a single character
- A-Z: Matches all uppercase alphabet symbols
- a-z: Matches all lowercase alphabet symbols
- 0-9: Matches all number characters
- \[xy\]: Matches one of the characters in the brackets
- \[A-Za-z\]: Matches either a uppercase letter or a lowercase letter. NOT a range. 
- \[A-Za-z0-9_\]: Matches a uppercase letter, or a lowercase letter, or a number, or an underscore. A good definition for characters normally allowed in a method name.
### Matching multiple characters
- \*: Matches 0 or more of the preceding character (e.g. a* matches "aaa" or "")
- \+: Matches 1 or more of the preceding character (e.g. a+ matches "aaa" or "a" but not "")
### Capture Groups
- (): creates a capture group. hello(\d*) will match hello123 and will capture 123. $1 would be 123 in a setting like _versionExtraction_.
- (?:): a non capturing group. You may need to use a group to define repitition in a pattern, but you don't want to capture it. hello(?:\d*) would match hello123 but have no capture groups. 


## Settings

### Method Patterns
Method patterns are the regex or string templates for parsing versioned methods

Here is the configuration for the example gif
```
"vdiff.methodPatterns": [
  {
    "filetype": ".pm", // The file extension that this pattern applies to
    "signature": "sub $NAME$$VERSION$\\s", // Regex expression that matches a method signature, with a capture group for the name and version
    "name": [A-Za-z_]*, // the identifier that matches the method
    "version": "(\\d{4})(\\d{2})(\\d{2})", // Regex expression for grabbing the version, with capture groups that are supplied to "versionExtraction" to add a comment
    "formattedVersion: "$2/$3/$1", // The template "version" uses to add an inline comment describing the version
    "description": "(^(?:#.*\\n)+)", // Regex expression for grabbing the comments before a method. 
    "versionType": "number" // the version type, it can be number, text, or date.
  }
]
```

You can add more method patterns to support other file types or version configurations
