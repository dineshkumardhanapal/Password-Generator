// script.js

// Get DOM elements
const passwordDisplay = document.getElementById('passwordDisplay');
const lengthSlider = document.getElementById('lengthSlider');
const lengthValueSpan = document.getElementById('lengthValue');
const includeUppercaseCheckbox = document.getElementById('includeUppercase');
const includeLowercaseCheckbox = document.getElementById('includeLowercase');
const includeNumbersCheckbox = document.getElementById('includeNumbers');
const includeSymbolsCheckbox = document.getElementById('includeSymbols');
const generateButton = document.getElementById('generateButton');
const copyButton = document.getElementById('copyButton');
const messageDisplay = document.getElementById('messageDisplay');

// Character sets
const lowercaseChars = 'abcdefghijklmnopqrstuvwxyz';
const uppercaseChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const numberChars = '0123456789';
const symbolChars = '!@#$%^&*()-_+=[]{}|;:,.<>?';

/**
 * Generates a random password based on selected criteria.
 * Ensures at least one character from each selected category is included.
 */
function generatePassword() {
    let allChars = ''; // Pool of characters to choose from
    let generatedPassword = []; // Array to build the password character by character
    let requiredChars = []; // Characters required from each selected category

    // Get current settings
    const length = parseInt(lengthSlider.value);
    const includeUppercase = includeUppercaseCheckbox.checked;
    const includeLowercase = includeLowercaseCheckbox.checked;
    const includeNumbers = includeNumbersCheckbox.checked;
    const includeSymbols = includeSymbolsCheckbox.checked;

    // Build the pool of characters and add required characters
    if (includeLowercase) {
        allChars += lowercaseChars;
        requiredChars.push(lowercaseChars[Math.floor(Math.random() * lowercaseChars.length)]);
    }
    if (includeUppercase) {
        allChars += uppercaseChars;
        requiredChars.push(uppercaseChars[Math.floor(Math.random() * uppercaseChars.length)]);
    }
    if (includeNumbers) {
        allChars += numberChars;
        requiredChars.push(numberChars[Math.floor(Math.random() * numberChars.length)]);
    }
    if (includeSymbols) {
        allChars += symbolChars;
        requiredChars.push(symbolChars[Math.floor(Math.random() * symbolChars.length)]);
    }

    // If no character types are selected, display message and return
    if (allChars.length === 0) {
        passwordDisplay.value = '';
        displayMessage('Please select at least one character type.');
        return;
    } else {
        displayMessage(''); // Clear message if types are selected
    }

    // Ensure the password length is at least the number of required character types
    const effectiveLength = Math.max(length, requiredChars.length);

    // Add required characters to the generated password array
    generatedPassword = [...requiredChars];

    // Fill the remaining length with random characters from the combined pool
    // Use window.crypto.getRandomValues for cryptographically strong random values
    const remainingLength = effectiveLength - requiredChars.length;
    const randomBytes = new Uint32Array(remainingLength);
    window.crypto.getRandomValues(randomBytes);

    for (let i = 0; i < remainingLength; i++) {
        const randomIndex = randomBytes[i] % allChars.length;
        generatedPassword.push(allChars[randomIndex]);
    }

    // Shuffle the generated password array to mix the required characters
    for (let i = generatedPassword.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [generatedPassword[i], generatedPassword[j]] = [generatedPassword[j], generatedPassword[i]];
    }

    // Set the final password in the display
    passwordDisplay.value = generatedPassword.join('');
}

/**
 * Handles copying the generated password to the clipboard.
 */
function copyToClipboard() {
    // Check if there's a password to copy
    if (passwordDisplay.value === '') {
        displayMessage('No password to copy!');
        return;
    }

    // Select the text in the input field
    passwordDisplay.select();
    passwordDisplay.setSelectionRange(0, 99999); // For mobile devices

    try {
        document.execCommand('copy'); // Execute the copy command
        displayMessage('Copied to clipboard!'); // Display success message
    } catch (err) {
        console.error('Failed to copy password:', err);
        displayMessage('Failed to copy. Please copy manually.'); // Display error message
    }
}

/**
 * Displays a temporary message to the user.
 * @param {string} msg - The message to display.
 */
function displayMessage(msg) {
    messageDisplay.textContent = msg;
    if (msg) {
        // Clear the message after a short delay if it's not an empty string
        setTimeout(() => {
            messageDisplay.textContent = '';
        }, 2000); // Message disappears after 2 seconds
    }
}

// Event Listeners
window.onload = function() {
    // Update length value display when slider moves
    lengthSlider.addEventListener('input', () => {
        lengthValueSpan.textContent = lengthSlider.value;
        generatePassword(); // Regenerate password instantly on length change
    });

    // Regenerate password when any checkbox changes
    includeUppercaseCheckbox.addEventListener('change', generatePassword);
    includeLowercaseCheckbox.addEventListener('change', generatePassword);
    includeNumbersCheckbox.addEventListener('change', generatePassword);
    includeSymbolsCheckbox.addEventListener('change', generatePassword);

    // Generate new password on button click
    generateButton.addEventListener('click', generatePassword);

    // Copy password to clipboard on button click
    copyButton.addEventListener('click', copyToClipboard);

    // Initial password generation on page load
    generatePassword();
};
