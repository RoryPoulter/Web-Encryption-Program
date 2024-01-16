function generateKey(mapped_letters) {
    let valid = validateMapping(mapped_letters);
    if (valid == false) {  // If the mapping is not valid
        return -1
    };
    let base26 = "";
    for (i = 0; i < 26; i++) {
        let shift = (letters.indexOf(mapped_letters[i]) - i + 26) % 26;  // Calculates how many spaces right the letter is shifted
        let digit = base26_digits[shift];  // Finds the base26 equivalent of shift
        base26 = base26 + digit;  // Adds the next digit
    };
    return base26;  // Returns the base26 representation of the key
};


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
const mapped_letters = ["W","Y","V","D","X","H","O","F","B","C","A","N","E","T","P","S","Q","K","J","Z","U","R","L","G","I","M"];
console.log(generateKey(mapped_letters))