# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.1] - 2022-02-16
- Fix bug where diff wouldn't update on source file change
- Update documentation

## [0.2.0] - 2022-02-15
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
