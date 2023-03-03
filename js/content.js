let performanceValues = {}

performanceValues["deprecatedDomContentLoaded"] =
	window.performance.timing.domContentLoadedEventEnd -
	window.performance.timing.navigationStart
