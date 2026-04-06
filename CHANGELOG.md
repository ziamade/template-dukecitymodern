# Changelog

All notable changes to this template will be documented in this file.

Format follows [Keep a Changelog](https://keepachangelog.com/). Versions follow [semver](https://semver.org/).

## [Unreleased]

## [0.1.0] - 2026-04-06

### Added
- Versioning standard with semver rules documented in CLAUDE.md
- CI version consistency check (package.json must match _template-manifest.json)
- Vitest version consistency test
- npm `version` lifecycle hook to auto-sync _template-manifest.json
- CHANGELOG.md

### Changed
- Reset version numbering from inconsistent legacy tags to `0.1.0` (beta)
- Tightened `templateManifestSchema` to validate version, description, capabilities fields
- Updated README.md versioning section

### Fixed
- Template manifest accuracy (sectionVariants, advisoryLimits) — PR #67
- Generic brand placeholder replacing hardcoded business name — PR #67
- Test fixture manifest synced with source of truth — PR #67
