# Percentages

## 1. Introduction to Percentages
The term **"Percent"** simply means **"per hundred"** or **"out of every hundred"**. It is a fraction whose denominator is 100. The symbol used for percentage is `%`.
* If a student scores 80 marks out of 100, they scored 80%.
* $x\%$ means $x$ out of 100, or $\frac{x}{100}$.

### Rule 1: Converting Percentage to Fraction
To convert a percentage into a fraction, divide it by 100.
* $25\% = \frac{25}{100} = \frac{1}{4}$
* $40\% = \frac{40}{100} = \frac{2}{5}$

### Rule 2: Converting Fraction to Percentage
To convert a fraction into a percentage, multiply it by 100 and add the `%` sign.
* $\frac{3}{4} = \left(\frac{3}{4} \times 100\right)\% = 75\%$
* $\frac{1}{3} = \left(\frac{1}{3} \times 100\right)\% = 33.33\%$

---

## 2. The Most Important Shortcut: Fraction to Percentage Table
To solve placement questions rapidly, you **must** memorize these standard fraction-to-percentage conversions. This will save you from complex calculations.

| Fraction | Percentage | Fraction | Percentage |
| :--- | :--- | :--- | :--- |
| **1/2** | 50% | **1/9** | 11.11% |
| **1/3** | 33.33% | **1/10**| 10% |
| **1/4** | 25% | **1/11**| 9.09% |
| **1/5** | 20% | **1/12**| 8.33% |
| **1/6** | 16.66% | **1/13**| 7.69% |
| **1/7** | 14.28% | **1/14**| 7.14% |
| **1/8** | 12.5% | **1/15**| 6.66% |

**⚡ Application:** If a question asks for "12.5% of 640", don't do $(12.5/100) \times 640$. Directly use the fraction: $\frac{1}{8} \times 640 = 80$.

---

## 3. Percentage Increase and Decrease

### A. Concept of Base
Whenever you calculate an increase or decrease, the **initial value** is ALWAYS the base (100%).
* **Percentage Increase** = $\frac{\text{Increase Value}}{\text{Initial Value}} \times 100$
* **Percentage Decrease** = $\frac{\text{Decrease Value}}{\text{Initial Value}} \times 100$

### B. Multiplier Concept (Fast Calculation)
Instead of calculating the percentage and adding/subtracting it, use multipliers:
* If a value $X$ **increases by 20%**, the new value is $1.20 \times X$.
* If a value $X$ **decreases by 15%**, the new value is $0.85 \times X$.

---

## 4. Successive Percentages
When a number is changed by $a\%$ and then the *new* number is changed by $b\%$, it is called successive percentage change.

**Formula:** Total Percentage Change = $\left(a + b + \frac{a \times b}{100}\right)\%$

*Note: Use a positive sign (+) for increase/profit and a negative sign (-) for decrease/loss/discount.*

**Example:** A shopkeeper marks up a price by 20% and then gives a discount of 10%. What is the net change?
* Here $a = +20$, $b = -10$
* Net Change = $20 - 10 + \frac{20 \times (-10)}{100}$
* Net Change = $10 - 2 = +8\%$ (An overall increase of 8%)

---

## 5. Product Constancy (A × B = Constant)
This is a heavily tested concept in placements (e.g., Price × Consumption = Expenditure, or Speed × Time = Distance).
If the product of two variables is constant, and one variable increases by $\frac{1}{x}$, the other variable must decrease by $\frac{1}{x+1}$ to keep the product same.

**Example:** If the price of petrol increases by 25% ($\frac{1}{4}$), by what percentage should a person reduce their consumption so that the expenditure remains the same?
* **⚡ SHORTCUT:** Price increased by $\frac{1}{4}$ (here $x=4$).
* To keep expenditure constant, consumption must decrease by $\frac{1}{x+1} = \frac{1}{4+1} = \frac{1}{5}$.
* $\frac{1}{5}$ is equal to **20%**. 

---

## 6. Population and Depreciation Formulas
If the current population of a town (or value of a machine) is $P$, and it changes at a rate of $R\%$ per annum:

1. **Population after $n$ years:** $P \times \left(1 \pm \frac{R}{100}\right)^n$
2. **Population $n$ years ago:** $\frac{P}{\left(1 \pm \frac{R}{100}\right)^n}$

*(Use $+$ for growth and $-$ for depreciation/decline).*

---

## 7. Solved Placement Examples

**Q1. Two students appeared at an examination. One of them secured 9 marks more than the other and his marks was 56% of the sum of their marks. What are the marks obtained by them?**
* **Standard Method:** Let their marks be $x$ and $x + 9$.
  Sum of their marks = $x + x + 9 = 2x + 9$.
  Given: $x + 9 = \frac{56}{100} \times (2x + 9)$
  $25(x + 9) = 14(2x + 9)$ $\implies 25x + 225 = 28x + 126$ $\implies 3x = 99 \implies x = 33$.
  The marks are 33 and 42.
* **⚡ SHORTCUT:** The higher scorer got 56% of the sum. Therefore, the lower scorer got $(100\% - 56\%) = 44\%$ of the sum.
  The difference in their percentage is $56\% - 44\% = 12\%$.
  This 12% difference equals 9 marks.
  So, $1\% = \frac{9}{12} = 0.75$ marks.
  Higher marks = $56 \times 0.75 = 42$. Lower marks = $44 \times 0.75 = 33$.

**Q2. In an election between two candidates, 75% of the voters cast their thier votes, out of which 2% of the votes were declared invalid. A candidate got 9261 votes which were 75% of the total valid votes. Find the total number of voters enrolled.**
* **⚡ SHORTCUT (Chain Method):** Let total enrolled voters be $V$.
  Votes cast = $0.75 \times V$.
  Valid votes = $0.98 \times (\text{Votes cast}) = 0.98 \times 0.75 \times V$.
  Winning candidate got 75% of valid votes = $0.75 \times 0.98 \times 0.75 \times V = 9261$.
  Using fractions is easier: $\frac{3}{4} \times \frac{49}{50} \times \frac{3}{4} \times V = 9261$
  $V = \frac{9261 \times 4 \times 50 \times 4}{3 \times 49 \times 3} = 16800$.