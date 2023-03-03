let canShow = false
let performanceValues = {}

performanceValues["deprecatedDomContentLoaded"] =
	window.performance.timing.domContentLoadedEventEnd -
	window.performance.timing.navigationStart

chrome.runtime.sendMessage({
	type: "performanceValues",
	data: performanceValues,
})

function observerFn(list) {
	list.getEntries().forEach((entry) => {
		switch (entry.entryType) {
			case "largest-contentful-paint":
				performanceValues["lcp"] = parseInt(entry.renderTime.toFixed(2))
				break
			case "navigation":
				performanceValues["domComplete"] = parseInt(
					entry.domComplete.toFixed(2)
				)
				performanceValues["domInteractive"] = parseInt(
					entry.domInteractive.toFixed(2)
				)
				break
			default:
				console.log(entry)
				break
		}
		canShow = true
	})
}

const observer = new PerformanceObserver(observerFn)
;["largest-contentful-paint", "navigation"].forEach((entryType) => {
	observer.observe({ type: entryType, buffered: true })
})

let interval = setInterval(() => {
	if (canShow) {
		saveToChromeStorage("performanceValues", performanceValues)
		clearInterval(interval)
	}
}, 100)

function saveToChromeStorage(key, object) {
	chrome.storage.local.set({ [key]: object })
}
