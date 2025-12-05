document.addEventListener('DOMContentLoaded', () => {
    // Theme management
    const themeToggle = document.getElementById('themeToggle');
    const sunIcon = themeToggle.querySelector('.sun-icon');
    const moonIcon = themeToggle.querySelector('.moon-icon');
    
    // Check for saved theme preference or default to dark mode
    const currentTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Theme toggle functionality
    themeToggle.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    });
    
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            sunIcon.style.display = 'block';
            moonIcon.style.display = 'none';
        } else {
            sunIcon.style.display = 'none';
            moonIcon.style.display = 'block';
        }
    }

    // Image processing variables
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

    let originalImage = null;
    let originalWidth = 0;
    let originalHeight = 0;
    let currentScale = 100;
    let originalFileName = 'image';
    let originalFileType = 'png';
    let originalFileSize = 0;

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
