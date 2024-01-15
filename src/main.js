function invertDictionary(dic) {
    let new_dic = {};
    for (const key in dic) {
        new_dic[dic[key]] = key;
    };
    return new_dic;
};


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


function mapLetters(message, mapping) {
    let start = message.toUpperCase();
    let result = "";
    for (const char of start) {
        if (char in mapping) {
            result = result + mapping[char];
        } else {
            result = result + char;
        };
    };
    return result
};


function generateMapping(base26) {
    let mapping = {};
    for (let i = 0; i < 26; i++) {
        let char = letters[i];
        let shift = base26_digits.indexOf(base26[i]);
        let mapped_char = letters[(i + shift) % 26];
        mapping[char] = mapped_char;
    };
    return mapping;
}


function encryptText() {
    // input key -> conv to b26 -> gen mapping -> map letters
    let data = document.getElementById("encrypt_data");
    let plain_text = data.elements[1].value;
    let key = BigInt(data.elements[0].value);
    let base26 = base10ToBase26(key);
    let mapping = generateMapping(base26);
    let cipher_text = mapLetters(plain_text, mapping);
    document.getElementById("encrypt_result").innerHTML = cipher_text;
};


function decryptText() {
    // input key -> conv to b26 -> gen mapping -> invert mapping -> map letters
    let data = document.getElementById("decrypt_data");
    let cipher_text = data.elements[1].value;
    let key = BigInt(data.elements[0].value);
    let base26 = base10ToBase26(key);
    let mapping = generateMapping(base26);
    mapping = invertDictionary(mapping);
    let plain_text = mapLetters(cipher_text, mapping);
    document.getElementById("decrypt_result").innerHTML = plain_text;
};


function validateKey() {
    let data = document.getElementById("validate_keys");
    let key = BigInt(data.elements[0].value);
    let base26 = base10ToBase26(key);
    let valid = testKey(base26);
    if (valid == true) {
        let mapping = generateMapping(base26);
        document.getElementById("letter_mapping").innerHTML = "Encrypted: " + Object.values(mapping);
    };
};


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


const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const base26_digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];
