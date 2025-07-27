---
title: "Basic Logic Operations: AND, OR, NOT"
description: "Explore the three essential Boolean operations, AND, OR, and NOT, that form the core of boolean expressions."
minutesDuration: 20
difficulty: Beginner
order: 3
---

In Boolean Algebra, the power to manipulate truth values comes from the fundamental operations: **AND**, **OR**, and **NOT**. 
These operations allow us to combine and modify boolean values to create more complex logic. Whether you're designing 
a circuit, writing a program, or just solving logic puzzles, these basic operations will be your go-to tools. In this 
lesson, we’ll break down each operation, explore how they work with truth tables, and look at real-world examples where 
they are applied.

## Introduction 

Boolean operations are the heart of Boolean Algebra — they’re the building blocks used to create complex expressions, 
solve logical problems, and design digital systems. The three primary operations in Boolean Algebra are **AND**, **OR**, and **NOT**. 
Each operation has distinct rules and behaviors, allowing us to combine and manipulate truth values (True/False or 1/0)
in meaningful ways.

* The **AND** operation checks if multiple conditions are true at the same time.
* The **OR** operation checks if at least one of multiple conditions is true.
* The **NOT** operation inverts a condition, changing true to false and vice versa.

These operations are crucial for creating logic circuits, programming conditional statements, building search filters, 
and many other real-world applications. Understanding how each of these works will lay the foundation for more advanced 
concepts, including logic gates, simplification of Boolean expressions, and digital circuit design.

## The AND Operation

The **AND** operation is one of the most fundamental logical tools in Boolean Algebra. It takes **two inputs** and 
returns **true only if both inputs are true**. If either input is false — or both are false — the result is false.

In Boolean expressions, the AND operation is often represented in one of the following ways:

* `A AND B`
* `A ∧ B`
* `A · B` (dot notation)
* Or simply `AB`

All of these mean the same thing: both `A` and `B` must be true for the result to be true.

| A | B | A AND B |
| - | - | ------- |
| 0 | 0 | 0       |
| 0 | 1 | 0       |
| 1 | 0 | 0       |
| 1 | 1 | 1       |

This table shows all possible combinations of two boolean inputs, `A` and `B`, and the result of applying the 
AND operation.

### Example

Let’s say we have two Boolean variables:

`isRaining = 1` (true)

`haveUmbrella = 1` (true)

We can write a logic expression:

`stayDry = isRaining AND haveUmbrella`

This means: you’ll stay dry **only if** it’s raining, **and** you have an umbrella.
If you forget your umbrella (0), or it’s not raining (0), you won’t stay dry (0).

## The OR Operation

The **OR** operation is another key element of boolean logic. It evaluates **two inputs** and returns 
**true if at least one input is true**. It only returns **false if both inputs are false**.

In boolean expressions, the OR operation is commonly written as:

* `A OR B`
* `A ∨ B`
* `A + B` (plus notation, not arithmetic addition)

No matter how it’s written, the logic is the same: if either `A` or `B` (or both) are true, the result is true.

| A | B | A OR B |
| - | - | ------ |
| 0 | 0 | 0      |
| 0 | 1 | 1      |
| 1 | 0 | 1      |
| 1 | 1 | 1      |

The truth table above shows that the only time OR gives a false result is when both **inputs are false**.

### Example

Let’s say:

`hasKeycard = 1 (true)`
`knowsPassword = 0 (false)`

We write the expression:

`canAccess = hasKeycard OR knowsPassword`

In this case, since you have a keycard, access is granted (`1 OR 0 = 1`). You don’t need **both** credentials — 
**either one** is enough.

This kind of logic is common in **access control**, **software permissions**, and **filter settings** (e.g., "show me red OR blue items").

## The NOT Operation

The **NOT** operation is different from AND and OR because it only works on **one input**. It simply **inverts** the value:

* If the input is **true (1)**, the result is **false (0)**.
* If the input is **false (0)**, the result is **true (1)**.

In boolean expressions, NOT is written in various ways:

* `NOT A`
* `¬A`
* `!A`

As you can see in the truth table below, the NOT operation **flips the truth value**.

| A | NOT A |
| - | ----- |
| 0 | 1     |
| 1 | 0     |

### Example

Let’s say:

`isNight = 1 (true)`
`isDay = NOT isNight`

In this case, since it is night (1), then:

`isDay = NOT 1 = 0`

This kind of logic is useful when one condition is simply the **opposite** of another, like:

* Muted / Not Muted
* Enabled / Disabled
* Visible / Hidden

## Key Takeaways

* **AND** (`A AND B`): Returns true **only if both inputs are true**.
* **OR** (`A OR B`): Returns true **if at least one input is true**.
* **NOT** (`NOT A`): Inverts the value of the input — true becomes false and vice versa.
* Each operation can be represented with **truth tables**, **real-world analogies**, and is used in programming, electronics, automation, and beyond.
* Mastering these operations is essential before moving on to more advanced concepts like expression simplification, standard forms, and circuit design.