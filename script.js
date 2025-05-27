document.addEventListener('DOMContentLoaded', () => {
    // Tab switching functionality
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const downloadBtn = document.getElementById('download-btn');
    const obfuscateBtn = document.getElementById('obfuscate-btn');
    const jsCodeTextarea = document.getElementById('js-code');
    const jsFileInput = document.getElementById('js-file');
    const obfuscatedCodeTextarea = document.getElementById('obfuscated-code');

    // Tab switching
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const tabId = btn.dataset.tab;
            
            // Update active tab button
            tabBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Show corresponding content
            tabContents.forEach(content => {
                content.classList.add('hidden');
                if (content.id === `${tabId}-input`) {
                    content.classList.remove('hidden');
                }
            });
        });
    });

    // Obfuscation function
    async function obfuscateCode(code) {
        try {
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer A2zxN5JCkfUgU4akmYmwvBuc9B92pufU0UmSijHG',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    prompt: `Obfuscate this JavaScript code while maintaining its functionality:\n\n${code}`,
                    max_tokens: 1000,
                    temperature: 0.7,
                    k: 0,
                    stop_sequences: [],
                    return_likelihoods: 'NONE'
                })
            });

            const data = await response.json();
            return data.generations[0].text;
        } catch (error) {
            console.error('Error during obfuscation:', error);
            return 'Error during obfuscation. Please try again.';
        }
    }

    // Handle obfuscation button click
    obfuscateBtn.addEventListener('click', async () => {
        let code = '';
        
        // Get code from either textarea or file
        if (document.querySelector('.tab-btn.active').dataset.tab === 'text') {
            code = jsCodeTextarea.value;
        } else {
            const file = jsFileInput.files[0];
            if (file) {
                code = await file.text();
            }
        }

        if (!code) {
            alert('Please enter or upload JavaScript code first.');
            return;
        }

        // Show loading state
        obfuscateBtn.disabled = true;
        obfuscateBtn.textContent = 'Obfuscating...';

        // Perform obfuscation
        const obfuscatedCode = await obfuscateCode(code);
        obfuscatedCodeTextarea.value = obfuscatedCode;
        downloadBtn.classList.remove('hidden');

        // Reset button state
        obfuscateBtn.disabled = false;
        obfuscateBtn.textContent = 'Obfuscate';
    });

    // Handle download button click
    downloadBtn.addEventListener('click', () => {
        const obfuscatedCode = obfuscatedCodeTextarea.value;
        const blob = new Blob([obfuscatedCode], { type: 'text/javascript' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'obfuscated.js';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });
}); 