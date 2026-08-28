/* Small shared UI utilities used across every admin page. */

function wariToast(message, type = 'success'){
  let holder = document.getElementById('wariToastHolder');
  if (!holder){
    holder = document.createElement('div');
    holder.id = 'wariToastHolder';
    holder.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:2000;display:flex;flex-direction:column;gap:10px;';
    document.body.appendChild(holder);
  }
  const colors = { success: '#16A34A', danger: '#DC2626', warning: '#F59E0B', info: '#2563EB' };
  const icons = { success: 'bi-check-circle-fill', danger: 'bi-x-circle-fill', warning: 'bi-exclamation-triangle-fill', info: 'bi-info-circle-fill' };
  const toast = document.createElement('div');
  toast.style.cssText = `background:#fff;border-left:4px solid ${colors[type]};box-shadow:0 8px 24px rgba(30,27,75,.15);border-radius:10px;padding:12px 16px;display:flex;align-items:center;gap:10px;font-size:.85rem;min-width:240px;animation:fadeUp .25s ease;`;
  toast.innerHTML = `<i class="bi ${icons[type]}" style="color:${colors[type]};font-size:1.1rem;"></i><span>${message}</span>`;
  holder.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 2600);
}

function wariConfirmDelete(rowLabel, onConfirm){
  if (window.confirm(`Remove "${rowLabel}"? This action can be undone from the Audit Log.`)){
    onConfirm && onConfirm();
    wariToast(`${rowLabel} removed`, 'danger');
  }
}

/* Generic client-side table search: pass an <input> id and a <table> id */
function wireTableSearch(inputId, tableId){
  const input = document.getElementById(inputId);
  const table = document.getElementById(tableId);
  if (!input || !table) return;
  input.addEventListener('input', () => {
    const q = input.value.trim().toLowerCase();
    table.querySelectorAll('tbody tr').forEach(row => {
      row.style.display = row.textContent.toLowerCase().includes(q) ? '' : 'none';
    });
  });
}
