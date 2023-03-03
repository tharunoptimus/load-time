let canShow = false
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

let interval = setInterval(() => {
	if (canShow) {
		let statsHTML = createStatsHTML(performanceValues)
		let statsDOM = parseHTML(statsHTML)
		document.body.prepend(statsDOM[0])
		injectCSS(css)
		dragLoadTimeStatsDiv(document.querySelector(".load-time-performance-stats"))
		clearInterval(interval)
	}
}, 100)

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

let css = `
    .load-time-performance-stats {
        position: absolute;
        z-index: 9;
        background-color: #f1f1f1;
        border: 1px solid #d3d3d3;
        text-align: center;
    }
    .load-time-performance-stats-header {
        padding: 10px;
        cursor: move;
        z-index: 10;
        background-color: #2196F3;
        color: #fff;
    }
`

function parseHTML(str) {
	var tmp = document.implementation.createHTMLDocument()
	tmp.body.innerHTML = str
	return tmp.body.children
}

function injectCSS(css) {
	var style = document.createElement("style")
	style.innerHTML = css
	document.head.appendChild(style)
}

// https://www.w3schools.com/howto/howto_js_draggable.asp
function dragLoadTimeStatsDiv(elmnt) {
	var pos1 = 0,
		pos2 = 0,
		pos3 = 0,
		pos4 = 0
	if (document.getElementById(elmnt.id + "header")) {
		document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown
	} else {
		elmnt.onmousedown = dragMouseDown
	}

	function dragMouseDown(e) {
		e = e || window.event
		e.preventDefault()
		pos3 = e.clientX
		pos4 = e.clientY
		document.onmouseup = closeDragElement
		document.onmousemove = elementDrag
	}

	function elementDrag(e) {
		e = e || window.event
		e.preventDefault()
		pos1 = pos3 - e.clientX
		pos2 = pos4 - e.clientY
		pos3 = e.clientX
		pos4 = e.clientY
		elmnt.style.top = elmnt.offsetTop - pos2 + "px"
		elmnt.style.left = elmnt.offsetLeft - pos1 + "px"
	}

	function closeDragElement() {
		document.onmouseup = null
		document.onmousemove = null
	}
}
