---
tags: [java, i18n, localization]
category: java
related: [java-time]
---

## Description
Localization (l10n) is adapting an application's text, numbers, currencies, and dates to a user's `Locale` without changing code. You externalize all user-facing strings into resource bundles so translators (not developers) can edit them and so the JVM can pick the right language at runtime. On the 1Z0-830 exam this area centers on three things: how a `Locale` is built, how `ResourceBundle` resolves and falls back, and which `*Format` class you choose for numbers, currency, percentages, and dates.

A `Locale` is a language plus an optional country/region (and optional variant). Since Java 19 the `Locale` constructors are **deprecated** — the exam-correct way is `Locale.of("fr", "FR")`, a predefined constant like `Locale.US`, or `new Locale.Builder()`. This remains true through Java 26.

## Examples
### Building a `Locale`
```java
Locale a = Locale.of("fr", "FR");                 // preferred factory (Java 19+)
Locale b = Locale.of("en");                       // language only
Locale c = Locale.US;                             // predefined constant
Locale d = new Locale.Builder()
        .setLanguage("de").setRegion("DE").build();
// Locale fr = new Locale("fr", "FR");  // DEPRECATED since Java 19 -- avoid on the exam
```

### Resource bundle files
```
Messages.properties          # default (no locale) -- the ultimate fallback
Messages_en.properties       # language: English
Messages_fr.properties       # language: French
Messages_fr_FR.properties    # language + country: French (France)
```
```properties
# Messages_fr_FR.properties
greeting = Bonjour
items = Vous avez {0} articles
```

### Loading a bundle and the fallback order
```java
ResourceBundle rb = ResourceBundle.getBundle("Messages", Locale.of("fr", "FR"));
String hi = rb.getString("greeting");   // "Bonjour"
// Lookup order (most specific -> least), default locale's bundles slot in between:
//   Messages_fr_FR  ->  Messages_fr  ->  (default locale variants)  ->  Messages
// A missing KEY (not just a missing file) throws MissingResourceException.
```
```java
// getBundle itself throws MissingResourceException if NO bundle at all is found:
ResourceBundle none = ResourceBundle.getBundle("DoesNotExist"); // throws
```

### Number, currency, and percent formatting
| Factory | Example (US) | Example (fr_FR) |
| --- | --- | --- |
| `NumberFormat.getInstance(loc)` | `1,234.5` | `1 234,5` |
| `NumberFormat.getCurrencyInstance(loc)` | `$1,234.50` | `1 234,50 €` |
| `NumberFormat.getPercentInstance(loc)` | `75%` | `75 %` |

```java
NumberFormat us = NumberFormat.getCurrencyInstance(Locale.US);
System.out.println(us.format(1234.5));            // $1,234.50

NumberFormat fr = NumberFormat.getCurrencyInstance(Locale.of("fr", "FR"));
System.out.println(fr.format(1234.5));            // 1 234,50 €

NumberFormat pct = NumberFormat.getPercentInstance(Locale.US);
System.out.println(pct.format(0.75));             // 75%  (note: 0.75, not 75)
```

### Locale-aware dates and parameterized strings
```java
DateTimeFormatter dtf = DateTimeFormatter
        .ofLocalizedDate(FormatStyle.LONG)
        .withLocale(Locale.of("fr", "FR"));
System.out.println(LocalDate.of(2026, 6, 19).format(dtf)); // "19 juin 2026"

// MessageFormat for placeholders pulled from a bundle:
String pattern = rb.getString("items");           // "Vous avez {0} articles"
String msg = MessageFormat.format(pattern, 5);    // "Vous avez 5 articles"
```

## Related Topics
- [[java-time]]
- Enum/constant lookups and `Locale.getDefault()`
- [[exceptions]] (`MissingResourceException` is unchecked)

## Cards

```anki
START
Basic
What's the exam-correct way to create a `Locale`, and what's deprecated?
Back: Use `Locale.of("fr", "FR")`, a constant like `Locale.US`, or `new Locale.Builder()`.<br>The `Locale` constructors (`new Locale("fr","FR")`) are DEPRECATED since Java 19.<br>A `Locale` is a language plus an optional country/region (and optional variant).
<!--ID: 1781902680228-->
END

START
Basic
In what order does `ResourceBundle` resolve a key, most to least specific?
Back: `Messages_fr_FR` -> `Messages_fr` -> (the default locale's bundles) -> `Messages` (the base, no-locale file).<br>It walks from most specific toward the base default.<br>So always provide a base `Messages.properties` as the final fallback.
<!--ID: 1781902680235-->
END

START
Basic
When does `ResourceBundle` throw `MissingResourceException`?
Back: When `getBundle` finds NO matching bundle at all, or when `getString(key)` is called for a key absent from the resolved bundle.<br>It is an UNCHECKED (runtime) exception.<br>A more specific file simply falling back to a less specific one is normal and does NOT throw.
<!--ID: 1781902680243-->
END

START
Basic
You see `getInstance`, `getCurrencyInstance`, `getPercentInstance`. What class and what do they do?
Back: `NumberFormat` — locale-aware factories for plain numbers, currency, and percentages.<br>Each takes a `Locale`, e.g. `NumberFormat.getCurrencyInstance(Locale.US)` -> `$1,234.50`.<br>Different locales change grouping, decimal separators, and currency symbols.
<!--ID: 1781902680250-->
END

START
Basic
What value do you pass to `NumberFormat.getPercentInstance().format(...)` to display 75%?
Back: Pass `0.75`, not `75`.<br>The percent formatter multiplies by 100, so `format(0.75)` -> `"75%"`.<br>Passing `75` would render `"7,500%"`.
<!--ID: 1781902680256-->
END

START
Basic
How do you make a date locale-aware, and how do you fill placeholders in a bundled message?
Back: Dates: `DateTimeFormatter.ofLocalizedDate(FormatStyle.LONG).withLocale(loc)`.<br>Placeholders: `MessageFormat.format("Vous avez {0} articles", 5)` -> `"Vous avez 5 articles"`.<br>Combine them by pulling the pattern string from the `ResourceBundle` first.
<!--ID: 1781902680262-->
END

START
Basic
Why externalize user-facing strings into resource bundles?
Back: It separates translatable content from code, so translators edit `.properties` files without touching/recompiling source.<br>The JVM auto-selects the right bundle per `Locale` at runtime.<br>One codebase then serves many languages with consistent fallback behavior.
<!--ID: 1781902680269-->
END
```

```dataviewjs
function renderCards() {
  const rendered = this.container.closest('.markdown-rendered');
  if (!rendered) return;
  const block = rendered.querySelector('code.language-anki');
  if (!block) return;
  const raw = block.innerText;
  const cards = [...raw.matchAll(/START\r?\nBasic\r?\n([\s\S]*?)(?=\r?\nEND)/g)];
  if (!cards.length) return;
  const esc = s => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  const wrap = dv.el('div', '', {cls: 'anki-cards-container'});
  block.closest('pre').replaceWith(wrap);
  cards.forEach(m => {
    const content = m[1];
    const bi = content.indexOf('\nBack:');
    if (bi === -1) return;
    const front = esc(content.slice(0, bi).trim());
    const back = esc(content.slice(bi + 6).replace(/\n<!--ID:.*?-->/g, '').trim());
    wrap.innerHTML += '<div class="anki-card">'
      + '<div class="anki-card-front">'
      + '<span class="anki-label anki-label-q">QUESTION</span>'
      + '<div class="anki-front-text">' + front + '</div>'
      + '</div>'
      + '<div class="anki-card-back">'
      + '<span class="anki-label anki-label-a">* ANSWER</span>'
      + '<div class="anki-back-text">' + back + '</div>'
      + '</div>'
      + '</div>';
  });
}

renderCards.call(this);
setTimeout(() => renderCards.call(this), 100);
setTimeout(() => renderCards.call(this), 500);
```
