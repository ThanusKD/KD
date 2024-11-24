document.addEventListener('DOMContentLoaded', function() {
    // Handle Generate Design button click on form page
    const generateButton = document.querySelector('.Generate_Design');
    if (generateButton) {
        generateButton.addEventListener('click', handleGenerate);
    }

    // Handle Generate Another Design button click on results page
    const generateAnotherButton = document.querySelector('.Generate.Another.Design');
    if (generateAnotherButton) {
        generateAnotherButton.addEventListener('click', () => {
            window.location.href = '/';  // Go back to form page
        });
    }
});

async function handleGenerate() {
    // Get all input values
    const roomType = document.getElementById('roomType').value;
    const length = document.getElementById('length').value;
    const width = document.getElementById('width').value;
    const furniture = document.getElementById('furniture').value;
    const style = document.getElementById('style').value;

    // Validate inputs
    if (!roomType || !length || !width || !furniture || !style) {
        alert('Please fill in all fields');
        return;
    }

    // Create form data
    const formData = new FormData();
    formData.append('room_type', `${roomType} ${length}x${width} feet`);
    formData.append('room_size', `${length}x${width} feet`);
    formData.append('furniture', furniture);
    formData.append('style', style);

    try {
        // Show loading state
        const generateButton = document.querySelector('.Generate_Design');
        generateButton.textContent = 'Generating...';
        generateButton.disabled = true;

        // Send request to generate design
        const response = await fetch('/generate_design', {
            method: 'POST',
            body: formData
        });

        if (response.ok) {
            const data = await response.json();
            // Store the image URL in localStorage
            localStorage.setItem('generatedImageUrl', data.image_url);
            // Redirect to results page
            window.location.href = '/results';
        } else {
            const error = await response.json();
            alert('Error generating design: ' + error.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while generating the design');
    } finally {
        // Reset button state
        const generateButton = document.querySelector('.Generate_Design');
        generateButton.textContent = 'Generate Design';
        generateButton.disabled = false;
    }
}

// Load generated image if we're on the results page
if (document.querySelector('.image-placeholder')) {
    const imageUrl = localStorage.getItem('generatedImageUrl');
    if (imageUrl) {
        const imageElement = document.createElement('img');
        imageElement.src = imageUrl;
        imageElement.style.width = '100%';
        imageElement.style.height = '100%';
        imageElement.style.objectFit = 'cover';
        imageElement.style.borderRadius = '10px';
        
        document.querySelector('.image-placeholder').appendChild(imageElement);
    }
}