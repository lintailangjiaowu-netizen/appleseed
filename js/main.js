(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('#primary-nav');
  const setMenu = (open) => {
    if (!menuButton || !nav) return;
    menuButton.setAttribute('aria-expanded', String(open));
    menuButton.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
    nav.classList.toggle('is-open', open);
  };
  menuButton?.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') !== 'true'));
  nav?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuButton?.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuButton.focus();
    }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.site-header')) setMenu(false);
  });
  window.matchMedia('(min-width: 1061px)').addEventListener('change', (event) => {
    if (event.matches) setMenu(false);
  });
  const year = document.querySelector('#year');
  if (year) year.textContent = new Date().getFullYear();

  // Keep links to sections from the original one-page site usable.
  if (document.body.dataset.page === 'index.html') {
    const oldSections = {services:'services.html', works:'works.html', price:'pricing.html', about:'about.html', contact:'contact.html', news:'news.html', flow:'services.html#flow'};
    const destination = oldSections[location.hash.slice(1)];
    if (destination) location.replace(destination);
  }

  const form = document.querySelector('#contact-form');
  if (!form) return;
  const review = document.querySelector('#contact-review');
  const draft = document.querySelector('#mail-draft');
  const topic = document.querySelector('#contact-topic');
  const requestedTopic = new URLSearchParams(location.search).get('topic');
  if (['01','02','03','04','other'].includes(requestedTopic)) topic.value = requestedTopic;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    const data = new FormData(form);
    const selectedTopic = topic.selectedOptions[0].textContent;
    draft.value = `お名前：${String(data.get('name')).trim()}\nメールアドレス：${String(data.get('email')).trim()}\nご相談内容：${selectedTopic}\n\nお問い合わせ内容：\n${String(data.get('message')).trim()}`;
    document.querySelector('#mail-link').href = `mailto:appleseed01200@gmail.com?subject=${encodeURIComponent('appleseedへのお問い合わせ：' + selectedTopic)}&body=${encodeURIComponent(draft.value)}`;
    form.hidden = true;
    review.hidden = false;
    document.querySelector('#copy-status').textContent = '';
    document.querySelector('#review-heading').focus();
  });
  document.querySelector('#edit-message').addEventListener('click', () => {
    review.hidden = true;
    form.hidden = false;
    document.querySelector('#contact-name').focus();
  });
  document.querySelector('#copy-message').addEventListener('click', async () => {
    const status = document.querySelector('#copy-status');
    try {
      await navigator.clipboard.writeText(draft.value);
      status.textContent = '本文をコピーしました。メールに貼り付けて送信してください。';
    } catch {
      draft.focus();
      draft.select();
      status.textContent = '本文を選択しました。お使いの端末のコピー操作でコピーしてください。';
    }
  });
})();
