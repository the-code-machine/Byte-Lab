// Function to encrypt a string
export const encrypt = (input) => {
    let encrypted = '';
    for (let i = 0; i < input.length; i++) {
        // Get the Unicode code of the character
        const charCode = input.charCodeAt(i);
        // Add a fixed value to the Unicode code and convert it back to a character
        const encryptedChar = String.fromCharCode(charCode + 5);
        // Append the encrypted character to the result
        encrypted += encryptedChar;
    }
    return encrypted;
};

// Function to decrypt an encrypted string
export const decrypt = (input) => {
    let decrypted = '';
    for (let i = 0; i < input.length; i++) {
        // Get the Unicode code of the character
        const charCode = input.charCodeAt(i);
        // Subtract the same fixed value from the Unicode code and convert it back to a character
        const decryptedChar = String.fromCharCode(charCode - 5);
        // Append the decrypted character to the result
        decrypted += decryptedChar;
    }
    return decrypted;
};
