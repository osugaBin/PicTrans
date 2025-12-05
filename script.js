document.addEventListener('DOMContentLoaded', () => {
    // Theme Toggle Elements
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    
    // Image Processing Elements
    const imageInput = document.getElementById('imageInput');
    const uploadSection = document.getElementById('uploadSection');
    const editorSection = document.getElementById('editorSection');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    
    const originalSizeDisplay = document.getElementById('originalSize');
    const newSizeDisplay = document.getElementById('newSize');
    const originalFileSizeDisplay = document.getElementById('originalFileSize');
    const newFileSizeDisplay = document.getElementById('newFileSize');
    const scaleDisplay = document.getElementById('scaleDisplay');
    const scaleSlider = document.getElementById('scaleSlider');
    const scaleValueDisplay = document.getElementById('scaleValue');
    const resetBtn = document.getElementById('resetBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const newUploadBtn = document.getElementById('newUploadBtn');

    let originalImage = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let currentScale = 100;
    let originalFileName = 'image';
    let originalFileType = 'png';
    let originalFileSize = 0;

    // Theme Management
    function initTheme() {
        // Check for saved theme preference or default to dark
        const savedTheme = localStorage.getItem('theme') || 'dark';
        htmlElement.setAttribute('data-theme', savedTheme);
    }

    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Add a small animation effect
        themeToggle.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggle.style.transform = 'scale(1)';
        }, 150);
    }

    // Initialize theme on page load
    initTheme();

    // Theme toggle event listener
    themeToggle.addEventListener('click', toggleTheme);

    // Handle File Upload
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store original file size
            originalFileSize = file.size;
            
            // Extract original filename and type
            originalFileName = file.name.split('.').slice(0, -1).join('.');
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            // Determine output format based on input format
            if (['jpg', 'jpeg'].includes(fileExtension)) {
                originalFileType = 'jpeg';
            } else if (fileExtension === 'png') {
                originalFileType = 'png';
            } else if (fileExtension === 'webp') {
                originalFileType = 'webp';
            } else {
                originalFileType = 'png'; // Default to PNG for other formats
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                originalImage = new Image();
                originalImage.onload = () => {
                    originalWidth = originalImage.width;
                    originalHeight = originalImage.height;
                    
                    // Show editor, hide upload
                    uploadSection.classList.add('hidden');
                    editorSection.classList.remove('hidden');
                    
                    // Initial Draw
                    resetEditor();
                };
                originalImage.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle Slider Change
    scaleSlider.addEventListener('input', (e) => {
        currentScale = parseInt(e.target.value);
        scaleValueDisplay.textContent = `${currentScale}%`;
        updateCanvas();
    });

    // Handle Reset
    resetBtn.addEventListener('click', () => {
        resetEditor();
    });

    // Handle Download
    downloadBtn.addEventListener('click', () => {
        canvas.toBlob((blob) => {
            const link = document.createElement('a');
            link.download = `${originalFileName}_resized.${originalFileType}`;
            link.href = URL.createObjectURL(blob);
            link.click();
            // Clean up the object URL
            setTimeout(() => URL.revokeObjectURL(link.href), 100);
        }, `image/${originalFileType}`, originalFileType === 'png' ? 1.0 : 0.95);
    });

    // Handle New Upload
    newUploadBtn.addEventListener('click', () => {
        // Clear the file input to allow selecting the same file again
        imageInput.value = '';
        
        // Reset all variables
        originalImage = null;
        originalWidth = 0;
        originalHeight = 0;
        currentScale = 100;
        originalFileName = 'image';
        originalFileType = 'png';
        originalFileSize = 0;
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Reset displays
        originalSizeDisplay.textContent = '0 x 0';
        originalFileSizeDisplay.textContent = '0 KB';
        scaleDisplay.textContent = '100%';
        newSizeDisplay.textContent = '0 x 0';
        newFileSizeDisplay.textContent = '计算中...';
        
        // Reset slider
        scaleSlider.value = 100;
        scaleValueDisplay.textContent = '100%';
        
        // Show upload section, hide editor
        uploadSection.classList.remove('hidden');
        editorSection.classList.add('hidden');
        
        // Trigger file input click
        setTimeout(() => {
            imageInput.click();
        }, 300);
    });

    function resetEditor() {
        currentScale = 100;
        scaleSlider.value = 100;
        scaleValueDisplay.textContent = '100%';
        updateCanvas();
    }

    function formatFileSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function updateCanvas() {
        if (!originalImage) return;

        const newWidth = Math.floor(originalWidth * (currentScale / 100));
        const newHeight = Math.floor(originalHeight * (currentScale / 100));

        // Update Info Display
        originalSizeDisplay.textContent = `${originalWidth} x ${originalHeight}`;
        originalFileSizeDisplay.textContent = formatFileSize(originalFileSize);
        scaleDisplay.textContent = `${currentScale}%`;
        newSizeDisplay.textContent = `${newWidth} x ${newHeight}`;

        // Resize Canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // High-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Clear canvas
        ctx.clearRect(0, 0, newWidth, newHeight);
        
        // Draw Image with high quality
        ctx.drawImage(originalImage, 0, 0, newWidth, newHeight);

        // Calculate and display estimated new file size
        canvas.toBlob((blob) => {
            const estimatedSize = blob.size;
            newFileSizeDisplay.textContent = formatFileSize(estimatedSize);
        }, `image/${originalFileType}`, originalFileType === 'png' ? 1.0 : 0.95);
    }
});
