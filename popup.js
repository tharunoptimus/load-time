async function getFromChromeStorage(key) {
    let data = await chrome.storage.local.get(key)
    return data[key]
}
