document.addEventListener('DOMContentLoaded', () => {
  browser.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    browser.storage.local.get(['mediaStore'], (result) => {
      const mediaList = document.getElementById('media-list');
      const mediaUrls = result.mediaStore ? result.mediaStore[currentTabId] : [];

      if (mediaUrls && mediaUrls.length > 0) {
        mediaUrls.forEach((url) => {
          const listItem = document.createElement('li');
          const link = document.createElement('a');
          link.href = url;
          link.textContent = url.split('/').pop();
          link.target = '_blank';
          // Use the downloads API for a better user experience
          link.addEventListener('click', (e) => {
            e.preventDefault();
            browser.downloads.download({ url: url });
          });
          listItem.appendChild(link);
          mediaList.appendChild(listItem);
        });
      } else {
        const listItem = document.createElement('li');
        listItem.textContent = 'Aucun média détecté sur cet onglet.';
        mediaList.appendChild(listItem);
      }
    });
  });
});
