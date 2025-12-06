// Global function for new upload to work with inline onclick
function handleNewUpload() {
    console.log('New upload button clicked via inline function');
    
    // Get elements
    const imageInput = document.getElementById('imageInput');
    const uploadSection = document.getElementById('uploadSection');
    const editorSection = document.getElementById('editorSection');
    const canvas = document.getElementById('imageCanvas');
    const ctx = canvas.getContext('2d');
    
    // Clear the file input to allow selecting the same file again
    if (imageInput) {
        imageInput.value = '';
        
        // Reset all variables (they need to be global or accessed differently)
        window.originalImage = null;
        window.originalWidth = 0;
        window.originalHeight = 0;
        window.currentScale = 100;
        window.originalFileName = 'image';
        window.originalFileType = 'png';
        window.originalFileSize = 0;
        
        // Clear canvas
        if (canvas && ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Reset displays
        const originalSizeDisplay = document.getElementById('originalSize');
        const originalFileSizeDisplay = document.getElementById('originalFileSize');
        const scaleDisplay = document.getElementById('scaleDisplay');
        const newSizeDisplay = document.getElementById('newSize');
        const newFileSizeDisplay = document.getElementById('newFileSize');
        const scaleSlider = document.getElementById('scaleSlider');
        const scaleValueDisplay = document.getElementById('scaleValue');
        
        if (originalSizeDisplay) originalSizeDisplay.textContent = '0 x 0';
        if (originalFileSizeDisplay) originalFileSizeDisplay.textContent = '0 KB';
        if (scaleDisplay) scaleDisplay.textContent = '100%';
        if (newSizeDisplay) newSizeDisplay.textContent = '0 x 0';
        if (newFileSizeDisplay) newFileSizeDisplay.textContent = '计算中...';
        
        if (scaleSlider) scaleSlider.value = 100;
        if (scaleValueDisplay) scaleValueDisplay.textContent = '100%';
        
        // Show upload section, hide editor
        if (uploadSection) uploadSection.classList.remove('hidden');
        if (editorSection) editorSection.classList.add('hidden');
        
        // Trigger file input click
        setTimeout(() => {
            if (imageInput) imageInput.click();
        }, 300);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    console.log('PicTrans loaded successfully');
    
    // Check if all required elements exist
    const elementsToCheck = [
        'themeToggle',
        'imageInput', 
        'uploadSection',
        'editorSection',
        'imageCanvas',
        'originalSize',
        'newSize',
        'originalFileSize',
        'newFileSize',
        'scaleDisplay',
        'scaleSlider',
        'scaleValue',
        'resetBtn',
        'downloadBtn',
        'newUploadBtn'
    ];
    
    elementsToCheck.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            console.log(`✓ Element found: ${id}`, element);
        } else {
            console.error(`✗ Element missing: ${id}`);
        }
    });
    
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

    // Make variables global for inline function access
    window.originalImage = null;
    window.originalWidth = 0;
    window.originalHeight = 0;
    window.currentScale = 100;
    window.originalFileName = 'image';
    window.originalFileType = 'png';
    window.originalFileSize = 0;
    
    // Also keep local references for compatibility
    let originalImage = window.originalImage;
    let originalWidth = window.originalWidth;
    let originalHeight = window.originalHeight;
    let currentScale = window.currentScale;
    let originalFileName = window.originalFileName;
    let originalFileType = window.originalFileType;
    let originalFileSize = window.originalFileSize;

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
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
        console.log('Theme toggle button initialized');
    } else {
        console.error('Theme toggle button not found');
    }

    // Handle File Upload
    if (imageInput) {
        imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            // Store original file size
            originalFileSize = file.size;
            window.originalFileSize = file.size;
            
            // Extract original filename and type
            originalFileName = file.name.split('.').slice(0, -1).join('.');
            window.originalFileName = originalFileName;
            const fileExtension = file.name.split('.').pop().toLowerCase();
            
            // Determine output format based on input format
            if (['jpg', 'jpeg'].includes(fileExtension)) {
                originalFileType = 'jpeg';
                window.originalFileType = 'jpeg';
            } else if (fileExtension === 'png') {
                originalFileType = 'png';
                window.originalFileType = 'png';
            } else if (fileExtension === 'webp') {
                originalFileType = 'webp';
                window.originalFileType = 'webp';
            } else {
                originalFileType = 'png'; // Default to PNG for other formats
                window.originalFileType = 'png';
            }
            
            const reader = new FileReader();
            reader.onload = (event) => {
                originalImage = new Image();
                originalImage.onload = () => {
                    originalWidth = originalImage.width;
                    originalHeight = originalImage.height;
                    window.originalImage = originalImage;
                    window.originalWidth = originalWidth;
                    window.originalHeight = originalHeight;
                    
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
    } else {
        console.error('Image input not found');
    }

    // Handle Slider Change
    if (scaleSlider) {
        scaleSlider.addEventListener('input', (e) => {
            currentScale = parseInt(e.target.value);
            window.currentScale = currentScale;
            scaleValueDisplay.textContent = `${currentScale}%`;
            updateCanvas();
        });
    } else {
        console.error('Scale slider not found');
    }

    // Handle Reset
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetEditor();
        });
    } else {
        console.error('Reset button not found');
    }

    // Handle Download
    if (downloadBtn) {
        downloadBtn.addEventListener('click', () => {
            canvas.toBlob((blob) => {
                const link = document.createElement('a');
                link.download = `${window.originalFileName || originalFileName}_resized.${window.originalFileType || originalFileType}`;
                link.href = URL.createObjectURL(blob);
                link.click();
                // Clean up the object URL
                setTimeout(() => URL.revokeObjectURL(link.href), 100);
            }, `image/${window.originalFileType || originalFileType}`, (window.originalFileType || originalFileType) === 'png' ? 1.0 : 0.95);
        });
    } else {
        console.error('Download button not found');
    }

    console.log('New upload button using inline onclick handler');

    function resetEditor() {
        currentScale = 100;
        window.currentScale = 100;
        if (scaleSlider) scaleSlider.value = 100;
        if (scaleValueDisplay) scaleValueDisplay.textContent = '100%';
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
        // Get current values from globals
        const img = window.originalImage || originalImage;
        const w = window.originalWidth || originalWidth;
        const h = window.originalHeight || originalHeight;
        const scale = window.currentScale || currentScale;
        const fileSize = window.originalFileSize || originalFileSize;
        
        if (!img) return;

        const newWidth = Math.floor(w * (scale / 100));
        const newHeight = Math.floor(h * (scale / 100));

        // Update Info Display
        if (originalSizeDisplay) originalSizeDisplay.textContent = `${w} x ${h}`;
        if (originalFileSizeDisplay) originalFileSizeDisplay.textContent = formatFileSize(fileSize);
        if (scaleDisplay) scaleDisplay.textContent = `${scale}%`;
        if (newSizeDisplay) newSizeDisplay.textContent = `${newWidth} x ${newHeight}`;

        // Resize Canvas
        canvas.width = newWidth;
        canvas.height = newHeight;

        // High-quality image rendering
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        
        // Clear canvas
        ctx.clearRect(0, 0, newWidth, newHeight);
        
        // Draw Image with high quality
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Calculate and display estimated new file size
        canvas.toBlob((blob) => {
            const estimatedSize = blob.size;
            if (newFileSizeDisplay) {
                newFileSizeDisplay.textContent = formatFileSize(estimatedSize);
            }
        }, `image/${window.originalFileType || originalFileType}`, (window.originalFileType || originalFileType) === 'png' ? 1.0 : 0.95);
    }
});
