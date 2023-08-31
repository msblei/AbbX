// Content script function to retrieve selected text
function getSelectedTextContent() {
  const selectedText = window.getSelection().toString();
  return selectedText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getSelectedText') {
    // Send a message to the content script to get the selected text
    console.log('getSelectedText');
    sendResponse(getSelectedTextContent());

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
  if (request.action === 'addTooltip') {
    console.log('received addTooltip');
    const selectedText = window.getSelection().toString();

    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = selectedText;

    const range = window.getSelection().getRangeAt(0);
    const rect = range.getBoundingClientRect();

    tooltip.style.top = rect.top + window.scrollY - tooltip.offsetHeight + 'px';
    tooltip.style.left = rect.left + window.scrollX + 'px';

    document.body.appendChild(tooltip);

    sendResponse({ message: 'Tooltip added successfully' });
  }
});
