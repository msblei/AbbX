// Content script function to retrieve selected text
function getSelectedTextContent() {
  const selectedText = window.getSelection().toString();
  return selectedText;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.message === 'getSelectedText') {
    // Send a message to the content script to get the selected text
    console.log('send response');
    sendResponse(getSelectedTextContent());

    // Return true to indicate that the response will be sent asynchronously
    return true;
  }
});
