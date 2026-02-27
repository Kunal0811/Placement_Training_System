# The Ultimate Guide to Number System

The Number System is the heaviest weighted topic in quantitative aptitude for product-based and top service-based companies (TCS, Infosys, Wipro). This guide covers everything from basic digit properties to advanced remainder theorems.

---

## 1. Classification of Numbers

The universe of numbers is divided into **Real** and **Imaginary** numbers.

* **Real Numbers (R):** All numbers that can be represented on a number line.
* **Rational Numbers (Q):** Can be expressed as `p/q` where `q ≠ 0`. (e.g., `1/2`, `5`, `0.333...`)
  * **Integers (Z):** The set `{..., -2, -1, 0, 1, 2, ...}`
  * **Whole Numbers (W):** `{0, 1, 2, 3, ...}`
  * **Natural Numbers (N):** `{1, 2, 3, ...}` (Counting numbers)
* **Irrational Numbers:** Decimals are non-terminating and non-repeating. (e.g., `π`, `√2`, `e`).

### Special Integer Types
1. **Prime Numbers:** Numbers with exactly two factors: 1 and the number itself. *(Note: 1 is neither prime nor composite. 2 is the ONLY even prime number).*
2. **Composite Numbers:** Numbers with more than two factors. (e.g., 4, 6, 8, 9).
3. **Co-Prime Numbers:** Two numbers `a` and `b` are co-prime if their HCF is 1. (e.g., 8 and 15 are co-prime).
4. **Twin Primes:** Two prime numbers with a difference of 2. (e.g., 3 and 5; 11 and 13).

---

## 2. Face Value and Place Value

* **Face Value:** The actual value of the digit itself, regardless of its position.
* **Place Value (Local Value):** The value of the digit based on its position in the number.

> **Example:** In the number `84392`
> * The **Face Value** of `4` is `4`.
> * The **Place Value** of `4` is `4000` (since it is in the thousands place).

---

## 3. Exhaustive Divisibility Rules

Divisibility rules are crucial for solving complex fractions and finding remainders quickly.

| Divisor | Rule | Example |
| :--- | :--- | :--- |
| **2** | Last digit is even (0, 2, 4, 6, 8) | `4568` |
| **3** | Sum of all digits is divisible by 3 | `345` (3+4+5 = 12) |
| **4** | The last two digits form a number divisible by 4 | `897124` (24 / 4 = 6) |
| **5** | Last digit is 0 or 5 | `1995` |
| **6** | Must be divisible by both 2 and 3 | `36` |
| **8** | The last three digits form a number divisible by 8 | `185120` (120 / 8 = 15) |
| **9** | Sum of all digits is divisible by 9 | `729` (7+2+9 = 18) |
| **11** | (Sum of odd place digits) - (Sum of even place digits) = 0 or multiple of 11 | `1331` -> (1+3) - (3+1) = 0 |
| **12** | Must be divisible by co-prime factors 3 and 4 | `144` |

> **Interview Trick: The Rule of 7, 11, and 13**
> If a 3-digit number is repeated to form a 6-digit number (e.g., `593593`), it is completely divisible by 7, 11, and 13.
> *Reason:* `593593 = 593 × 1001`. The prime factorization of `1001` is `7 × 11 × 13`.

---

## 4. HCF and LCM Mastery

* **Highest Common Factor (HCF):** The largest number that exactly divides two or more numbers.
* **Least Common Multiple (LCM):** The smallest number which is exactly divisible by two or more numbers.

### Golden Properties
1. `Product of two numbers (a × b) = HCF(a, b) × LCM(a, b)`
2. Co-prime numbers have an HCF of `1`, so their LCM is simply their product `(a × b)`.

### HCF and LCM of Fractions
When dealing with fractions, use these specific formulas:
* **HCF of Fractions** = `(HCF of Numerators) / (LCM of Denominators)`
* **LCM of Fractions** = `(LCM of Numerators) / (HCF of Denominators)`

> **Solved Example:** Find the LCM of `2/3`, `4/9`, `5/6`
> * LCM of Numerators (2, 4, 5) = 20
> * HCF of Denominators (3, 9, 6) = 3
> * **Answer:** `20/3`

---

## 5. Cyclicity & Finding the Unit Digit

To find the unit digit of `X^Y`, you look at the last digit of the base and apply its **Cyclicity**.

| Base Last Digit | Power Cycle | Cyclicity Length |
| :--- | :--- | :--- |
| **0, 1, 5, 6** | Always stays the same | **1** |
| **4** | 4 (odd power), 6 (even power) | **2** |
| **9** | 9 (odd power), 1 (even power) | **2** |
| **2** | 2, 4, 8, 6 | **4** |
| **3** | 3, 9, 7, 1 | **4** |
| **7** | 7, 9, 3, 1 | **4** |
| **8** | 8, 4, 2, 6 | **4** |

### The Universal Algorithm:
1. Identify the last digit of the base.
2. Find the remainder `R` when the Power is divided by `4` (the universal cyclicity length).
3. If `R = 1, 2, or 3`, raise the base's last digit to the power of `R`.
4. If `R = 0`, raise the base's last digit to the power of `4`.

> **Solved Example:** Find the unit digit of `137^143`
> * Base ends in `7`.
> * Divide power `143` by `4`. Remainder `R = 3`.
> * Calculate `7^3 = 343`. 
> * **Answer:** The unit digit is `3`.

---

## 6. Advanced Remainder Theorems

### A. Basic Remainder Rules
* `(A + B) / N` Remainder = `(Rem(A/N) + Rem(B/N)) / N`
* `(A × B) / N` Remainder = `(Rem(A/N) × Rem(B/N)) / N`

### B. Fermat's Little Theorem
If `P` is a prime number, and `A` and `P` are co-prime, then:
**`[A^(P-1)] / P` gives a remainder of `1`.**

> **Example:** Find remainder of `2^100 / 101`
> * 101 is prime. 2 and 101 are co-prime.
> * Form matches `A^(P-1)` because `101 - 1 = 100`.
> * **Answer:** Remainder is `1`.

### C. Wilson's Theorem
If `P` is a prime number, then:
**`[(P - 1)!] / P` gives a remainder of `(P - 1)`.**

> **Example:** Find remainder of `28! / 29`
> * 29 is prime. 
> * **Answer:** Remainder is `28`.

---

## 7. Deep Factorization & Trailing Zeros

Let a number `N` be factorized as: `N = p^a × q^b × r^c` (where p, q, r are primes).

### Number of Factors
* **Total Factors:** `(a + 1)(b + 1)(c + 1)`
* **Sum of Factors:** `[(p^(a+1) - 1)/(p - 1)] × [(q^(b+1) - 1)/(q - 1)]`

### Trailing Zeros in a Factorial (Legendre's Formula)
A zero is created by multiplying `2 × 5`. In `N!`, 5s are always rarer than 2s, so we count the number of 5s.

Formula: `Count of 5s = [N/5] + [N/5^2] + [N/5^3] + ...` (Take integer part only).

> **Example:** Trailing zeros in `100!`
> * `[100/5] = 20`
> * `[100/25] = 4`
> * `[100/125] = 0` (Stop here)
> * **Answer:** `20 + 4 = 24` zeros.

---

## 8. Arithmetic & Geometric Progressions (AP & GP)

### Arithmetic Progression (A.P)
A sequence where the difference between consecutive terms is constant (`d`).
* **nth term (Tn):** `a + (n - 1)d`
* **Sum of n terms (Sn):** `(n/2) × [2a + (n - 1)d]` OR `(n/2) × (First Term + Last Term)`

### Geometric Progression (G.P)
A sequence where the ratio of consecutive terms is constant (`r`).
* **nth term (Tn):** `a × r^(n-1)`
* **Sum of n terms (Sn):** `a × [(r^n - 1) / (r - 1)]` (if r > 1)
* **Sum of infinite G.P:** `a / (1 - r)` (if |r| < 1)