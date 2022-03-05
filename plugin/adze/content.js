console.log('in content.js');

function  addSiteToList() {

  // First, get the active tab
  var title = document.title;
  var url = document.location.href;

  var docToAdd = {
    title: title,
    url: url,
    timestamp_ms:  Date.now()
  };
  // Once you have the active tab, add it to the manifest
  console.log('sending the document');
  console.log(docToAdd);
   chrome.runtime.sendMessage({adze: { addDocument: docToAdd}});
}
addSiteToList();
