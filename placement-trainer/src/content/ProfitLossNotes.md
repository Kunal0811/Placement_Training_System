# Comprehensive Guide to Profit & Loss

Profit and Loss is a core business mathematics topic. In placement interviews, companies like TCS, Infosys, and Amazon test your ability to calculate percentages mentally, understand complex discount structures, and solve trick questions regarding dishonest dealers.

---

## 1. Core Terminology

Before memorizing formulas, you must deeply understand the three pillars of transaction:

1. **Cost Price (CP):** The amount paid to purchase an article or the cost of manufacturing it. *All profit and loss percentages are calculated on CP unless explicitly stated otherwise.*
2. **Selling Price (SP):** The amount at which an article is finally sold to the customer.
3. **Marked Price (MP) / List Price:** The price printed on the tag of the article. *Discounts are ALWAYS calculated on the Marked Price.*

---

## 2. Fundamental Formulas

### Absolute Profit & Loss
* **Profit (Gain) occurs when SP > CP.**
  `Profit = SP - CP`
* **Loss occurs when CP > SP.**
  `Loss = CP - SP`

### Percentage Profit & Loss
Percentages are the standard way to compare transactions. **Always divide by CP.**
* **Profit %** = `(Profit / CP) × 100`
* **Loss %** = `(Loss / CP) × 100`

---

## 3. The Multiplier Concept (Speed Trick)

Do not use the traditional formulas `SP = CP + (Profit% of CP)` in an exam; it is too slow. Instead, use decimal multipliers.

If CP is always considered 100%:
* **20% Profit:** SP is 120% of CP. 
  👉 `SP = 1.20 × CP`
* **15% Loss:** SP is 85% of CP. 
  👉 `SP = 0.85 × CP`
* **33.33% Profit:** (Since 33.33% = 1/3 in fractions), SP is `(1 + 1/3) = 4/3` of CP.
  👉 `SP = 4/3 × CP`

> **Solved Example:** A man sells an item for ₹600 making a 20% profit. Find the CP.
> * Using multipliers: `SP = 1.20 × CP`
> * `600 = 1.2 × CP`
> * `CP = 600 / 1.2` = **₹500**.

---

## 4. Marked Price and Discount

Shopkeepers mark up the price of goods above the CP, and then offer a discount on that Marked Price (MP) to attract customers. 

* **Discount** = `MP - SP`
* **Discount %** = `(Discount / MP) × 100`  *(Notice the denominator is MP, not CP)*
* **SP using Discount** = `MP × (100 - Discount%) / 100`

### The Master Relation Formula
There is a direct relationship between CP, MP, Profit%, and Discount% that bypasses SP entirely:
**`MP / CP = (100 + Profit%) / (100 - Discount%)`**

> **Solved Example:** A shopkeeper gives a 10% discount and still makes a 20% profit. If the CP is ₹300, find the MP.
> * `MP / 300 = (100 + 20) / (100 - 10)`
> * `MP / 300 = 120 / 90`
> * `MP / 300 = 4 / 3`
> * `MP = 300 × (4/3)` = **₹400**.

---

## 5. Successive Discounts

Often, stores offer "20% + 10% Off". This does **NOT** equal a 30% discount. The second discount is applied on the remaining amount after the first discount.

### Formula for Two Successive Discounts (A% and B%)
**`Effective Discount = A + B - (A × B) / 100`**

> **Solved Example:** Find the single equivalent discount for two successive discounts of 20% and 10%.
> * `Effective Discount = 20 + 10 - (20 × 10) / 100`
> * `Effective Discount = 30 - 2` = **28%**.

*If there are three discounts, apply the formula to the first two, find the result, and apply the formula again with the third discount.*

---

## 6. The "Dishonest Dealer" (Highly Tested)

This is the most frequent trick question in placements. A shopkeeper claims to sell goods at Cost Price but uses a faulty weight (e.g., uses 900g instead of 1kg).

### Core Logic
The profit comes entirely from the goods "stolen" or "saved".
* **Error:** The amount of weight stolen (1000g - 900g = 100g).
* **True Value (Given):** The actual weight given to the customer (900g).

### The Cheat Formula
**`Profit % = [ Error / True Value Given ] × 100`**

> **Solved Example:** A dishonest dealer professes to sell his goods at cost price, but uses a weight of 960 grams for 1 kg. Find his gain %.
> * Error = `1000g - 960g = 40g`.
> * True Value Given = `960g`.
> * Profit % = `(40 / 960) × 100`
> * Profit % = `(1 / 24) × 100` = **4.16%**.

---

## 7. Special Case Shortcuts

### Special Case 1: Same SP, Same Profit/Loss %
If a person sells two similar articles at the **same Selling Price** — one at a profit of `x%` and the other at a loss of `x%` — the seller ALWAYS incurs an overall loss.

* **Overall Loss % = `(x^2) / 100`**

> **Example:** A man sells two cars for ₹99,000 each. On one, he gains 10%, and on the other, he loses 10%. What is his overall profit/loss percentage?
> * Since SPs are equal and percentages are the same (10%), it's a loss.
> * Loss % = `(10^2) / 100` = `100 / 100` = **1% Loss**.

### Special Case 2: Chain of Sales
If A sells to B at a profit of `p%`, B sells to C at a profit of `q%`, and C pays ₹X:
* **Cost Price for A = `X / [ (1 + p/100) × (1 + q/100) ]`**
*(Note: If it's a loss, change the `+` to a `-`)*

> **Example:** A sells a bicycle to B at 20% profit. B sells it to C at 25% profit. If C pays ₹1500, what did A pay for it?
> * Let A's cost be CP.
> * `CP × 1.20 × 1.25 = 1500`
> * `CP × 1.5 = 1500`
> * `CP = 1000`. A paid **₹1000**.