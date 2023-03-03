async function getFromChromeStorage(key) {
    let data = await chrome.storage.local.get(key)
    return data[key]
}

window.addEventListener("DOMContentLoaded", async () => {
    let performanceValues = await getFromChromeStorage("performanceValues")
    setValues(performanceValues)
    
})

function setValues(performanceValues) {
    let deprecatedSpan = document.querySelector(".deprecated")
    let lcpSpan = document.querySelector(".lcp")
    let domCompleteSpan = document.querySelector(".domComplete")
    let domInteractiveSpan = document.querySelector(".domInteractive")
    
    function setContent(element, heading, value) {
        element.textContent = `${heading}: ${value}ms`
    }

    let { deprecatedDomContentLoaded, lcp, domComplete, domInteractive } = performanceValues

    setContent(deprecatedSpan, "Page Load(dep)", deprecatedDomContentLoaded)
    setContent(lcpSpan, "LCP", lcp)
    setContent(domCompleteSpan, "DOM Complete", domComplete)
    setContent(domInteractiveSpan, "DOM Interactive", domInteractive)
}