class Key {
    constructor(base10) {
        this.base10 = base10;
        this.base26 = base10ToBase26(base10);
        this.forward_mapping = this.generateMapping(this.base26)  // plain text --> cipher text
        this.backward_mapping = invertDictionary(this.forward_mapping)  // cipher text --> plain text
    }

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


function invertDictionary(dic) {
    let new_dic = {};
    for (const key in dic) {
        new_dic[dic[key]] = key;
    };
    return new_dic;
};


const letters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"];
const base26_digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P'];

let key = new Key(BigInt("4439279952276145093251262509033952663"));
let plain_text = "abcdefghijklmnopqrstuvwxyz";
let cipher_text = key.mapLetters(plain_text, "encrypt");
console.log(cipher_text);
console.log(key.mapLetters(cipher_text, "decrypt"));