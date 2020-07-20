# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Changed
- Legend - right / column legend hides when chart width exceeds legend heigth

### Added
- Legend - custom number of labels allowed on the bottom / row chart Legend

## [0.2.0] - 2020-07-07

### Added
- export `<PieChart />` component
- `<PieChart />` data key handling and processing
- CHANGELOG.md
- LICENSE

### Changed
- update `README.md` with proper data processing usage

## [0.1.0] - 2020-07-02

### Added
Export 3 basic Nivo chart components: 
- `<BarChart />`
- `<LineChart />`
- `<ScatterChart />`

- dynamic margins that adjust to incorporate axis ticks, axis tick labels, axis legends, and chart legend
- trimming of axis and legend labels
- formatted axis labels
- data key handling and processing for the different charts
- colour processing