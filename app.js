(function () {
  const pageTitles = {
    posTab: 'Point of Sale',
    analyticsTab: 'Analytics & Sales',
    employeeTab: 'Staff Attendance',
    financeTab: 'Financial Ledger'
  };

  function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toastIcon');
    const msg = document.getElementById('toastMsg');

    if (!toast || !icon || !msg) return;

    icon.className = type === 'error'
      ? 'fa-solid fa-circle-exclamation text-xl'
      : 'fa-solid fa-circle-check text-xl';

    toast.classList.remove('bg-emerald-600', 'bg-rose-600', 'translate-x-full');
    toast.classList.add(type === 'error' ? 'bg-rose-600' : 'bg-emerald-600');
    msg.textContent = message;
    toast.classList.remove('translate-x-full');

    clearTimeout(showToast.timeoutId);
    showToast.timeoutId = setTimeout(() => {
      toast.classList.add('translate-x-full');
    }, 2200);
  }

  function applyTheme(isDark) {
    document.documentElement.classList.toggle('dark', isDark);
    try {
      localStorage.setItem('bistroflowTheme', isDark ? 'dark' : 'light');
    } catch (error) {
      showToast('Theme changed, but preference could not be saved', 'error');
    }

    const themeIcon = document.getElementById('themeIcon');
    if (themeIcon) {
      themeIcon.className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
    }
  }

  const AppModule = {
    switchTab(tabId) {
      const tabs = document.querySelectorAll('.tab-content');
      tabs.forEach((tab) => {
        tab.classList.toggle('hidden', tab.id !== tabId);
      });

      const navButtons = document.querySelectorAll('.nav-btn');
      navButtons.forEach((button) => {
        const isActive = button.id === `nav-${tabId}`;
        button.classList.toggle('text-white', isActive);
        button.classList.toggle('bg-orange-600', isActive);
        button.classList.toggle('font-medium', isActive);
        button.classList.toggle('shadow-lg', isActive);
        button.classList.toggle('shadow-orange-600/30', isActive);
        button.classList.toggle('text-stone-400', !isActive);
        button.classList.toggle('hover:bg-stone-800', !isActive);
        button.classList.toggle('hover:text-white', !isActive);
        button.classList.toggle('shadow-none', !isActive);
        button.classList.toggle('bg-transparent', !isActive);
      });

      if (tabId === 'employeeTab' && typeof EmployeeModule !== 'undefined' && EmployeeModule.init) {
        EmployeeModule.init();
      }

      if (tabId === 'posTab' && typeof PosModule !== 'undefined' && PosModule.init) {
        PosModule.init();
      }

      if (tabId === 'analyticsTab' && typeof AnalyticsModule !== 'undefined' && AnalyticsModule.init) {
        AnalyticsModule.init();
      }

      if (tabId === 'financeTab' && typeof FinanceModule !== 'undefined' && FinanceModule.init) {
        FinanceModule.init();
      }

      const title = document.getElementById('pageTitle');
      if (title) {
        title.textContent = pageTitles[tabId] || 'Dashboard';
      }
    },

    toggleDarkMode() {
      applyTheme(!document.documentElement.classList.contains('dark'));
    },

    closeModal(modalId) {
      const modal = document.getElementById(modalId);
      if (modal) {
        modal.classList.add('hidden');
      }
    },

    showToast,
    setPageTitle(tabId) {
      const title = document.getElementById('pageTitle');
      if (title) {
        title.textContent = pageTitles[tabId] || 'Dashboard';
      }
    }
  };

  const DataModule = {
    exportJSON() {
      const payload = {
        exportedAt: new Date().toISOString(),
        restaurant: 'KainBrew',
        darkMode: document.documentElement.classList.contains('dark')
      };

      const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = 'bistroflow-export.json';
      anchor.click();
      URL.revokeObjectURL(url);
      showToast('Export completed successfully');
    },

    importJSON(event) {
      const file = event.target.files && event.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function () {
        try {
          const data = JSON.parse(reader.result);
          if (data.darkMode !== undefined) {
            document.documentElement.classList.toggle('dark', !!data.darkMode);
          }
          showToast('Import completed successfully');
        } catch (error) {
          showToast('Invalid JSON file', 'error');
        }
      };
      reader.readAsText(file);
    },

    resetDataToDefault() {
      const confirmed = window.confirm('Reset local demo data to default values?');
      if (!confirmed) return;

      localStorage.removeItem('bistroflowData');
      localStorage.removeItem('bistroflowSales');
      localStorage.removeItem('bistroflowExpenses');
      localStorage.removeItem('bistroflowEmployees');
      showToast('Demo data reset successfully');
      window.location.reload();
    }
  };

  const posState = {
    activeCategory: 'All',
    orderType: 'Dine-in',
    table: 'Table 01',
    cart: []
  };

  const menuItems = [
    { id: 1, name: 'Adobo Bowl', category: 'Filipino Favorites', price: 180, emoji: '🍲' },
    { id: 2, name: 'Sinigang na Baboy', category: 'Filipino Favorites', price: 220, emoji: '🍲' },
    { id: 3, name: 'Chicken BBQ', category: 'Grill & BBQ', price: 260, emoji: '🍗' },
    { id: 4, name: 'Pork Sisig', category: 'Grill & BBQ', price: 240, emoji: '🥘' },
    { id: 5, name: 'Beef Bulalo', category: 'Soup & Noodles', price: 330, emoji: '🍲' },
    { id: 6, name: 'Spicy Ramen', category: 'Soup & Noodles', price: 235, emoji: '🍜' },
    { id: 7, name: 'Halo-Halo', category: 'Desserts', price: 120, emoji: '🍧' },
    { id: 8, name: 'Leche Flan', category: 'Desserts', price: 110, emoji: '🍮' },
    { id: 9, name: 'Iced Tea', category: 'Beverages', price: 60, emoji: '🧋' },
    { id: 10, name: 'Cappuccino', category: 'Beverages', price: 95, emoji: '☕' }
  ];

  function formatCurrency(amount) {
    return `₱${Number(amount || 0).toFixed(2)}`;
  }

  const PosModule = {
    init() {
      const orderTypeSelector = document.getElementById('orderTypeSelector');
      if (orderTypeSelector) {
        orderTypeSelector.value = posState.orderType;
      }

      const tableSelector = document.getElementById('tableSelector');
      if (tableSelector) {
        tableSelector.value = posState.table;
      }

      this.renderCategoryPills();
      this.renderMenuGrid();
      this.updateCartTotals();
    },

    renderCategoryPills() {
      const categoryPills = document.getElementById('categoryPills');
      if (!categoryPills) return;

      const categories = ['All', ...new Set(menuItems.map((item) => item.category))];
      categoryPills.innerHTML = categories.map((category) => {
        const isActive = category === posState.activeCategory;
        return `
          <button type="button" data-category="${category}" class="px-3 py-2 rounded-full text-xs font-semibold transition ${isActive ? 'bg-orange-600 text-white shadow-lg shadow-orange-600/20' : 'bg-stone-100 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}">
            ${category}
          </button>
        `;
      }).join('');

      categoryPills.querySelectorAll('[data-category]').forEach((button) => {
        button.addEventListener('click', () => {
          posState.activeCategory = button.dataset.category;
          this.renderCategoryPills();
          this.renderMenuGrid();
        });
      });
    },

    renderMenuGrid() {
      const menuGrid = document.getElementById('menuGrid');
      const menuSearch = document.getElementById('menuSearch');
      if (!menuGrid) return;

      const query = (menuSearch ? menuSearch.value : '').trim().toLowerCase();
      const filteredItems = menuItems.filter((item) => {
        const categoryMatch = posState.activeCategory === 'All' || item.category === posState.activeCategory;
        const searchMatch = !query || item.name.toLowerCase().includes(query) || item.category.toLowerCase().includes(query);
        return categoryMatch && searchMatch;
      });

      if (!filteredItems.length) {
        menuGrid.innerHTML = '<div class="col-span-full rounded-2xl border border-dashed border-stone-300 dark:border-stone-700 p-6 text-center text-sm text-stone-500 dark:text-stone-400">No menu items found.</div>';
        return;
      }

      menuGrid.innerHTML = filteredItems.map((item) => `
        <button type="button" data-menu-id="${item.id}" class="group text-left bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-2xl p-3 shadow-sm hover:border-orange-300 hover:shadow-md transition">
          <div class="flex items-start justify-between gap-2">
            <div class="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/50 flex items-center justify-center text-lg">${item.emoji}</div>
            <span class="text-[10px] uppercase tracking-widest font-bold text-orange-600">${item.category}</span>
          </div>
          <h4 class="mt-3 font-bold text-sm text-stone-800 dark:text-white">${item.name}</h4>
          <div class="mt-3 flex items-center justify-between">
            <span class="text-base font-extrabold text-orange-600">${formatCurrency(item.price)}</span>
            <span class="bg-orange-600 text-white text-xs px-2 py-1 rounded-lg">Add</span>
          </div>
        </button>
      `).join('');

      menuGrid.querySelectorAll('[data-menu-id]').forEach((button) => {
        button.addEventListener('click', () => {
          this.addToCart(Number(button.dataset.menuId));
        });
      });
    },

    addToCart(menuId) {
      const item = menuItems.find((entry) => entry.id === menuId);
      if (!item) return;

      const existing = posState.cart.find((entry) => entry.id === menuId);
      if (existing) {
        existing.qty += 1;
      } else {
        posState.cart.push({ ...item, qty: 1 });
      }

      this.renderCart();
      this.updateCartTotals();
      showToast(`${item.name} added to cart`);
    },

    adjustCartItem(menuId, change) {
      const item = posState.cart.find((entry) => entry.id === menuId);
      if (!item) return;

      item.qty += change;
      if (item.qty <= 0) {
        posState.cart = posState.cart.filter((entry) => entry.id !== menuId);
      }

      this.renderCart();
      this.updateCartTotals();
    },

    renderCart() {
      const cartItemsList = document.getElementById('cartItemsList');
      if (!cartItemsList) return;

      if (!posState.cart.length) {
        cartItemsList.innerHTML = `
          <div class="flex flex-col items-center justify-center h-full min-h-[200px] text-center text-stone-400">
            <i class="fa-solid fa-basket-shopping text-3xl mb-3"></i>
            <p class="text-sm font-medium">Cart is empty</p>
            <p class="text-xs mt-1">Add items from the menu list</p>
          </div>
        `;
        return;
      }

      cartItemsList.innerHTML = posState.cart.map((item) => `
        <div class="rounded-2xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 p-3">
          <div class="flex justify-between items-start gap-3">
            <div>
              <p class="font-semibold text-sm text-stone-800 dark:text-white">${item.name}</p>
              <p class="text-xs text-stone-500 dark:text-stone-400">${formatCurrency(item.price)} each</p>
            </div>
            <span class="font-bold text-orange-600">${formatCurrency(item.price * item.qty)}</span>
          </div>
          <div class="mt-3 flex items-center justify-between">
            <div class="flex items-center gap-2 bg-white dark:bg-stone-800 rounded-lg border border-stone-200 dark:border-stone-700 px-1.5 py-1">
              <button type="button" data-cart-action="minus" data-cart-id="${item.id}" class="w-7 h-7 rounded-md bg-stone-100 dark:bg-stone-700 text-stone-700 dark:text-stone-200">−</button>
              <span class="min-w-[24px] text-center text-sm font-bold text-stone-700 dark:text-stone-100">${item.qty}</span>
              <button type="button" data-cart-action="plus" data-cart-id="${item.id}" class="w-7 h-7 rounded-md bg-orange-600 text-white">+</button>
            </div>
            <button type="button" data-cart-action="remove" data-cart-id="${item.id}" class="text-xs text-rose-500 hover:text-rose-700 font-medium">Remove</button>
          </div>
        </div>
      `).join('');

      cartItemsList.querySelectorAll('[data-cart-id]').forEach((button) => {
        button.addEventListener('click', () => {
          const menuId = Number(button.dataset.cartId);
          const action = button.dataset.cartAction;
          if (action === 'plus') this.adjustCartItem(menuId, 1);
          if (action === 'minus') this.adjustCartItem(menuId, -1);
          if (action === 'remove') this.adjustCartItem(menuId, -999);
        });
      });
    },

    updateCartTotals() {
      const subtotal = posState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      const tax = subtotal * 0.12;
      const discountPercent = Number(document.getElementById('discountSelect')?.value || 0);
      const discount = subtotal * (discountPercent / 100);
      const total = subtotal + tax - discount;

      const subtotalEl = document.getElementById('cartSubtotal');
      const taxEl = document.getElementById('cartTax');
      const totalEl = document.getElementById('cartTotal');

      if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
      if (taxEl) taxEl.textContent = formatCurrency(tax);
      if (totalEl) totalEl.textContent = formatCurrency(total);

      const payModalTotal = document.getElementById('payModalTotal');
      if (payModalTotal) payModalTotal.textContent = formatCurrency(total);
    },

    changeOrderType() {
      const selector = document.getElementById('orderTypeSelector');
      const badge = document.getElementById('orderTableBadge');
      if (selector) posState.orderType = selector.value;
      if (badge) badge.textContent = `${posState.orderType} (${posState.table})`;
    },

    changeTable() {
      const selector = document.getElementById('tableSelector');
      const badge = document.getElementById('orderTableBadge');
      if (selector) posState.table = selector.value;
      if (badge) badge.textContent = `${posState.orderType} (${posState.table})`;
    },

    clearCart() {
      posState.cart = [];
      this.renderCart();
      this.updateCartTotals();
      showToast('Cart cleared');
    },

    openPaymentModal(method) {
      const total = posState.cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
      if (!posState.cart.length || total <= 0) {
        showToast('Add items to the cart before checkout', 'error');
        return;
      }

      this.updateCartTotals();

      const modal = document.getElementById('paymentModal');
      const methodLabel = document.getElementById('payModalMethod');
      const totalDisplay = document.getElementById('payModalTotal');
      const cashGroup = document.getElementById('cashPayGroup');
      const digitalGroup = document.getElementById('digitalPayGroup');
      const cashTendered = document.getElementById('cashTendered');
      const changeDisplay = document.getElementById('cashChangeDisplay');

      if (modal) modal.classList.remove('hidden');
      if (methodLabel) methodLabel.textContent = method || 'Cash';
      if (totalDisplay) totalDisplay.textContent = formatCurrency(document.getElementById('cartTotal')?.textContent ? Number(String(document.getElementById('cartTotal').textContent).replace(/[^\d.-]/g, '')) : total);
      if (cashGroup) cashGroup.classList.toggle('hidden', method !== 'Cash');
      if (digitalGroup) digitalGroup.classList.toggle('hidden', method === 'Cash');
      if (cashTendered) cashTendered.value = '';
      if (changeDisplay) changeDisplay.textContent = '₱0.00';
    },

    calculateChange() {
      const totalPrice = document.getElementById('payModalTotal');
      const cashTendered = document.getElementById('cashTendered');
      const changeDisplay = document.getElementById('cashChangeDisplay');

      if (!totalPrice || !cashTendered || !changeDisplay) return;

      const total = Number(String(totalPrice.textContent).replace(/[^\d.-]/g, '')) || 0;
      const tendered = Number(cashTendered.value) || 0;
      const change = tendered - total;
      changeDisplay.textContent = `₱${Math.max(change, 0).toFixed(2)}`;
    },

    confirmPaymentAndComplete() {
      if (!posState.cart.length) {
        showToast('Cart is empty', 'error');
        return;
      }

      const total = Number(String(document.getElementById('cartTotal')?.textContent || '₱0.00').replace(/[^\d.-]/g, '')) || 0;
      const subtotal = Number(String(document.getElementById('cartSubtotal')?.textContent || '₱0.00').replace(/[^\d.-]/g, '')) || 0;
      const tax = Number(String(document.getElementById('cartTax')?.textContent || '₱0.00').replace(/[^\d.-]/g, '')) || 0;
      const method = document.getElementById('payModalMethod')?.textContent || 'Cash';
      const tendered = Number(document.getElementById('cashTendered')?.value || 0);
      const digitalRefNo = document.getElementById('digitalRefNo')?.value.trim() || '';

      if (method === 'Cash' && tendered < total) {
        showToast('Tendered cash must cover the total', 'error');
        return;
      }
      if (method !== 'Cash' && !digitalRefNo) {
        showToast('Enter the digital payment reference number', 'error');
        return;
      }

      const saleId = Date.now();
      try {
        const sales = JSON.parse(localStorage.getItem('bistroflowSales') || '[]');
        if (!Array.isArray(sales)) {
          throw new Error('Invalid sales data');
        }
        sales.unshift({
          id: saleId,
          reference: `KB-${saleId}`,
          date: new Date().toISOString(),
          total,
          subtotal,
          tax,
          method,
          digitalRefNo,
          tendered: method === 'Cash' ? tendered : total,
          orderType: posState.orderType,
          table: posState.table,
          items: posState.cart.map(({ id, name, category, price, qty }) => ({ id, name, category, price, qty }))
        });
        localStorage.setItem('bistroflowSales', JSON.stringify(sales));
      } catch (error) {
        showToast('Could not save the sale. Payment was not completed.', 'error');
        return;
      }

      const modal = document.getElementById('paymentModal');
      if (modal) modal.classList.add('hidden');

      const receiptModal = document.getElementById('receiptModal');
      if (receiptModal) {
        document.getElementById('receiptId').textContent = `#${saleId}`;
        document.getElementById('receiptDate').textContent = new Date().toLocaleString();
        document.getElementById('receiptTable').textContent = `${posState.orderType} (${posState.table})`;
        document.getElementById('receiptPayment').textContent = method;
        document.getElementById('receiptSubtotal').textContent = formatCurrency(subtotal);
        document.getElementById('receiptTax').textContent = formatCurrency(tax);
        document.getElementById('receiptTotal').textContent = formatCurrency(total);
        document.getElementById('receiptTendered').textContent = formatCurrency(Number(String(document.getElementById('cashTendered')?.value || 0)) || 0);
        document.getElementById('receiptChange').textContent = formatCurrency(Number(String(document.getElementById('cashChangeDisplay')?.textContent || '₱0.00').replace(/[^\d.-]/g, '')) || 0);

        const itemsBody = document.getElementById('receiptItemsBody');
        if (itemsBody) {
          itemsBody.innerHTML = posState.cart.map((item) => `
            <tr>
              <td class="py-1">${item.qty} ${item.name}</td>
              <td class="text-right py-1">${formatCurrency(item.price * item.qty)}</td>
            </tr>
          `).join('');
        }

        receiptModal.classList.remove('hidden');
      }

      this.clearCart();
      const digitalInput = document.getElementById('digitalRefNo');
      if (digitalInput) digitalInput.value = '';
      if (typeof FinanceModule !== 'undefined' && FinanceModule.updateSummary) {
        FinanceModule.updateSummary();
      }
      showToast('Payment completed successfully');
    },

    printReceipt() {
      window.print();
    }
  };

  const AnalyticsModule = {
    range: 'daily',
    salesChart: null,
    categoryChart: null,

    init() {
      this.render();
    },

    setAnalyticsRange(range) {
      if (!['daily', 'weekly', 'monthly'].includes(range)) return;
      this.range = range;
      document.querySelectorAll('.range-btn').forEach((button) => {
        const isActive = button.id === `btnRange${range.charAt(0).toUpperCase()}${range.slice(1)}`;
        button.classList.toggle('bg-orange-600', isActive);
        button.classList.toggle('text-white', isActive);
        button.classList.toggle('text-stone-600', !isActive);
        button.classList.toggle('dark:text-stone-300', !isActive);
        button.classList.toggle('hover:bg-stone-100', !isActive);
        button.classList.toggle('dark:hover:bg-stone-700', !isActive);
      });
      this.render();
    },

    getRangeStart(now = new Date()) {
      const start = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (this.range === 'weekly') {
        const daysSinceMonday = (start.getDay() + 6) % 7;
        start.setDate(start.getDate() - daysSinceMonday);
      } else if (this.range === 'monthly') {
        start.setDate(1);
      }
      return start;
    },

    getFilteredData() {
      const now = new Date();
      const start = this.getRangeStart(now);
      const sales = JSON.parse(localStorage.getItem('bistroflowSales') || '[]');
      const expenses = JSON.parse(localStorage.getItem('bistroflowExpenses') || '[]');
      return {
        now,
        start,
        sales: (Array.isArray(sales) ? sales : []).filter((entry) => {
          const date = new Date(entry.date);
          return !Number.isNaN(date.getTime()) && date >= start && date <= now;
        }),
        expenses: (Array.isArray(expenses) ? expenses : []).filter((entry) => {
          const date = new Date(entry.date);
          return !Number.isNaN(date.getTime()) && date >= start && date <= now;
        })
      };
    },

    render() {
      let data;
      try {
        data = this.getFilteredData();
      } catch (error) {
        showToast('Could not load analytics data', 'error');
        return;
      }

      const revenue = data.sales.reduce((sum, sale) => sum + (Number(sale.total) || 0), 0);
      const expenseTotal = data.expenses.reduce((sum, expense) => sum + (Number(expense.amount) || 0), 0);
      const orders = data.sales.length;
      const values = {
        statRevenue: formatCurrency(revenue),
        statOrders: String(orders),
        statAvgOrder: formatCurrency(orders ? revenue / orders : 0),
        statEstProfit: formatCurrency(revenue - expenseTotal)
      };
      Object.entries(values).forEach(([id, value]) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
      });

      const employees = getEmployees();
      const activeCount = employees.filter((employee) => employee.status === 'On Duty').length;
      const activeStaff = document.getElementById('statActiveStaff');
      if (activeStaff) activeStaff.textContent = `${activeCount} / ${employees.length}`;

      this.renderTransactions(data.sales);
      this.renderCharts(data);
    },

    renderTransactions(sales) {
      const body = document.getElementById('transactionTableBody');
      if (!body) return;
      body.replaceChildren();

      if (!sales.length) {
        const row = document.createElement('tr');
        const cell = document.createElement('td');
        cell.colSpan = 6;
        cell.className = 'p-4 text-center text-stone-500';
        cell.textContent = 'No completed orders for this period yet.';
        row.appendChild(cell);
        body.appendChild(row);
        return;
      }

      sales.slice(0, 50).forEach((sale) => {
        const row = document.createElement('tr');
        const itemSummary = Array.isArray(sale.items)
          ? sale.items.map((item) => `${item.qty} × ${item.name}`).join(', ')
          : '—';
        const values = [
          sale.reference || `KB-${sale.id || ''}`,
          new Date(sale.date).toLocaleString(),
          `${sale.orderType || 'Dine-in'} (${sale.table || '—'})`,
          sale.method || '—',
          itemSummary,
          formatCurrency(sale.total)
        ];
        values.forEach((value, index) => {
          const cell = document.createElement('td');
          cell.className = index === 5 ? 'p-4 text-right font-semibold' : 'p-4';
          cell.textContent = value;
          row.appendChild(cell);
        });
        body.appendChild(row);
      });
    },

    renderCharts(data) {
      if (typeof Chart === 'undefined') return;

      const labels = [];
      const salesValues = [];
      const expenseValues = [];
      const salesByBucket = new Map();
      const expensesByBucket = new Map();
      const now = data.now;
      let bucketCount;
      let bucketStart;
      let getKey;
      let getLabel;

      if (this.range === 'daily') {
        bucketCount = 24;
        bucketStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        getKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}-${date.getHours()}`;
        getLabel = (_, index) => `${String(index).padStart(2, '0')}:00`;
      } else if (this.range === 'weekly') {
        bucketCount = 7;
        bucketStart = data.start;
        getKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        getLabel = (date) => date.toLocaleDateString(undefined, { weekday: 'short' });
      } else {
        bucketCount = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
        bucketStart = new Date(now.getFullYear(), now.getMonth(), 1);
        getKey = (date) => `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
        getLabel = (date) => String(date.getDate());
      }

      for (let index = 0; index < bucketCount; index += 1) {
        const bucketDate = new Date(bucketStart);
        if (this.range === 'daily') bucketDate.setHours(index);
        else bucketDate.setDate(bucketStart.getDate() + index);
        labels.push(getLabel(bucketDate, index));
        salesByBucket.set(getKey(bucketDate), 0);
        expensesByBucket.set(getKey(bucketDate), 0);
      }

      data.sales.forEach((sale) => {
        const date = new Date(sale.date);
        const key = getKey(date);
        if (salesByBucket.has(key)) salesByBucket.set(key, salesByBucket.get(key) + (Number(sale.total) || 0));
      });
      data.expenses.forEach((expense) => {
        const date = new Date(expense.date);
        const key = getKey(date);
        if (expensesByBucket.has(key)) expensesByBucket.set(key, expensesByBucket.get(key) + (Number(expense.amount) || 0));
      });

      salesValues.push(...salesByBucket.values());
      expenseValues.push(...expensesByBucket.values());

      const salesCanvas = document.getElementById('salesChart');
      if (salesCanvas) {
        if (this.salesChart) this.salesChart.destroy();
        this.salesChart = new Chart(salesCanvas, {
          type: 'line',
          data: {
            labels,
            datasets: [
              { label: 'Sales', data: salesValues, borderColor: '#ea580c', backgroundColor: 'rgba(234, 88, 12, 0.12)', fill: true, tension: 0.3 },
              { label: 'Expenses', data: expenseValues, borderColor: '#e11d48', backgroundColor: 'rgba(225, 29, 72, 0.08)', fill: true, tension: 0.3 }
            ]
          },
          options: { responsive: true, maintainAspectRatio: false, scales: { y: { beginAtZero: true } } }
        });
      }

      const categoryTotals = new Map();
      data.sales.forEach((sale) => {
        (Array.isArray(sale.items) ? sale.items : []).forEach((item) => {
          const category = item.category || 'Other';
          categoryTotals.set(category, (categoryTotals.get(category) || 0) + (Number(item.price) || 0) * (Number(item.qty) || 0));
        });
      });

      const categoryCanvas = document.getElementById('categoryChart');
      if (categoryCanvas) {
        if (this.categoryChart) this.categoryChart.destroy();
        this.categoryChart = new Chart(categoryCanvas, {
          type: 'doughnut',
          data: {
            labels: categoryTotals.size ? [...categoryTotals.keys()] : ['No sales yet'],
            datasets: [{ data: categoryTotals.size ? [...categoryTotals.values()] : [1], backgroundColor: ['#ea580c', '#059669', '#2563eb', '#d97706', '#db2777', '#7c3aed'] }]
          },
          options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }
        });
      }
    }
  };

  const employeeStorageKey = 'bistroflowEmployees';
  const defaultEmployees = [
    { id: 1, name: 'Maria Santos', role: 'Manager', rate: 180, pin: '1234', status: 'On Duty', hours: 8 },
    { id: 2, name: 'Rico Dela Cruz', role: 'Head Chef', rate: 165, pin: '2345', status: 'On Duty', hours: 7 },
    { id: 3, name: 'Ana Reyes', role: 'Server / Waiter', rate: 120, pin: '3456', status: 'Break', hours: 4 },
    { id: 4, name: 'Jelyn Gomez', role: 'Cashier', rate: 130, pin: '4567', status: 'Off Duty', hours: 0 }
  ];

  function getEmployees() {
    try {
      const stored = localStorage.getItem(employeeStorageKey);
      if (!stored) {
        localStorage.setItem(employeeStorageKey, JSON.stringify(defaultEmployees));
        return [...defaultEmployees];
      }
      const parsed = JSON.parse(stored);
      return Array.isArray(parsed) && parsed.length ? parsed : [...defaultEmployees];
    } catch (error) {
      return [...defaultEmployees];
    }
  }

  function saveEmployees(employees) {
    localStorage.setItem(employeeStorageKey, JSON.stringify(employees));
  }

  function renderEmployeeSelect() {
    const select = document.getElementById('clockEmpSelect');
    if (!select) return;

    const employees = getEmployees();
    select.innerHTML = employees
      .map((employee) => `<option value="${employee.id}">${employee.name}</option>`)
      .join('');

    if (!select.value && employees.length) {
      select.value = String(employees[0].id);
    }
  }

  function renderEmployeeTable() {
    const tableBody = document.getElementById('employeeTableBody');
    const employees = getEmployees();
    const activeStaff = document.getElementById('statActiveStaff');
    if (activeStaff) {
      activeStaff.textContent = `${employees.filter((employee) => employee.status === 'On Duty').length} / ${employees.length}`;
    }
    if (!tableBody) return;

    tableBody.innerHTML = employees.map((employee) => {
      const statusClass = employee.status === 'On Duty'
        ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
        : employee.status === 'Break'
          ? 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
          : 'bg-stone-200 text-stone-700 dark:bg-stone-700 dark:text-stone-200';

      const weeklyWage = (Number(employee.rate) * Number(employee.hours || 0)).toFixed(2);
      return `
        <tr>
          <td class="p-3 font-medium text-stone-800 dark:text-white">${employee.name}</td>
          <td class="p-3 text-stone-500 dark:text-stone-400">${employee.role}</td>
          <td class="p-3">₱${Number(employee.rate).toFixed(2)}</td>
          <td class="p-3"><span class="px-2 py-1 rounded-full text-xs font-semibold ${statusClass}">${employee.status}</span></td>
          <td class="p-3 text-stone-500 dark:text-stone-400">${employee.hours || 0} hrs</td>
          <td class="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">₱${weeklyWage}</td>
        </tr>
      `;
    }).join('');
  }

  function renderAttendanceLogs() {
    const container = document.getElementById('attendanceLogs');
    if (!container) return;

    const employees = getEmployees();
    const logs = employees.flatMap((employee) => {
      const entries = employee.logs || [];
      return entries.map((entry) => ({
        ...entry,
        employeeName: employee.name,
        employeeRole: employee.role
      }));
    }).sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 10);

    if (!logs.length) {
      container.innerHTML = '<p class="text-sm text-stone-500">No attendance activity yet.</p>';
      return;
    }

    container.innerHTML = logs.map((log) => `
      <div class="rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-900/50 p-3">
        <div class="flex justify-between items-center gap-2">
          <p class="font-semibold text-stone-800 dark:text-white text-sm">${log.employeeName}</p>
          <span class="text-[10px] font-bold ${log.type === 'clock-in' ? 'text-emerald-600' : 'text-rose-600'} uppercase">${log.type === 'clock-in' ? 'Clock In' : 'Clock Out'}</span>
        </div>
        <p class="text-xs text-stone-500 dark:text-stone-400 mt-1">${log.employeeRole}</p>
        <p class="text-xs text-stone-500 dark:text-stone-400 mt-2">${new Date(log.time).toLocaleString()}</p>
      </div>
    `).join('');
  }

  const EmployeeModule = {
    init() {
      renderEmployeeSelect();
      renderEmployeeTable();
      renderAttendanceLogs();
    },

    handleClockIn() {
      const select = document.getElementById('clockEmpSelect');
      const pinInput = document.getElementById('clockEmpPin');
      if (!select || !pinInput) return;

      const employeeId = Number(select.value);
      const employees = getEmployees();
      const employee = employees.find((item) => item.id === employeeId);

      if (!employee) {
        showToast('Select an employee first', 'error');
        return;
      }

      if (String(employee.pin) !== String(pinInput.value).trim()) {
        showToast('Invalid employee PIN', 'error');
        pinInput.focus();
        return;
      }

      employee.status = 'On Duty';
      employee.hours = Math.max(Number(employee.hours) || 0, 4);
      employee.logs = employee.logs || [];
      employee.logs.unshift({
        type: 'clock-in',
        time: new Date().toISOString()
      });

      saveEmployees(employees);
      renderEmployeeSelect();
      renderEmployeeTable();
      renderAttendanceLogs();
      AnalyticsModule.render();
      pinInput.value = '';
      showToast(`${employee.name} clocked in`);
    },

    handleClockOut() {
      const select = document.getElementById('clockEmpSelect');
      const pinInput = document.getElementById('clockEmpPin');
      if (!select || !pinInput) return;

      const employeeId = Number(select.value);
      const employees = getEmployees();
      const employee = employees.find((item) => item.id === employeeId);

      if (!employee) {
        showToast('Select an employee first', 'error');
        return;
      }

      if (String(employee.pin) !== String(pinInput.value).trim()) {
        showToast('Invalid employee PIN', 'error');
        pinInput.focus();
        return;
      }

      employee.status = 'Off Duty';
      employee.hours = Math.max(Number(employee.hours) || 0, 0);
      employee.logs = employee.logs || [];
      employee.logs.unshift({
        type: 'clock-out',
        time: new Date().toISOString()
      });

      saveEmployees(employees);
      renderEmployeeSelect();
      renderEmployeeTable();
      renderAttendanceLogs();
      AnalyticsModule.render();
      pinInput.value = '';
      showToast(`${employee.name} clocked out`);
    },

    openAddEmployeeModal() {
      const modal = document.getElementById('addEmployeeModal');
      if (modal) modal.classList.remove('hidden');
    },

    handleAddEmployee(event) {
      event.preventDefault();
      const nameInput = document.getElementById('newEmpName');
      const roleInput = document.getElementById('newEmpRole');
      const rateInput = document.getElementById('newEmpRate');
      const pinInput = document.getElementById('newEmpPin');

      if (!nameInput || !roleInput || !rateInput || !pinInput) return;

      const name = nameInput.value.trim();
      const role = roleInput.value;
      const rate = Number(rateInput.value);
      const pin = String(pinInput.value).trim();

      if (!name || !pin || Number.isNaN(rate) || rate <= 0) {
        showToast('Please fill valid employee details', 'error');
        return;
      }

      const employees = getEmployees();
      const newEmployee = {
        id: Date.now(),
        name,
        role,
        rate,
        pin,
        status: 'Off Duty',
        hours: 0,
        logs: []
      };

      employees.push(newEmployee);
      saveEmployees(employees);
      renderEmployeeSelect();
      renderEmployeeTable();
      renderAttendanceLogs();
      AnalyticsModule.render();

      nameInput.value = '';
      roleInput.value = 'Head Chef';
      rateInput.value = '';
      pinInput.value = '';

      const modal = document.getElementById('addEmployeeModal');
      if (modal) modal.classList.add('hidden');
      showToast('New staff member added');
    }
  };

  const FinanceModule = {
    init() {
      this.renderLedger();
      this.updateSummary();
    },

    renderLedger() {
      const body = document.getElementById('expenseTableBody');
      if (!body) return;

      let expenses = [];
      try {
        const stored = JSON.parse(localStorage.getItem('bistroflowExpenses') || '[]');
        expenses = Array.isArray(stored) ? stored : [];
      } catch (error) {
        expenses = [];
      }

      body.innerHTML = '';
      expenses
        .slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .forEach((expense) => {
          const row = document.createElement('tr');
          const date = new Date(expense.date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
          });

          row.innerHTML = `
            <td class="p-3 text-stone-500 dark:text-stone-400">${date}</td>
            <td class="p-3">${expense.title}</td>
            <td class="p-3 text-stone-500 dark:text-stone-400">${expense.category}</td>
            <td class="p-3 text-right font-semibold text-rose-600">${formatCurrency(expense.amount)}</td>
          `;
          body.appendChild(row);
        });
    },

    updateSummary() {
      let sales;
      let expenses;
      try {
        sales = JSON.parse(localStorage.getItem('bistroflowSales') || '[]');
        expenses = JSON.parse(localStorage.getItem('bistroflowExpenses') || '[]');
        if (!Array.isArray(sales) || !Array.isArray(expenses)) {
          throw new Error('Stored financial data must be arrays.');
        }
      } catch (error) {
        showToast('Could not read financial ledger data', 'error');
        return;
      }

      const grossSales = sales.reduce((sum, sale) => {
        const saleTotal = Number(sale.total);
        return sum + (Number.isFinite(saleTotal) && saleTotal > 0 ? saleTotal : 0);
      }, 0);
      const expenseTotal = expenses.reduce((sum, expense) => {
        const expenseAmount = Number(expense.amount);
        return sum + (Number.isFinite(expenseAmount) && expenseAmount > 0 ? expenseAmount : 0);
      }, 0);

      const grossIncomeEl = document.getElementById('financeGrossIncome');
      const expenseEl = document.getElementById('financeExpenses');
      const netProfitEl = document.getElementById('financeNetProfit');

      if (grossIncomeEl) grossIncomeEl.textContent = formatCurrency(grossSales);
      if (expenseEl) expenseEl.textContent = formatCurrency(expenseTotal);
      if (netProfitEl) netProfitEl.textContent = formatCurrency(grossSales - expenseTotal);
    },

    handleAddExpense(event) {
      event.preventDefault();
      const title = document.getElementById('expenseTitle');
      const category = document.getElementById('expenseCategory');
      const amount = document.getElementById('expenseAmount');

      if (!title || !category || !amount) return;

      const titleValue = title.value.trim();
      const amountValue = Number(amount.value);
      if (!titleValue || !Number.isFinite(amountValue) || amountValue <= 0) {
        showToast('Enter a valid expense description and amount', 'error');
        return;
      }

      let expenses = [];
      try {
        const stored = JSON.parse(localStorage.getItem('bistroflowExpenses') || '[]');
        expenses = Array.isArray(stored) ? stored : [];
      } catch (error) {
        expenses = [];
      }

      expenses.push({
        id: Date.now(),
        date: new Date().toISOString(),
        title: titleValue,
        category: category.value,
        amount: amountValue
      });

      localStorage.setItem('bistroflowExpenses', JSON.stringify(expenses));
      title.value = '';
      amount.value = '';
      this.renderLedger();
      this.updateSummary();
      AnalyticsModule.render();
      showToast('Expense added');
    }
  };

  window.AppModule = AppModule;
  window.DataModule = DataModule;
  window.PosModule = PosModule;
  window.AnalyticsModule = AnalyticsModule;
  window.EmployeeModule = EmployeeModule;
  window.FinanceModule = FinanceModule;

  document.addEventListener('DOMContentLoaded', function () {
    let savedTheme = null;
    try {
      savedTheme = localStorage.getItem('bistroflowTheme');
    } catch (error) {
      showToast('Could not load saved theme preference', 'error');
    }
    applyTheme(savedTheme ? savedTheme === 'dark' : document.documentElement.classList.contains('dark'));
    AppModule.switchTab('posTab');
    PosModule.init();
    EmployeeModule.init();
    FinanceModule.init();
  });
})();
