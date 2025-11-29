// Saves options to browser.storage
function save_options() {
  const mp3 = document.getElementById('mp3').checked;
  const mp4 = document.getElementById('mp4').checked;
  const jpg = document.getElementById('jpg').checked;
  const png = document.getElementById('png').checked;

  browser.storage.sync.set({
    detectMp3: mp3,
    detectMp4: mp4,
    detectJpg: jpg,
    detectPng: png
  }, function() {
    // Update status to let user know options were saved.
    const status = document.getElementById('status');
    status.textContent = 'Options enregistrées.';
    setTimeout(function() {
      status.textContent = '';
    }, 750);
  });
}

// Restores select box and checkbox state using the preferences
// stored in browser.storage.
function restore_options() {
  // Use default value true for all options
  browser.storage.sync.get({
    detectMp3: true,
    detectMp4: true,
    detectJpg: true,
    detectPng: true
  }, function(items) {
    document.getElementById('mp3').checked = items.detectMp3;
    document.getElementById('mp4').checked = items.detectMp4;
    document.getElementById('jpg').checked = items.detectJpg;
    document.getElementById('png').checked = items.detectPng;
  });
}

document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);
