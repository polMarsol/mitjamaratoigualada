// Validació genèrica de formularis [data-form]: regles a data-rule (required|email|min:N|age|checked|group).
// Estats d'enviament simulats (prototip sense backend). Antispam: honeypot + temps mínim d'emplenament.
document.querySelectorAll<HTMLFormElement>('form[data-form]').forEach((form) => {
  const msgs = JSON.parse(form.dataset.msgs || '{}');
  const opened = Date.now();
  const status = form.querySelector<HTMLElement>('[data-status]')!, btn = form.querySelector<HTMLButtonElement>('[type=submit]')!;
  const fields = [...form.querySelectorAll<HTMLElement>('[data-rule]')];

  const error = (el: HTMLElement): string => {
    const rule = el.dataset.rule!, i = el as HTMLInputElement, v = (i.value ?? '').trim();
    if (rule === 'checked') return i.checked ? '' : msgs.consent;
    if (rule === 'group') return el.querySelector('input:checked') ? '' : msgs.roles;
    if (!v) return msgs.required;
    if (rule === 'email') return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? '' : msgs.email;
    if (rule === 'age') return Number(v) >= 16 ? '' : msgs.age;
    if (rule.startsWith('min:')) return v.length >= Number(rule.slice(4)) ? '' : msgs.short;
    return '';
  };
  const check = (el: HTMLElement) => {
    const err = error(el);
    const out = form.querySelector<HTMLElement>(`#${el.id}-e`); if (out) out.textContent = err;
    el.setAttribute('aria-invalid', String(!!err));
    return !err;
  };
  fields.forEach((el) => {
    el.addEventListener('blur', () => el.dataset.rule !== 'group' && check(el), true);
    el.addEventListener('input', () => el.getAttribute('aria-invalid') === 'true' && check(el));
    el.addEventListener('change', () => el.getAttribute('aria-invalid') === 'true' && check(el));
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    status.textContent = ''; status.style.color = '';
    const ok = fields.map(check).every(Boolean);
    if (!ok) {
      form.classList.remove('shake'); void form.offsetWidth; form.classList.add('shake');
      (form.querySelector('[aria-invalid=true]') as HTMLElement)?.focus?.(); return;
    }
    const bot = (form.elements.namedItem('website') as HTMLInputElement)?.value !== '' || Date.now() - opened < 3000;
    btn.disabled = true; const label = btn.textContent; btn.textContent = msgs.sending;
    await new Promise((r) => setTimeout(r, 900)); // simulació de xarxa
    btn.disabled = false; btn.textContent = label;
    status.style.color = 'var(--green)'; status.textContent = msgs.ok;
    if (!bot) form.reset();
  });
});
