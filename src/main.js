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
        let digit = BigInt(shifts.indexOf(base26[x]));
        let value = BigInt(26) ** BigInt(i);
        base10 = base10 + digit * value;
    };
    return base10;
};


function base10ToBase26(base10) {
    let base26 = "";
    for (let i = 25; i >= 0; i--) {
        let value = BigInt(26) ** BigInt(i);
        let digit = shifts[base10 / value];
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
        let shift = shifts.indexOf(key[25 - i]);
        let mapped_char = letters[(i + shift) % 26];
        mapping[char] = mapped_char;
    };
    return mapping;
}


function encryptText(plain_text, key) {
    // input key -> conv to b26 -> gen mapping -> map letters
    let base26 = base10ToBase26(key);
    let mapping = genMapping(base26);
    let cipher_text = mapLetters(plain_text, mapping);
    return cipher_text;
};


function decryptText(cipher_text, key) {
    // input key -> conv to b26 -> gen mapping -> invert mapping -> map letters
    let base26 = base10ToBase26(key);
    let mapping = genMapping(base26);
    mapping = invertDictionary(mapping);
    let plain_text = mapLetters(cipher_text, mapping);
    return plain_text;
};


const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const shifts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

let message = "This is a secret!";
let key = BigInt("6156119580207157310796674288400203775");
let result = encryptText(message, key);
console.log(result);
console.log(decryptText(result, key));
