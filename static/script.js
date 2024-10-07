document.addEventListener('DOMContentLoaded', () => {
    let targetLanguage = 'en';
    const resultDiv = document.getElementById('result');
    const modal = document.getElementById('modal');
    const modalResult = document.getElementById('modal-result');
    const closeModal = document.getElementsByClassName('close')[0];
    const loading = document.getElementById('loading');
    const container = document.getElementById('container');
    const languageSelection = document.getElementById('language-selection');

    // Language buttons event listeners
    document.querySelectorAll('.lang-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            targetLanguage = event.target.getAttribute('data-lang');
            changeLanguage(targetLanguage);
            document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('selected'));
            event.target.classList.add('selected');
            languageSelection.style.display = 'none';
            container.style.display = 'block';
        });
    });

    // Form submission event listener
    document.getElementById('medicine-form').addEventListener('submit', async function(event) {
        event.preventDefault();

        const nameInput = document.getElementById('medicine-name').value;
        const imageInput = document.getElementById('medicine-image').files[0];

        const formData = new FormData();
        if (nameInput) {
            formData.append('medicineName', nameInput);
        }
        if (imageInput) {
            formData.append('medicineImage', imageInput);
        }
        formData.append('targetLanguage', targetLanguage);

        loading.style.display = 'flex';

        try {
            const response = await fetch('http://localhost:5000/get_medicine_details', {
                method: 'POST',
                body: formData
            });

            loading.style.display = 'none';

            if (response.ok) {
                const data = await response.json();
                let resultHtml = '';
                for (const key in data) {
                    resultHtml += `<p><strong>${key}:</strong> ${data[key]}</p>`;
                }
                modalResult.innerHTML = resultHtml;
                modal.style.display = "block";
            } else {
                resultDiv.innerHTML = `<p>Failed to retrieve medicine details.</p>`;
            }
        } catch (error) {
            loading.style.display = 'none';
            resultDiv.innerHTML = `<p>Error: ${error.message}</p>`;
        }
    });

    // Close modal event listener
    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    // Close modal if user clicks outside of the modal
    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }

    // Function to change the website language
    function changeLanguage(language) {
        const elements = document.querySelectorAll('[data-translate-key]');
        elements.forEach(element => {
            const key = element.getAttribute('data-translate-key');
            element.textContent = translations[language][key];
        });
    }

    // Example translations object
    const translations = {
        en: {
            'header': 'Medicine Information Finder',
            'name-label': 'Enter Medicine Name:',
            'image-label': 'Or Upload Medicine Image:',
            'submit-btn': 'Get Details',
        },
        te: {
            'header': 'మందుల సమాచారం ఫైండర్',
            'name-label': 'మందు పేరు నమోదు చేయండి:',
            'image-label': 'లేదా మందు చిత్రాన్ని అప్‌లోడ్ చేయండి:',
            'submit-btn': 'వివరాలు పొందండి',
        },
        hi: {
            'header': 'दवाई की जानकारी खोजने वाला',
            'name-label': 'दवा का नाम दर्ज करें:',
            'image-label': 'या दवा की छवि अपलोड करें:',
            'submit-btn': 'विवरण प्राप्त करें',
        },
        ta: {
            'header': 'மருந்து தகவல் கண்டுபிடிப்பாளர்',
            'name-label': 'மருந்து பெயரை உள்ளிடவும்:',
            'image-label': 'அல்லது மருந்து படத்தைப் பதிவேற்றவும்:',
            'submit-btn': 'விவரங்களைப் பெறுங்கள்',
        }
    };
});
