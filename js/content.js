let performanceValues = {}

performanceValues["deprecatedDomContentLoaded"] =
	window.performance.timing.domContentLoadedEventEnd -
	window.performance.timing.navigationStart

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


function createStatsHTML(performanceValues) {
	return `
        <div class="load-time-performance-stats">
            <div class="load-time-performance-stats-header">
                <div class="load-time-performance-stats-header__title">Load Time Performance Stats</div>
            </div>
            <div class="ltps__item">
                <div class="ltps__item__title">LCP</div>
                <div class="ltps__item__value">${performanceValues["lcp"]}</div>
            </div>
            <div class="ltps__item">
                <div class="ltps__item__title">DOM Complete</div>
                <div class="ltps__item__value">${performanceValues["domComplete"]}</div>
            </div>
            <div class="ltps__item">
                <div class="ltps__item__title">DOM Interactive</div>
                <div class="ltps__item__value">${performanceValues["domInteractive"]}</div>
            </div>
            <div class="ltps__item">
                <div class="ltps__item__title">Deprecated DOM Content Loaded</div>
                <div class="ltps__item__value">${performanceValues["deprecatedDomContentLoaded"]}</div>
            </div>
        </div>
    `
}

function parseHTML(str) {
	var tmp = document.implementation.createHTMLDocument()
	tmp.body.innerHTML = str
	return tmp.body.children
}

