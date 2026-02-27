# Comprehensive Guide to Time, Speed & Distance

Time, Speed, and Distance (TSD) is a foundational topic in quantitative aptitude. It forms the basis not just for standard travel questions, but also for specific sub-topics like **Problems on Trains** and **Boats & Streams**. 

---

## 1. The Fundamental Formula

The entire topic of TSD revolves around one master equation:
**`Distance = Speed × Time`**

From this, we derive:
* `Speed = Distance / Time`
* `Time = Distance / Speed`

### Golden Rule of Units
Always ensure your units match before multiplying or dividing! You cannot mix kilometers with seconds.

* **km/hr to m/s:** Multiply by `5 / 18`
* **m/s to km/hr:** Multiply by `18 / 5`

> **Memory Trick:** > * Going from Big (km) to Small (m) -> Put the smaller number on top (`5/18`).
> * Going from Small (m) to Big (km) -> Put the bigger number on top (`18/5`).

---

## 2. Average Speed

Average speed is **NOT** the simple average of two speeds (i.e., `(S1 + S2) / 2` is WRONG). Average speed is defined strictly as Total Distance traveled divided by Total Time taken.

**Formula:** `Average Speed = (Total Distance) / (Total Time)`

### Shortcut Formulas for Average Speed
**Case 1: Same Distance, Different Speeds**
If a person travels a certain distance at speed `x`, and returns the EXACT same distance at speed `y`, the average speed for the whole journey is:
**`Average Speed = (2xy) / (x + y)`**

**Case 2: Three Equal Distances**
If a person travels three equal distances at speeds `x`, `y`, and `z`:
**`Average Speed = (3xyz) / (xy + yz + zx)`**

> **Solved Example:** A man goes from City A to B at 40 km/hr and returns at 60 km/hr. What is his average speed?
> * Since the distance is the same, use the 2xy formula.
> * Avg Speed = `(2 × 40 × 60) / (40 + 60)`
> * Avg Speed = `4800 / 100` = **48 km/hr**. *(Notice it is NOT 50!)*

---

## 3. Relative Speed

Relative speed is the speed of a moving body with respect to another moving body.

### A. Objects moving in the SAME direction
When two bodies are moving in the same direction, their relative speed is the **difference** between their individual speeds.
* `Relative Speed = | S1 - S2 |`
* Example: A thief running at 10 km/hr is chased by a cop at 12 km/hr. The cop closes the gap at a relative speed of `2 km/hr`.

### B. Objects moving in the OPPOSITE direction
When two bodies are moving towards each other (or away from each other in opposite directions), their relative speed is the **sum** of their individual speeds.
* `Relative Speed = S1 + S2`

---

## 4. The "Early / Late" Shortcut (Highly Tested)

A very common interview question involves a person changing their speed and arriving early or late.

**The Question Format:** "If a boy walks at `S1` km/hr, he is late by `T1` minutes. If he walks at `S2` km/hr, he is early by `T2` minutes. Find the distance."

**The Magic Formula:**
`Distance = [ (S1 × S2) / (S2 - S1) ] × (Total Time Difference)`

> **Solved Example:** If a student walks to school at 4 km/hr, he is 10 mins late. If he walks at 5 km/hr, he is 5 mins early. Find the distance.
> * `S1 = 4`, `S2 = 5`. Difference in speeds = `1`.
> * Total Time Difference = 10 mins late + 5 mins early = `15 mins`. (Convert to hours: `15/60 = 1/4 hr`).
> * Distance = `[ (4 × 5) / (5 - 4) ] × (1/4)`
> * Distance = `[ 20 / 1 ] × (1/4)` = **5 km**.

---

## 5. Problems on Trains

Train problems are just TSD problems where the **length of the moving object** cannot be ignored.

### Core Distance Rules for Trains
1. **Train passing a Point Object (Pole, Standing Man, Tree):**
   The total distance covered is simply the length of the train.
   `Distance = Length of Train`

2. **Train passing a Long Object (Platform, Bridge, Another Train):**
   The total distance covered is the length of the train PLUS the length of the object.
   `Distance = Length of Train + Length of Object`

> **Solved Example:** A 200m long train running at 72 km/hr crosses a platform in 20 seconds. What is the length of the platform?
> * Speed = `72 × (5/18) = 20 m/s`.
> * Time = `20 s`.
> * Total Distance = `Speed × Time` = `20 × 20 = 400m`.
> * Total Distance = `Train Length + Platform Length`
> * `400 = 200 + P`  => **Platform Length = 200m**.

---

## 6. Boats and Streams

In these problems, the medium itself (the river) is moving.
* Let speed of the boat in still water = **`u`**
* Let speed of the stream/current = **`v`**

### Downstream vs. Upstream
* **Downstream (D):** Boat goes WITH the flow of the river. 
  * `Downstream Speed (D) = u + v`
* **Upstream (U):** Boat goes AGAINST the flow of the river.
  * `Upstream Speed (U) = u - v`

### Master Formulas
If you are given the Downstream Speed (D) and Upstream Speed (U), you can instantly find `u` and `v`:
* Speed of Boat in still water **`u = (D + U) / 2`**
* Speed of Stream **`v = (D - U) / 2`**

> **Solved Example:** A man can row downstream at 14 km/hr and upstream at 8 km/hr. Find the speed of the man in still water and the speed of the current.
> * `D = 14`, `U = 8`
> * Speed of man (`u`) = `(14 + 8) / 2` = `22 / 2` = **11 km/hr**.
> * Speed of current (`v`) = `(14 - 8) / 2` = `6 / 2` = **3 km/hr**.