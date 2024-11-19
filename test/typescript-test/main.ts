class KeyTS {
    public base10: bigint;
    private base26: string;
    private forward_mapping: object;
    private backward_mapping: object;
    constructor(base10: bigint) {
        this.base10 = base10;
        this.base26 = base10ToBase26TS(base10);
        this.forward_mapping = this.generateMapping(this.base26)  // plain text --> cipher text
        this.backward_mapping = invertDictionaryTS(this.forward_mapping)  // cipher text --> plain text
    }

    /**
     * Generates the forward letter mapping from the base-26 representation of the key
     * @param base26 The base-26 representation of the key
     * @returns The forward mapping
     */
    generateMapping(base26: string): object {
        let mapping: object = {};
        for (let i = 0; i < 26; i++) {
            let char: string = lettersTS[i];
            let shift: number = base26_digitsTS.indexOf(base26[i]);
            let mapped_char: string = lettersTS[(i + shift) % 26];
            mapping[char] = mapped_char;
        };
        return mapping;
    }

    /**
     * Maps the letters using the forward / backward mapping based on the mode: `true` to encrypt and `false` to decrypt
     * @param text The text to be encrypted / decrypted
     * @param encrypt Boolean for if the text is to be encrypted
     * @returns The encrypted / decrypted text
     */
    mapLetters(text: string, encrypt: boolean): string {
        let start: string = text.toUpperCase();
        let result: string = "";
        if (encrypt == true) {
            for (let char of start) {
                if (char in this.forward_mapping) {
                    result = result + this.forward_mapping[char];
                } else {
                    result = result + char;
                };
            };
        }
        else {
            for (let char of start) {
                if (char in this.backward_mapping) {
                    result = result + this.backward_mapping[char];
                } else {
                    result = result + char;
                };
            };
        }
        return result
    }

    /**
     * Get method for base-26 representation of key
     * @returns The base-26 representation of the key
     */
    getBase26(): string {
        return this.base26
    }
}


/**
 * Swaps the key-value pairs in a dictionary
 * @param dic The original dictionary
 * @returns The inverted dictionary
 */
function invertDictionaryTS(dic: object): object {
    let new_dic: object = {};
    for (const key in dic) {
        new_dic[dic[key]] = key;
    };
    return new_dic;
};


/**
 * Converts a number form base-26 to decimal
 * @param base26 The base-26 representation of the number
 * @returns The decimal representation of the number
 */
function base26ToBase10TS(base26: string): bigint {
    let base10: bigint = BigInt("0");
    for (let i = 0; i < base26.length; i++) {
        let x: number = 25 - i;
        let digit: bigint = BigInt(base26_digitsTS.indexOf(base26[x]));
        let value: bigint = BigInt(26) ** BigInt(i);
        base10 = base10 + digit * value;
    };
    return base10;
};


/**
 * Converts a number from decimal to base-26
 * @param base10 The decimal representation of the number
 * @returns The base-26 representation of the number
 */
function base10ToBase26TS(base10: bigint): string {
    let base26: string = "";
    for (let i = 25; i >= 0; i--) {
        let value: bigint = BigInt(26) ** BigInt(i);
        let digit = base26_digitsTS[Number(base10 / value)];
        base10 = base10 % value;
        base26 = base26 + digit;
    };
    return base26
};


/**
 * Encrypts a text input using a key input and displays the cipher text in the DOM
 */
function encryptTextTS() {
    // input key -> convert to b26 -> gen mapping -> map letters
    let data = document.getElementById("encrypt_data");
    let plain_text = data.elements[1].value;
    let key = new KeyTS(BigInt(data.elements[0].value));
    // Check if the key is valid
    let valid = testKeyTS(key.getBase26());
    if (valid == true) {
        let cipher_text = key.mapLetters(plain_text, true);
        document.getElementById("encrypt_result").innerHTML = cipher_text;
    } else {
        alert("Key is invalid")
    };
};


/**
 * Decrypts a text input using a key input and displays the plain text in the DOM
 */
function decryptTextTS() {
    // input key -> convert to b26 -> gen mapping -> invert mapping -> map letters
    let data = document.getElementById("decrypt_data");
    let cipher_text = data.elements[1].value;
    let key = new KeyTS(BigInt(data.elements[0].value));
    let valid = testKey(key.getBase26());
    // Check if the key is valid
    if (valid == true) {
        let plain_text = key.mapLetters(cipher_text, false);
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
function validateKeyTS() {
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
 * Tests if a key generates a unique mapping for each letter
 * @param base26 The base-26 representation of the key
 * @returns Boolean value for if the key is valid
 */
function testKeyTS(base26: string): boolean {
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
 * Generates a random key
 */
function generateRandomKeyTS() {
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
    key = String(base26ToBase10(key));
    document.getElementById("random_key").innerHTML = key;
};


/**
 * Generates a key from a known mapping
 */
function generateKeyTS() {
    let data = document.getElementById("generate_key");
    let mapped_letters = data.elements[0].value.split(",");
    let valid = validateMapping(mapped_letters);
    if (valid == false) {  // If the mapping is not valid
        document.getElementById("known_key").innerHTML = "";
    };
    let base26 = "";
    for (i = 0; i < 26; i++) {
        let shift = (letters.indexOf(mapped_letters[i]) - i + 26) % 26;  // Calculates how many spaces right the letter is shifted
        let digit = base26_digits[shift];  // Finds the base26 equivalent of shift
        base26 = base26 + digit;  // Adds the next digit
    };
    let key = base26ToBase10(base26);
    document.getElementById("known_key").innerHTML = String(key);
};


/**
 * Validates the key creates mapping with all letters unique
 * @param mapped_letters 
 * @returns 
 */
function validateMappingTS(mapped_letters: Array<string>): boolean {
    let letter_set = new Set(letters);  // Creates a set from the list letters
    let mapping_set = new Set(mapped_letters)  // Creates a set from the list mapped_letters
    const eqSet = (xs: Set<string>, ys: Set<string>): boolean =>
        xs.size === ys.size &&
        [...xs].every((x) => ys.has(x));
    return eqSet(letter_set, mapping_set) // Checks if the mapping contains 26 unique items
};


const lettersTS: Array<string> = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const base26_digitsTS: Array<string> = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];


