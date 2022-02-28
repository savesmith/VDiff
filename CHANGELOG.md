# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

# [1.2.0]
### Change
- Version info is seperate from signature, leading to better diffs
### Fixed
- Issue parsing method with {} in signature. 

# [1.1.0]
- Unable to detect language for comment for .t files, defaults to perl now

## [1.0.0] - 2022-02-16
### Change
- MethodPatterns uses name setting
- Capture groups are not required in setting regexes.

### Added
- Define your signature by referencing your $NAME$ and $VERSION$ set in the file
- Alerts when unhappy paths occur

### Fixed
- Updated settings didn't apply without reload
- Version matching with full signature when extracting into comment

## [0.2.1] - 2022-02-16
### Fixed
- Diff wouldn't update on source file change

## [0.2.0] - 2022-02-15
### Added
- Comparison between methods in another file
- Multiple method patterns for the same file type
- versionType property with the formats: number, text, date.
- versionDateFormat for versionType date to order version by the date
- versionExtraction no longer needs need to handle the comment

## [0.1.0] - 2022-02-14
Experimental Release. Feedback is greatly appreciated and will be addressed promptly.
### Added
- Diff method versions
- Settings for customizing parsing methods and defining reformatting for diff
- Handles different settings for different file types. 
