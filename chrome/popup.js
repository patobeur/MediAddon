document.addEventListener('DOMContentLoaded', () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const currentTabId = tabs[0].id;
    chrome.storage.local.get(['mediaStore'], (result) => {
      const mediaContainer = document.getElementById('media-container');
      const mediaUrls = result.mediaStore ? result.mediaStore[currentTabId] : [];

      if (mediaUrls && mediaUrls.length > 0) {
        mediaUrls.forEach((url) => {
          const card = createMediaCard(url);
          mediaContainer.appendChild(card);
        });
      } else {
        const noMediaMessage = document.createElement('p');
        noMediaMessage.textContent = 'Aucun média détecté sur cet onglet.';
        noMediaMessage.style.textAlign = 'center';
        mediaContainer.appendChild(noMediaMessage);
      }
    });
  });
});

function createMediaCard(url) {
  const card = document.createElement('div');
  card.className = 'media-card';

  const filename = url.split('/').pop().split('?')[0];
  const extension = filename.split('.').pop().toUpperCase();

  // Thumbnail
  const thumbnail = document.createElement('div');
  thumbnail.className = 'media-thumbnail';

  if (['JPG', 'JPEG', 'PNG', 'GIF', 'WEBP'].includes(extension)) {
    const img = document.createElement('img');
    img.src = url;
    img.className = 'media-thumbnail';
    card.appendChild(img);
  } else {
    thumbnail.textContent = extension;
    card.appendChild(thumbnail);
  }

  // Media Info
  const info = document.createElement('div');
  info.className = 'media-info';

  const filenameDiv = document.createElement('div');
  filenameDiv.className = 'media-filename';
  filenameDiv.textContent = filename;
  info.appendChild(filenameDiv);

  const formatDiv = document.createElement('div');
  formatDiv.className = 'media-format';
  formatDiv.textContent = `Format: ${extension}`;
  info.appendChild(formatDiv);

  card.appendChild(info);

  // Download Link
  const downloadLink = document.createElement('a');
  downloadLink.href = '#';
  downloadLink.className = 'download-link';
  downloadLink.textContent = 'Télécharger';
  downloadLink.addEventListener('click', (e) => {
    e.preventDefault();
    chrome.downloads.download({ url: url, filename: filename });
  });

  card.appendChild(downloadLink);

  return card;
}
