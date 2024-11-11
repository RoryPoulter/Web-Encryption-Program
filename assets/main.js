/**
 * Key class used to encrypt / decrypt text by generating a letter mapping
 */
class Key {
    /**
     * Constructor method
     * @param {BigInt} base10 The decimal representation of the key
     */
    constructor(base10) {
        this.base10 = base10;
        this.base26 = base10ToBase26(base10);
        this.forward_mapping = this.generateMapping(this.base26)  // plain text --> cipher text
        this.backward_mapping = invertDictionary(this.forward_mapping)  // cipher text --> plain text
    }

    /**
     * Generates a dictionary with key:value pairs for the original and mapped letters
     * @param {String} base26 The base-26 representation of the key
     * @returns {Object} The forward mapping of the letters
     */
    generateMapping(base26) {
        let mapping = {};
        for (let i = 0; i < 26; i++) {
            let char = letters[i];
            let shift = base26_digits.indexOf(base26[i]);
            let mapped_char = letters[(i + shift) % 26];
            mapping[char] = mapped_char;
        };
        return mapping;
    }

    /**
     * Takes a text input and uses the forward / backward mapping depending on the mode
     * @param {String} text The text to be encrypted / decrypted
     * @param {String} mode If the text is to be encrypted or decrypted; discrete values of `'encrypt'` or `'decrypt'`
     * @returns {String} The mapped text
     */
    mapLetters(text, mode) {
        let start = text.toUpperCase();
        let result = "";
        if (mode == "encrypt") {
            for (const char of start) {
                if (char in this.forward_mapping) {
                    result = result + this.forward_mapping[char];
                } else {
                    result = result + char;
                };
            };
        }
        else if (mode == "decrypt") {
            for (const char of start) {
                if (char in this.backward_mapping) {
                    result = result + this.backward_mapping[char];
                } else {
                    result = result + char;
                };
            };
        }
        return result
    }
}


/**
 * Swaps the key-value pairs in a dictionary
 * @param {Object} dic The original dictionary
 * @returns {Object} The inverted dictionary
 */
function invertDictionary(dic) {
    let new_dic = {};
    for (const key in dic) {
        new_dic[dic[key]] = key;
    };
    return new_dic;
};


/**
 * Converts a base-26 number to decimal
 * @param {String} base26 The base-26 representation of the number
 * @returns {BigInt} The decimal representation of the number
 */
function base26ToBase10(base26) {
    let base10 = BigInt("0");
    for (let i = 0; i < base26.length; i++) {
        let x = 25 - i;
        let digit = BigInt(base26_digits.indexOf(base26[x]));
        let value = BigInt(26) ** BigInt(i);
        base10 = base10 + digit * value;
    };
    return base10;
};


/**
 * Converts a decimal number to base-26
 * @param {BigInt} base10 The decimal representation of the number
 * @returns {String} The base-26 representation of the number
 */
function base10ToBase26(base10) {
    let base26 = "";
    for (let i = 25; i >= 0; i--) {
        let value = BigInt(26) ** BigInt(i);
        let digit = base26_digits[base10 / value];
        base10 = base10 % value;
        base26 = base26 + digit;
    };
    return base26
};


/**
 * Encrypts a text input using a key input and displays the cipher text in the DOM
 */
function encryptText() {
    // input key -> convert to b26 -> gen mapping -> map letters
    let data = document.getElementById("encrypt_data");
    let plain_text = data.elements[1].value;
    let key = new Key(BigInt(data.elements[0].value));
    // Check if the key is valid
    let valid = testKey(key.base26);
    if (valid == true) {
        let cipher_text = key.mapLetters(plain_text, "encrypt");
        document.getElementById("encrypt_result").innerHTML = cipher_text;
    } else {
        alert("Key is invalid")
    };
};


/**
 * Decrypts a text input using a key input and displays the plain text in the DOM
 */
function decryptText() {
    // input key -> convert to b26 -> gen mapping -> invert mapping -> map letters
    let data = document.getElementById("decrypt_data");
    let cipher_text = data.elements[1].value;
    let key = new Key(BigInt(data.elements[0].value));
    let valid = testKey(key.base26);
    // Check if the key is valid
    if (valid == true) {
        let plain_text = key.mapLetters(cipher_text, "decrypt");
        document.getElementById("decrypt_result").innerHTML = plain_text;
    } else {
        alert("Key is invalid");
    };
    
};


/**
 * Checks if a key is valid and outputs the result.
 *  If valid, outputs the letter mapping
 *  If invalid, alerts the user
 */
function validateKey() {
    let data = document.getElementById("validate_keys");
    let key = new Key(BigInt(data.elements[0].value));
    let valid = testKey(key.base26);
    if (valid == true) {
        document.getElementById("letter_mapping").innerHTML = "Encrypted: " + Object.values(key.forward_mapping);
    } else{
        alert("Key is invalid")
    };
};


/**
 * Checks if the key maps each letter to a unique letter
 * @param {String} base26 The base-26 representation of the key
 * @returns {Boolean} If the key is valid
 */
function testKey(base26) {
    let new_positions = new Set();

    for (let i = 0; i < 26; i++) {
        let shift = (base26_digits.indexOf(base26[i]) + i) % 26;
        if (new_positions.has(shift)) {
            return false;
        } else {
            new_positions.add(shift);
        };
    };
    return true;
};


/**
 * Generates a random, valid key and outputs to the DOM
 */
function generateRandomKey() {
    let key = "";
    let new_positions = new Set();
    let count = 0;
    while (key.length < 26) {
        let random_number = Math.floor(Math.random() * 26);
        let character_shift = base26_digits[random_number];
        let new_position = (base26_digits.indexOf(character_shift) + count) % 26;
        if (new_positions.has(new_position) == false) {
            key = key + character_shift;
            new_positions.add(new_position);
            count = count + 1;
        };
    };
    key = base26ToBase10(key);
    document.getElementById("random_key").innerHTML = key;
};


/**
 * Generates a key from a mapping input.
 * Mapping input in the form: A,B,C,...,X,Y,Z
 */
function generateKey() {
    let data = document.getElementById("generate_key");
    let mapped_letters = data.elements[0].value.split(",");
    let valid = validateMapping(mapped_letters);
    if (valid == false) {  // If the mapping is not valid
        document.getElementById("known_key").innerHTML = -1;
    };
    let base26 = "";
    for (i = 0; i < 26; i++) {
        let shift = (letters.indexOf(mapped_letters[i]) - i + 26) % 26;  // Calculates how many spaces right the letter is shifted
        let digit = base26_digits[shift];  // Finds the base26 equivalent of shift
        base26 = base26 + digit;  // Adds the next digit
    };
    let key = base26ToBase10(base26);
    document.getElementById("known_key").innerHTML = key;
//    return base26;  // Returns the base26 representation of the key
};


/**
 * checks if a mapping is valid
 * @param {Array} mapped_letters The mapping input
 * @returns {Boolean} If the mapping is valid
 */
function validateMapping(mapped_letters) {
    let letter_set = new Set(letters);  // Creates a set from the list letters
    let mapping_set = new Set(mapped_letters)  // Creates a set from the list mapped_letters
    const eqSet = (xs, ys) =>
        xs.size === ys.size &&
        [...xs].every((x) => ys.has(x));
    return eqSet(letter_set, mapping_set) // Checks if the mapping contains 26 unique items
};


const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const base26_digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
