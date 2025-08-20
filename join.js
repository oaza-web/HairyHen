
(function(){
  const form = document.getElementById('join-form');
  const input = document.getElementById('join-email');
  const msg = document.getElementById('join-msg');
  const exportBtn = document.getElementById('export-btn');

  const STORAGE_KEY = 'hen_emails';

  function loadList() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  }

  function saveList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function isValidEmail(v){
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }

  form?.addEventListener('submit', function(e){
    e.preventDefault();
    const email = (input?.value || '').trim();

    if(!isValidEmail(email)){
      msg.textContent = 'Zadaj platný e-mail.';
      msg.className = 'msg error';
      input?.focus();
      return;
    }

    const list = loadList();
    if(!list.includes(email)){
      list.push(email);
      saveList(list);
    }

    msg.textContent = 'Díky! Pridali sme ťa do zoznamu (dočasne lokálne).';
    msg.className = 'msg success';
    form.reset();
  });

  exportBtn?.addEventListener('click', function(){
    const list = loadList();
    if(!list.length){
      msg.textContent = 'Zatiaľ niet čo exportovať.';
      msg.className = 'msg error';
      return;
    }
    const header = 'email\n';
    const csv = header + list.join('\n');
    const blob = new Blob([csv], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'hairy_hen_emails.csv';
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    a.remove();
  });
})();
