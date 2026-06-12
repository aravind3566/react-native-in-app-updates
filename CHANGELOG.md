# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.1] - 2026-06-12

### Fixed
- **Kotlin Compile Error**: Resolved the `Unresolved reference 'currentActivity'` error in `InAppUpdatesModule.kt` by using the inherited `currentActivity` property directly from the base module class.
- **Duplicate Class Dex Merging**: Fixed the release compilation conflict (`NativeAccessibilityInfoSpec is defined multiple times`) by:
  - Changing the `react-native` dependency from `implementation` to `compileOnly` in `android/build.gradle`.
  - Commenting out the application of the `com.facebook.react` plugin (since this is a legacy native module and does not require TurboModule codegen tasks).
- **Git Housekeeping**: Removed the compiled `lib/` folder from Git tracking and added it to `.gitignore` to prevent tracking build outputs.
