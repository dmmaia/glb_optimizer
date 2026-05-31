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

function downloadFromBuffer(bufferData, filename, mimeType) {
  console.log("Test1")
  const blob = new Blob([bufferData], { type: mimeType });
  
  const blobUrl = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = "optimized_"+filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);
  console.log("Test2")
}
