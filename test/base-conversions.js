function base26ToBase10(base26) {
    let base10 = BigInt("0");
    for (let i = 0; i < base26.length; i++) {
        let x = 25 - i;
        let digit = BigInt(shifts.indexOf(base26[x]));
        let value = BigInt(26) ** BigInt(i);
        base10 = BigInt(base10 + digit * value);
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

const shifts = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K','L', 'M', 'N', 'O', 'P'];
var base26 = "BB3F6L2K5N942KF944HOAL15O0";
console.log(base26ToBase10(base26));  // BB3F6L2K5N942KF944HOAL15O0 -> 2705942045828863551735381465367244636n

var base10 = BigInt("6156119580207157310796674288400203775");
console.log(base10ToBase26(base10));  // 6156119580207157310796674288400203775 -> PPPPPPPPPPPPPPPPPPPPPPPPPP

console.log(base10ToBase26(base26ToBase10(base26)));  // BB3F6L2K5N942KF944HOAL15O0 -> BB3F6L2K5N942KF944HOAL15O0
console.log(base26ToBase10(base10ToBase26(base10)));  // 6156119580207157310796674288400203775 -> 6156119580207157310796674288400203775n
