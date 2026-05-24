const dropArea = document.getElementById('drop_area');
const fileInput = document.getElementById('file');
const form = document.getElementById('file_form');
const drop_msg = document.getElementById('drop_msg');
const drop_icon = document.getElementById('drop_icon');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, e => {
    e.preventDefault();
    e.stopPropagation();
  }, false);
});

['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.add('highlight');
    drop_msg.classList.add('hidden');
    drop_icon.classList.remove('hidden');
}, false);
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, () => {
    dropArea.classList.remove('highlight');
    drop_msg.classList.remove('hidden');
    drop_icon.classList.add('hidden');
}, false);
});

dropArea.addEventListener('drop', (e) => {
  const dt = e.dataTransfer;
  const files = dt.files;
  fileInput.files = files;
  console.log('Files uploaded:', files);
  form.submit()
});
