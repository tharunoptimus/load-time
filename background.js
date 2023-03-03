chrome.runtime.onMessage.addListener((request, sender) => {
	if (request.type === "performanceValues") {
		let performanceValues = request.data
		let { deprecatedDomContentLoaded: ddcl } = performanceValues
		let tabId = sender.tab.id

		let color = "green"
		if (ddcl > 7000) color = "#e84118"
		if (ddcl > 2500) color = "#f1c40f"

		chrome.action.setBadgeBackgroundColor({ color, tabId })
		chrome.action.setBadgeText({
			text: ddcl.toString(),
			tabId,
		})
	}
})
