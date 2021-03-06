# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed
- Utils - removed stale/legacy parameters within getCommonProps
- Bar/Line/Scatter/Pie - initial data processing wrapped in useMemo

### Added
- Bar/Line/Scatter/Pie - Legend - click to hide dataset

## [0.4.0] - 2020-09-30

### Fixed
- chart-props - revise definitions for colors and axisBottomLabelValues props
- TEXT_HEIGHT, LEGEND_HEIGHT - calculate with typographyProps, getTextSize

### Changed
- `<ChartWrapper />` - replace Autosizer with nivo's ResponsiveWrapper component
- typography - update font family to `Open Sans`
- deps - remove `react-virtualized-auto-sizer`
- devops - clean linting rules

### Added
- `title`, `titleStyle` - add props for `<Title />` component
- `typographyProps` - add props for styling chart font family, size, and color
- `<Tooltip />` - add chart typography style (font size, font family, color)
- `disableLegend` - add prop to disable Legend display

## [0.3.3] - 2020-08-24

### Fixed
- Legend - label trimming when special characters are present in the labels
- Title - remove title text when pointer hovers
- Utils - getAxisLabelsSeries - adjust function prop to its usage: `axisBottomTickValues` instead of `axisBottomLabelValues`

### Changed
- `<ChartWrapper />` - move all necessary chart wrapper css in ChartWrapper component

### Added
- `tooltipFormatX` - add prop to format bottom axis for Bar/Line/Scatterplot. Mostly used for dates in time series

## [0.3.2] - 2020-08-18

### Fixed
- ReadMe - update scatter & line props usage
- Utils - update sort function props to be more flexible

### Changed
- Y axis legend - offset is calculated using the longest y axis tick value instead of the last value
- `<ChartWrapper />` - revise ChartWrapper with propTypes def and named export withWrapper
- deps - change `react-virtualized` dependency to `react-virtualized-auto-sizer`, reducing package size
- devops - `stories` directory moved out of `src`, reducing package size
- devops - storybook updated to v6
- devops - add depcheck file and updated deps
- devops - add node 12.x and 14.x to master CI matrix
- devops - eslint react version auto detect
- stories - removed all stories related to title, legend, axis format, tooltip, typography,
            dynamic-data from individual chart stories into their own story files

## [0.3.0] & [0.3.1] - 2020-08-05

### Added
- `tooltipFormat` function prop for value customization
- Legend - custom number of labels allowed on the bottom / row chart legend
- Legend - custom trimLegend prop to allow trimming or not of chart legend labels
- @storybook/addon-storysource

### Changed
- Legend - right / column legend hides when chart width exceeds legend heigth

### Fixed
- `useLegendToggle` hook - workaround to dynamically update legend when data changes
- `<ScatterChart />` - fixed hover to target data series id instead of fill colour

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
