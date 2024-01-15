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


function genMapping(key) {
    let mapping = {};
    for (let i = 0; i < 26; i++) {
        let char = letters[i];
        let shift = base26_digits.indexOf(key[i]);
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
    let mapping = genMapping(base26);
    let cipher_text = mapLetters(plain_text, mapping);
    document.getElementById("encrypt_result").innerHTML = cipher_text;
};


function decryptText() {
    // input key -> conv to b26 -> gen mapping -> invert mapping -> map letters
    let data = document.getElementById("decrypt_data");
    let cipher_text = data.elements[1].value;
    let key = BigInt(data.elements[0].value);
    let base26 = base10ToBase26(key);
    let mapping = genMapping(base26);
    mapping = invertDictionary(mapping);
    let plain_text = mapLetters(cipher_text, mapping);
    document.getElementById("decrypt_result").innerHTML = plain_text;
};


function validateKey() {
    let data = document.getElementById("validate_keys");
    let key = BigInt(data.elements[0].value);
//    let key = BigInt("6156119580207157310796674288400203775");
    let base26 = base10ToBase26(key);
    let valid = testKey(base26);
    if (valid == true) {
        let mapping = genMapping(base26);
        let formatted_mapping = "";
        for (char in mapping) {
            formatted_mapping = formatted_mapping + char + " -> " + mapping[char] + "<br>";
        };
        document.getElementById("letter_mapping").innerHTML = formatted_mapping;
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


const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const base26_digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

//let plain_text = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
//let key = BigInt("51");
//let base26 = base10ToBase26(key);
//let mapping = genMapping(base26);
//let cipher_text = mapLetters(plain_text, mapping);
//
//validateKey();