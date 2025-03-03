

export function numberToLetter(number) {
    switch (number) {
        case 11:
            return "J";
        case 12:
            return "Q";
        case 13:
            return "K";
        case 1:
            return "A";
        default:
            return number; // Return an empty string for other numbers or invalid input
    }
}