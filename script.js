 // Initialize Lucide Icons
        lucide.createIcons();

        // Initialize Forminit
        const forminit = new Forminit();
        const FORM_ID = "ufnrtkfphhk"

        document.addEventListener('DOMContentLoaded', () => {
            
            /* --- Mobile Navigation Toggle --- */
            const mobileBtn = document.getElementById('mobile-menu-btn');
            const navLinks = document.getElementById('nav-links');
            const navItems = navLinks.querySelectorAll('a');

            mobileBtn.addEventListener('click', () => {
                navLinks.classList.toggle('active');
                const icon = navLinks.classList.contains('active') ? 'x' : 'menu';
                mobileBtn.innerHTML = `<i data-lucide="${icon}"></i>`;
                lucide.createIcons();
            });

            // Close menu when a link is clicked
            navItems.forEach(item => {
                item.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                    mobileBtn.innerHTML = `<i data-lucide="menu"></i>`;
                    lucide.createIcons();
                });
            });


            /* --- Photo Upload Logic --- */
            const photoInput = document.getElementById('photo-input');
            const dropzone = document.getElementById('photo-dropzone');
            const previewContainer = document.getElementById('image-preview-container');
            const imagePreview = document.getElementById('image-preview');
            const changePhotoBtn = document.getElementById('change-photo-btn');
            const photoError = document.getElementById('photo-error');

            function handleFile(file) {
                if (file && file.type.startsWith('image/')) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                        imagePreview.src = e.target.result;
                        dropzone.style.display = 'none';
                        previewContainer.style.display = 'block';
                        photoError.style.display = 'none';
                    };
                    reader.readAsDataURL(file);
                } else {
                    alert('Please select a valid image file.');
                    photoInput.value = ''; // Clear invalid file
                }
            }

            photoInput.addEventListener('change', (e) => {
                handleFile(e.target.files[0]);
            });

            changePhotoBtn.addEventListener('click', () => {
                photoInput.value = '';
                imagePreview.src = '';
                previewContainer.style.display = 'none';
                dropzone.style.display = 'block';
            });


            /* --- Geolocation Logic --- */
            const getLocBtn = document.getElementById('get-location-btn');
            const locStatus = document.getElementById('location-status');
            const latInput = document.getElementById('lat-input');
            const lngInput = document.getElementById('lng-input');
            const mapsUrlInput = document.getElementById('maps-url-input');
            const mapsPreviewLink = document.getElementById('maps-preview-link');
            const locProvidedFlag = document.getElementById('location-provided');
            const manualLocGroup = document.getElementById('manual-location-group');
            const locError = document.getElementById('location-error');

            getLocBtn.addEventListener('click', () => {
                // Reset status
                locStatus.innerHTML = '<i data-lucide="loader-2" class="lucide-spin"></i> Getting location...';
                locStatus.className = 'location-status';
                lucide.createIcons();
                getLocBtn.disabled = true;
                manualLocGroup.style.display = 'none';

                if (!navigator.geolocation) {
                    showLocError("Geolocation is not supported by your browser.");
                    return;
                }

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        // Success
                        const lat = position.coords.latitude;
                        const lng = position.coords.longitude;
                        const mapUrl = `https://www.google.com/maps?q=${lat},${lng}`;
                        
                        latInput.value = lat;
                        lngInput.value = lng;
                        mapsUrlInput.value = mapUrl;
                        locProvidedFlag.value = 'true';
                        
                        locStatus.innerHTML = '<i data-lucide="check"></i> Location captured successfully';
                        locStatus.className = 'location-status status-success';
                        
                        mapsPreviewLink.href = mapUrl;
                        mapsPreviewLink.style.display = 'inline-block';
                        
                        getLocBtn.style.display = 'none';
                        locError.style.display = 'none';
                        lucide.createIcons();
                    },
                    (error) => {
                        // Error (User denied, timeout, etc.)
                        console.warn(`Geolocation Error: ${error.message}`);
                        showLocError("Location access denied or failed. Please enter address manually.");
                    },
                    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
                );
            });

            function showLocError(msg) {
                locStatus.innerHTML = `<i data-lucide="alert-circle"></i> ${msg}`;
                locStatus.className = 'location-status status-error';
                getLocBtn.disabled = false;
                manualLocGroup.style.display = 'block';
                locProvidedFlag.value = 'false';
                lucide.createIcons();
            }


            /* --- Form Validation & Submission --- */
            const form = document.getElementById('resq-form');
            const submitBtn = document.getElementById('submit-btn');
            const formContent = document.getElementById('form-content');
            const successState = document.getElementById('success-state');
            const refNumberEl = document.getElementById('reference-number');
            const reportAnotherBtn = document.getElementById('report-another-btn');
            const generalError = document.getElementById('form-general-error');
            const manualAddress = document.getElementById('manual_address');
            const phoneInput = document.getElementById('phone');

            // Indian phone validation (exactly 10 digits starting with 6-9)
            function isValidPhone(phone) {
                const cleaned = phone.replace(/\D/g, '');
                // Strict check for exactly 10 digits starting with 6, 7, 8, or 9
                return /^[6-9]\d{9}$/.test(cleaned); 
            }

            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                let isValid = true;
                generalError.style.display = 'none';

                // Reset field errors visually
                form.querySelectorAll('input, select, textarea').forEach(el => el.classList.remove('input-error'));
                form.querySelectorAll('.error-msg').forEach(el => el.style.display = 'none');

                // 1. Check Photo
                if (!photoInput.files || photoInput.files.length === 0) {
                    dropzone.classList.add('input-error');
                    photoError.style.display = 'block';
                    isValid = false;
                }

                // 2. Check Location (Must have GPS OR Manual)
                if (locProvidedFlag.value === 'false' && manualAddress.value.trim() === '') {
                    document.querySelector('.location-card').classList.add('input-error');
                    locError.style.display = 'block';
                    isValid = false;
                }

                // 3. Check Phone
                if (!isValidPhone(phoneInput.value)) {
                    phoneInput.classList.add('input-error');
                    document.getElementById('phone-error').style.display = 'block';
                    isValid = false;
                }

                // Native HTML5 validation for other required fields (Type, Problem, Desc) will kick in automatically,
                // but just in case standard checks pass but custom ones fail:
                if (!isValid) {
                    // Scroll to first error
                    const firstError = document.querySelector('.error-msg[style="display: block;"]');
                    if(firstError) firstError.parentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    return;
                }

                // --- SUBMISSION PROCESS ---
                const originalBtnText = submitBtn.innerHTML;
                submitBtn.innerHTML = '<i data-lucide="loader-2" class="lucide-spin" style="margin-right:8px;"></i> Sending Report...';
                submitBtn.disabled = true;
                lucide.createIcons();

                // Prepare FormData for Forminit
                const formData = new FormData(form);
                
                // Automatically append +91 to the number before sending
                const rawPhone = formData.get('fi-sender-phone');
                if (rawPhone) {
                    const cleanedPhone = rawPhone.replace(/\D/g, '');
                    formData.set('fi-sender-phone', '+91' + cleanedPhone);
                }

                try {
                    const { data, error } = await forminit.submit(FORM_ID, formData);

                    if (!error) {
                        // Success handling
                        formContent.style.display = 'none';
                        successState.style.display = 'block';
                        
                        // Generate random local reference number (e.g., RESQ-4821)
                        const randomNum = Math.floor(1000 + Math.random() * 9000);
                        refNumberEl.textContent = `RESQ-${randomNum}`;
                        
                        // Scroll to top of card
                        document.querySelector('.report-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
                    } else {
                        throw new Error(error.message || 'Submission failed');
                    }
                } catch (error) {
                    console.error("Submission Error:", error);
                    generalError.textContent = `Error: ${error.message || 'Something went wrong. Please check your connection and try again.'}`;
                    generalError.style.display = 'block';
                    submitBtn.innerHTML = originalBtnText;
                    submitBtn.disabled = false;
                }
            });

            /* --- Reset Form functionality --- */
            reportAnotherBtn.addEventListener('click', () => {
                form.reset();
                
                // Reset custom UI elements
                changePhotoBtn.click(); // resets photo UI
                
                getLocBtn.style.display = 'inline-flex';
                getLocBtn.disabled = false;
                locStatus.innerHTML = '';
                locStatus.className = 'location-status';
                mapsPreviewLink.style.display = 'none';
                manualLocGroup.style.display = 'none';
                locProvidedFlag.value = 'false';
                latInput.value = '';
                lngInput.value = '';
                mapsUrlInput.value = '';
                
                // Toggle sections back
                successState.style.display = 'none';
                formContent.style.display = 'block';
                submitBtn.innerHTML = '🚨 SEND RESCUE REPORT';
                submitBtn.disabled = false;
            });

        });
       
  // Register PWA Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('ServiceWorker registration successful with scope: ', registration.scope);
            })
            .catch(error => {
                console.log('ServiceWorker registration failed: ', error);
            });
    });
}