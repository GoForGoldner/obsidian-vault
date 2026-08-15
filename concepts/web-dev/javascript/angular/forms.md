---
tags: [angular, web-dev, forms, signals]
category: web-dev
related: [components-and-templates, signals, inputs-outputs-model, react-events-and-forms]
---
TARGET DECK: Study::Web Dev::JavaScript::Angular

## Description
Angular has historically offered two form systems, and as of v22 a third (now stable). **Template-driven forms** use `[(ngModel)]` and directives in the HTML; they're quick for simple forms but logic and validation live in the template. **Reactive forms** build an explicit **control tree in TypeScript** — `FormControl`, `FormGroup`, `FormArray`, usually via `FormBuilder` — bound to the view with `[formGroup]` and `formControlName`; you get programmatic access, typed values, synchronous/async validators, and the `valueChanges`/`statusChanges` Observables. This has long been the recommended choice for anything non-trivial. The new **Signal Forms** (`@angular/forms/signals`, stable in v22) are a from-scratch, signal-first rethink: you start from a plain `signal()` **model object**, declare validation as a **schema** bound to field paths, and bind the view with a single `[field]` directive instead of the `formControlName`/`formGroupName`/`formArrayName` zoo. Types are **inferred from the model** (no manual generics), and a compat bridge lets you migrate field-by-field. Core concepts shared across systems: a control's **value**, its **validity** (`valid`/`errors`), and its **interaction state** — `pristine/dirty` (has the user changed it?) and `touched/untouched` (has it been focused & blurred?), which you use to show errors only after interaction.

## Examples

### Reactive form (the workhorse)
```ts
export class SignupForm {
  private fb = inject(FormBuilder);
  form = this.fb.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
  });
  submit() { if (this.form.valid) console.log(this.form.value); }
}
```
```html
<form [formGroup]="form" (ngSubmit)="submit()">
  <input formControlName="email" />
  @if (form.controls.email.touched && form.controls.email.invalid) {
    <small>Enter a valid email</small>
  }
  <button [disabled]="form.invalid">Sign up</button>
</form>
```

### Signal Forms (v22, model-first)
```ts
model = signal({ email: '', password: '' });
f = form(this.model, (path) => {
  required(path.email);  email(path.email);
  required(path.password); minLength(path.password, 8);
});
// template: <input [field]="f.email" />
```

## Related Topics
- [[components-and-templates|Components & Templates]]
- [[signals|Signals]]
- [[react-events-and-forms|React Events & Forms (comparison)]]

## Cards

```anki
START
Basic
Forms: When do you choose template-driven vs reactive forms?
Back: Template-driven ([(ngModel)] in HTML) for small/simple forms. Reactive (control tree in TypeScript) for anything non-trivial — programmatic access, typed values, complex/async validation, testability.
<!--ID: 1783445398961-->
END

START
Basic
Forms: In a reactive form, what are FormControl, FormGroup, and FormArray?
Back: FormControl = one field's value+validity. FormGroup = a keyed object of controls (a form/section). FormArray = an ordered, dynamic list of controls. You build the tree in TS, usually via FormBuilder.
<!--ID: 1783445398965-->
END

START
Basic
Forms: What's the difference between a control being `dirty` and being `touched`?
Back: dirty = the user changed its value (vs pristine). touched = the user focused then blurred it (vs untouched). Use touched to show validation errors only after interaction.
<!--ID: 1783445398970-->
END

START
Basic
Forms: How do you bind a reactive form to the template?
Back: [formGroup]="form" on the <form>, formControlName="email" on each input, and (ngSubmit)="submit()" on the form. The directives wire the view to the TS control tree.
<!--ID: 1783445398974-->
END

START
Basic
Forms: What is fundamentally new about Signal Forms (v22) vs reactive forms?
Back: They're signal-first and model-driven: you start from a signal() model, declare validation as a schema on field paths, bind with one [field] directive, and types are inferred from the model — no imperative control tree.
<!--ID: 1783445398979-->
END

START
Basic
Forms: You want to show an error message only after the user has interacted with a field. What state do you check?
Back: The control's touched (and invalid) state — e.g. `control.touched && control.invalid`. Showing errors while pristine/untouched nags the user before they've typed anything.
<!--ID: 1783445398983-->
END

START
Basic
Forms: How do you make a submit button disabled until the whole form is valid?
Back: [disabled]="form.invalid" — the FormGroup aggregates child validity, so form.valid/invalid reflects every control at once.
<!--ID: 1783445398987-->
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
