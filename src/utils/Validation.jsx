/**
 * Validates a South African ID number with your rules + full Luhn checksum on digit 13.
 * Checks:
 * - Exactly 13 digits
 * - First 6 digits = plausible YYMMDD
 * - Digit 11 = 0 or 1 (citizenship)
 * - Digit 12 = 8
 * - Digit 13 = correct Luhn check digit
 *
 * @param {string} id - The ID number as string (e.g. "8801235111088")
 * @returns {boolean} true if fully valid
 */
export function isValidSouthAfricanID(id) {
    if (!id || id.length !== 13 || !/^\d{13}$/.test(id)) {
        return false;
    }

    // Extract parts
    const digits = id.split('').map(Number); // array of numbers: [d0, d1, ..., d12]
    const first6 = id.substring(0, 6);
    const digit11 = digits[10];
    const digit12 = digits[11];
    const checkDigit = digits[12];

    // Basic date check (YYMMDD)
    const yy = parseInt(first6.substring(0, 2), 10);
    const mm = parseInt(first6.substring(2, 4), 10);
    const dd = parseInt(first6.substring(4, 6), 10);

    if (mm < 1 || mm > 12) return false;
    if (dd < 1 || dd > 31) return false; // simplistic (no 30/31 or Feb 29 check)

    // Citizenship: 0 or 1
    if (digit11 !== 0 && digit11 !== 1) {
        return false;
    }

    // Digit 12 must be 8 (your rule)
    if (digit12 !== 8) {
        return false;
    }

    // Luhn checksum validation (standard way for SA IDs — works left-to-right or right-to-left equivalently for odd length)
    let sum = 0;

    // Process digits 1 to 12 (0-based index 0 to 11), doubling every second digit starting from the right (position 1 is odd from right)
    // But because length=13 (odd), doubling starts on position 2,4,6,... from left — same as standard right-to-left
    for (let i = 0; i < 12; i++) {
        let digit = digits[i];

        // Double every second digit from the right → for i from left: double when (12 - i) is even → i even? No → double when i is odd (0-based)
        // Simpler: double positions 1,3,5,7,9,11 from right (0-based: 1,3,5,7,9,11 from left? Wait no)
        // Standard: from right, position 1 (rightmost before check) is NOT doubled, position 2 IS doubled, etc.
        // So for full 13-digit: check digit is position 1 (right), not doubled; digit before it (position 2) is doubled.
        // In 0-based left-to-right: double when (12 - i) % 2 === 0 ? No → double when i % 2 === 1 (odd indices 1,3,5,7,9,11)

        if (i % 2 === 1) {  // 1,3,5,7,9,11 → double these
            digit *= 2;
            if (digit > 9) {
                digit -= 9;           // or digit = (digit / 10) + (digit % 10)
            }
        }

        sum += digit;
    }

    // The total sum (of processed digits 0–11) + checkDigit should be divisible by 10
    const total = sum + checkDigit;
    const isValidChecksum = total % 10 === 0;

    return isValidChecksum;
}