---
tags: [java, datetime, java-time]
category: java
related: [localization]
---

## Description
The `java.time` package (JSR-310, since Java 8 and unchanged through Java 26) is the modern date/time API that replaces the legacy `java.util.Date`/`Calendar`. Every core type is **immutable and thread-safe**, so any "mutator" like `plusDays(1)` returns a *new* object and leaves the original untouched. On the exam this is the single most-tested gotcha: ignoring the return value of a `plus*`/`minus*`/`with*` call does nothing.

The types separate concerns cleanly: `LocalDate` (date, no time/zone), `LocalTime` (time, no date), `LocalDateTime` (date+time, no zone), `OffsetDateTime` (date+time + fixed UTC offset), `ZonedDateTime` (date+time + full time-zone with DST rules), and `Instant` (a point on the UTC timeline, machine timestamp). The classic exam distinction is `Period` (date-based amount: years/months/days) versus `Duration` (time-based amount: seconds/nanos) — mixing them up, or applying a `Period` to a `LocalTime`, is a common trap.

## Examples
### Core types at a glance
| Type | Holds | Has zone/offset? | Typical use |
| --- | --- | --- | --- |
| `LocalDate` | year-month-day | no | birthday, due date |
| `LocalTime` | hour-min-sec-nano | no | opening time |
| `LocalDateTime` | date + time | no | "wall clock" with no zone |
| `OffsetDateTime` | date + time + offset | offset only | timestamps with `+02:00` |
| `ZonedDateTime` | date + time + zone | full zone + DST | scheduling across zones |
| `Instant` | nanos since epoch (UTC) | implicitly UTC | logging, `System` timestamps |

### Creation: `now`, `of`, `parse`
```java
LocalDate d  = LocalDate.now();                     // current date
LocalDate d2 = LocalDate.of(2026, 6, 19);           // month is 1-based (6 == June)
LocalTime t  = LocalTime.of(13, 30);                // 13:30
LocalDateTime dt = LocalDateTime.of(d2, t);
Instant i    = Instant.now();
ZonedDateTime z = ZonedDateTime.of(dt, ZoneId.of("America/New_York"));

LocalDate parsed = LocalDate.parse("2026-06-19");   // ISO-8601 by default
// LocalDate.of(2026, 13, 1) -> throws DateTimeException (month out of range)
```

### Immutability gotcha
```java
LocalDate date = LocalDate.of(2026, 1, 31);
date.plusDays(1);                 // result DISCARDED -- date is still 2026-01-31
LocalDate next = date.plusDays(1);// correct: 2026-02-01
LocalDate eom  = LocalDate.of(2026, 1, 31).plusMonths(1); // 2026-02-28 (clamped)
```

### `Period` vs `Duration`
```java
Period p = Period.of(1, 2, 3);            // 1 year, 2 months, 3 days
LocalDate later = LocalDate.now().plus(p);

Duration dur = Duration.ofHours(2).plusMinutes(30); // PT2H30M
Instant fin = Instant.now().plus(dur);

Period span = Period.between(LocalDate.of(2026,1,1), LocalDate.of(2026,3,15));
// span -> P2M14D  (NOT total days)
long days = ChronoUnit.DAYS.between(LocalDate.of(2026,1,1), LocalDate.of(2026,3,15)); // 73
// dur.toDays() works; period.getDays() is ONLY the day component, not a total
```

### Formatting and parsing
```java
DateTimeFormatter iso = DateTimeFormatter.ISO_LOCAL_DATE;            // predefined
DateTimeFormatter f = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm");
String s = LocalDateTime.now().format(f);                           // "19/06/2026 13:30"
LocalDate back = LocalDate.parse("19/06/2026", DateTimeFormatter.ofPattern("dd/MM/yyyy"));

DateTimeFormatter localized = DateTimeFormatter
    .ofLocalizedDate(FormatStyle.FULL)
    .withLocale(Locale.of("fr", "FR"));   // locale-aware month/day names
```

### Daylight-saving and zones
```java
ZoneId ny = ZoneId.of("America/New_York");
// DST "spring forward" gap: 02:30 on 2026-03-08 does not exist; it is shifted forward.
ZonedDateTime gap = ZonedDateTime.of(2026, 3, 8, 2, 30, 0, 0, ny); // -> 03:30 EDT
// Adding across a DST boundary keeps wall-clock sane:
ZonedDateTime z = ZonedDateTime.of(2026, 3, 7, 12, 0, 0, 0, ny);
ZonedDateTime tomorrow = z.plusDays(1); // still 12:00 local, even though only 23h elapsed
```

### Bridge from legacy `Date`/`Calendar`
```java
Date legacy = new Date();
Instant inst = legacy.toInstant();                       // Date  -> Instant
Date back = Date.from(Instant.now());                    // Instant -> Date
ZonedDateTime zdt = inst.atZone(ZoneId.systemDefault());
// java.sql.Date#toInstant THROWS UnsupportedOperationException (date-only) -- a gotcha.
```

## Related Topics
- [[localization]]
- [[files-and-paths]]
- Enums and constants ([[ChronoUnit]], [[ZoneId]])

## Cards

```anki
START
Basic
What is the immutability gotcha with `java.time` methods like `plusDays`?
Back: All `java.time` types are immutable, so `plus*`/`minus*`/`with*` return a NEW object and never mutate the receiver.<br>`date.plusDays(1);` on its own does nothing — you must capture the result: `date = date.plusDays(1);`.<br>Immutability is also what makes these types thread-safe.
<!--ID: 1781902680277-->
END

START
Basic
`Period` vs `Duration`: when do you use each?
Back: `Period` is a **date-based** amount (years/months/days) — use it with `LocalDate`.<br>`Duration` is a **time-based** amount (seconds/nanos, up to hours/days) — use it with `Instant`/`LocalTime`/`LocalDateTime`.<br>Gotcha: applying a `Period` to a `LocalTime` throws, because a `LocalTime` has no date fields.
<!--ID: 1781902680284-->
END

START
Basic
You need the total number of days between two `LocalDate`s. What do you use, and what's the trap?
Back: Use `ChronoUnit.DAYS.between(start, end)` for the TOTAL count.<br>`Period.between(...).getDays()` gives only the leftover day component (e.g. `P2M14D` -> 14, not 73).<br>`ChronoUnit.between` works for any granularity (`MONTHS`, `HOURS`, etc.).
<!--ID: 1781902680291-->
END

START
Basic
Which `java.time` type should hold a date+time WITH full time-zone and DST handling?
Back: `ZonedDateTime` — it carries a `ZoneId` and applies the zone's DST rules.<br>`OffsetDateTime` only stores a fixed offset (e.g. `+02:00`) with no DST awareness.<br>`LocalDateTime` has no zone at all (a "wall clock" time).
<!--ID: 1781902680296-->
END

START
Basic
What does `ZonedDateTime` do at a DST "spring forward" gap (a non-existent local time)?
Back: It shifts the time forward by the gap, so e.g. 02:30 becomes 03:30.<br>For overlaps ("fall back"), the earlier offset is chosen by default; use `withEarlierOffsetAtOverlap()` / `withLaterOffsetAtOverlap()` to control it.<br>This is why scheduling should use `ZonedDateTime`, not `LocalDateTime`.
<!--ID: 1781902680300-->
END

START
Basic
How do you parse and format with a custom pattern in `java.time`?
Back: Build a `DateTimeFormatter.ofPattern("dd/MM/yyyy")`, then `value.format(fmt)` or `LocalDate.parse(text, fmt)`.<br>Predefined ones exist too, e.g. `DateTimeFormatter.ISO_LOCAL_DATE`.<br>`parse` without a formatter expects ISO-8601 (`2026-06-19`); a mismatched pattern throws `DateTimeParseException`.
<!--ID: 1781902680305-->
END

START
Basic
How do you bridge a legacy `java.util.Date` to `java.time`?
Back: `date.toInstant()` converts to an `Instant`; `Date.from(instant)` converts back.<br>Add a zone with `instant.atZone(ZoneId.systemDefault())`.<br>Gotcha: `java.sql.Date#toInstant()` throws `UnsupportedOperationException` because it is date-only.
<!--ID: 1781902680309-->
END

START
Basic
What's the argument trap when constructing dates with `of`?
Back: The month is 1-based, not 0-based like the old `Calendar` (`LocalDate.of(2026, 6, 19)` is June 19).<br>Out-of-range values throw `DateTimeException` (e.g. month 13).<br>Overflow on `plusMonths` is clamped to a valid day (Jan 31 + 1 month -> Feb 28/29).
<!--ID: 1781902680314-->
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
