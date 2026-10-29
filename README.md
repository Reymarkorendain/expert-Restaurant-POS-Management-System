# expert-Restaurant-POS-Management-System
Restaurant POS &amp; Management System
<!DOCTYPE html>
<html lang="en" class="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KainBrew - Restaurant POS & Management System</title>

    <!-- External Libraries -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script>
        tailwind.config = { darkMode: 'class' };
    </script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

</head>
<body class="bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-stone-100 font-sans antialiased min-h-screen flex flex-col md:flex-row overflow-x-hidden">

    <!-- Toast Notification -->
    <div id="toast" class="fixed top-5 right-5 z-50 transform translate-x-full transition-transform duration-300 ease-in-out bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3">
        <i id="toastIcon" class="fa-solid fa-circle-check text-xl"></i>
        <span id="toastMsg" class="font-medium text-sm">Action completed successfully</span>
    </div>

    <!-- SIDEBAR NAVIGATION -->
    <aside class="w-full md:w-64 bg-stone-900 text-stone-300 flex-shrink-0 flex flex-col justify-between shadow-xl z-20">
        <div>
            <!-- Header Brand -->
            <div class="p-5 flex items-center justify-between border-b border-stone-800">
                <div class="flex items-center space-x-3">
                    <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-orange-500 flex items-center justify-center text-white shadow-lg shadow-orange-600/30">
                        <i class="fa-solid fa-utensils text-lg"></i>
                    </div>
                    <div>
                        <h1 class="font-bold text-lg text-white leading-none">KainBrew</h1>
                        <span class="text-xs text-amber-500 font-medium">Restaurant Management Suite</span>
                    </div>
                </div>
                <button onclick="AppModule.toggleDarkMode()" class="text-stone-400 hover:text-white p-2 rounded-lg bg-stone-800 transition" title="Toggle Theme">
                    <i id="themeIcon" class="fa-solid fa-sun"></i>
                </button>
            </div>

            <!-- Navigation Links -->
            <nav class="p-4 space-y-1.5">
                <button onclick="AppModule.switchTab('posTab')" id="nav-posTab" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-white bg-orange-600 font-medium shadow-lg shadow-orange-600/30">
                    <i class="fa-solid fa-cash-register w-5 text-center"></i>
                    <span>Point of Sale</span>
                </button>
                <button onclick="AppModule.switchTab('analyticsTab')" id="nav-analyticsTab" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-stone-400 hover:bg-stone-800 hover:text-white font-medium">
                    <i class="fa-solid fa-chart-pie w-5 text-center"></i>
                    <span>Analytics & Sales</span>
                </button>
                <button onclick="AppModule.switchTab('employeeTab')" id="nav-employeeTab" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-stone-400 hover:bg-stone-800 hover:text-white font-medium">
                    <i class="fa-solid fa-users w-5 text-center"></i>
                    <span>Staff Attendance</span>
                </button>
                <button onclick="AppModule.switchTab('financeTab')" id="nav-financeTab" class="nav-btn w-full flex items-center gap-3 px-4 py-3 rounded-xl transition text-stone-400 hover:bg-stone-800 hover:text-white font-medium">
                    <i class="fa-solid fa-wallet w-5 text-center"></i>
                    <span>Financial Ledger</span>
                </button>
            </nav>
        </div>

        <!-- System & Backup Bar -->
        <div class="p-4 border-t border-stone-800 bg-stone-950/60 space-y-3">
            <div class="flex items-center justify-between text-xs text-stone-400">
                <span>Active Terminal:</span>
                <span class="text-emerald-400 flex items-center gap-1 font-semibold">
                    <span class="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Manila (PST)
                </span>
            </div>
            
            <div class="grid grid-cols-2 gap-2 text-xs">
                <button onclick="DataModule.exportJSON()" class="bg-stone-800 hover:bg-stone-700 text-stone-300 py-1.5 px-2 rounded-lg transition text-center flex items-center justify-center gap-1">
                    <i class="fa-solid fa-download"></i> Export
                </button>
                <button onclick="document.getElementById('importFileInput').click()" class="bg-stone-800 hover:bg-stone-700 text-stone-300 py-1.5 px-2 rounded-lg transition text-center flex items-center justify-center gap-1">
                    <i class="fa-solid fa-upload"></i> Import
                </button>
                <input type="file" id="importFileInput" onchange="DataModule.importJSON(event)" class="hidden" accept=".json">
            </div>

            <div class="bg-stone-800/80 p-2.5 rounded-xl text-xs flex items-center justify-between">
                <div class="truncate">
                    <p class="font-semibold text-white truncate" id="currentOperator">Manager On-Duty</p>
                    <p class="text-stone-400">Terminal 01 (PHP)</p>
                </div>
                <button onclick="AppModule.switchTab('employeeTab')" class="text-xs bg-orange-600 hover:bg-orange-500 text-white px-2.5 py-1.5 rounded-lg transition font-medium" title="Staff Clock In">
                    <i class="fa-regular fa-clock"></i>
                </button>
            </div>
        </div>
    </aside>

    <!-- MAIN APP WRAPPER -->
    <main class="flex-1 flex flex-col h-screen overflow-y-auto">
        <!-- Top Application Header -->
        <header class="bg-white dark:bg-stone-800 border-b border-stone-200 dark:border-stone-700 px-6 py-3 flex items-center justify-between shadow-sm flex-shrink-0">
            <div class="flex items-center gap-3">
                <h2 id="pageTitle" class="text-xl font-bold text-stone-800 dark:text-white">Point of Sale</h2>
            </div>
            <div class="flex items-center space-x-3 text-sm">
                <div class="hidden sm:flex items-center gap-2 bg-stone-100 dark:bg-stone-700 px-3 py-1.5 rounded-lg text-stone-600 dark:text-stone-300">
                    <i class="fa-regular fa-calendar text-orange-500"></i>
                    <span id="currentDateDisplay">Oct 30, 2026</span>
                </div>
                <div class="bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300 px-3 py-1.5 rounded-lg font-bold text-xs border border-orange-200 dark:border-orange-800">
                    Shift Sales: <span id="headerTodaySales">₱0.00</span>
                </div>
                <button onclick="DataModule.resetDataToDefault()" class="text-xs text-stone-400 hover:text-rose-500 dark:hover:text-rose-400 px-2 py-1 rounded border border-stone-200 dark:border-stone-700" title="Reset Local Demo Data">
                    <i class="fa-solid fa-rotate-right"></i> Reset
                </button>
            </div>
        </header>

        <!-- Dynamic Content View Sections -->
        <div class="flex-1 p-4 md:p-6 overflow-y-auto">

            <!-- TAB 1: POINT OF SALE (POS) -->
            <section id="posTab" class="tab-content h-full flex flex-col lg:flex-row gap-6">
                <!-- Left Menu Column -->
                <div class="flex-1 flex flex-col h-full space-y-4">
                    <div class="flex flex-col sm:flex-row gap-3">
                        <div class="relative flex-1">
                            <i class="fa-solid fa-magnifying-glass absolute left-3.5 top-3.5 text-stone-400"></i>
                            <input type="text" id="menuSearch" onkeyup="PosModule.renderMenuGrid()" placeholder="Search Adobo, Sinigang, Bulalo, Halo-Halo..." class="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm">
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 whitespace-nowrap">Mode:</span>
                            <select id="orderTypeSelector" onchange="PosModule.changeOrderType()" class="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-medium">
                                <option value="Dine-in">Dine-in</option>
                                <option value="Takeout">Takeout / Walk-in</option>
                                <option value="Delivery">Delivery (FoodPanda / Grab)</option>
                            </select>
                        </div>
                        <div class="flex items-center gap-2">
                            <span class="text-xs font-semibold text-stone-500 dark:text-stone-400 whitespace-nowrap">Table:</span>
                            <select id="tableSelector" onchange="PosModule.changeTable()" class="px-3 py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm font-medium">
                                <option value="Table 01">Table 01</option>
                                <option value="Table 02">Table 02</option>
                                <option value="Table 03">Table 03</option>
                                <option value="Table 04">Table 04</option>
                                <option value="VIP Room">VIP Room</option>
                            </select>
                        </div>
                    </div>

                    <!-- Category Pills -->
                    <div class="flex space-x-2 overflow-x-auto pb-2 scrollbar-none" id="categoryPills"></div>

                    <!-- Menu Grid -->
                    <div class="flex-1 overflow-y-auto pr-1">
                        <div id="menuGrid" class="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4"></div>
                    </div>
                </div>

                <!-- Right Cart Panel -->
                <div class="w-full lg:w-96 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-lg flex flex-col h-full max-h-[750px] lg:max-h-none">
                    <div class="p-4 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center bg-stone-50 dark:bg-stone-800/50 rounded-t-2xl">
                        <div>
                            <h3 class="font-bold text-stone-800 dark:text-white">Current Order</h3>
                            <p id="orderTableBadge" class="text-xs text-orange-600 dark:text-orange-400 font-semibold">Dine-in (Table 01)</p>
                        </div>
                        <button onclick="PosModule.clearCart()" class="text-xs text-rose-500 hover:text-rose-700 font-medium px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/50 transition">
                            <i class="fa-solid fa-trash-can mr-1"></i> Clear Cart
                        </button>
                    </div>

                    <!-- Cart Item List -->
                    <div id="cartItemsList" class="flex-1 overflow-y-auto p-4 space-y-3"></div>

                    <!-- Order Calculations & Checkout -->
                    <div class="p-4 border-t border-stone-100 dark:border-stone-700 bg-stone-50/50 dark:bg-stone-800/50 rounded-b-2xl space-y-3">
                        <div class="space-y-1.5 text-sm">
                            <div class="flex justify-between text-stone-500 dark:text-stone-400">
                                <span>Subtotal</span>
                                <span id="cartSubtotal" class="font-medium text-stone-800 dark:text-stone-200">₱0.00</span>
                            </div>
                            <div class="flex justify-between text-stone-500 dark:text-stone-400">
                                <span>12% VAT Included</span>
                                <span id="cartTax" class="font-medium text-stone-800 dark:text-stone-200">₱0.00</span>
                            </div>
                            <div class="flex justify-between items-center text-stone-500 dark:text-stone-400">
                                <span>Discount Type</span>
                                <select id="discountSelect" onchange="PosModule.updateCartTotals()" class="text-xs px-2 py-1 rounded border border-stone-300 dark:border-stone-600 dark:bg-stone-700 dark:text-white">
                                    <option value="0">None (0%)</option>
                                    <option value="20">Senior Citizen / PWD (20%)</option>
                                    <option value="10">Regular Promo (10%)</option>
                                </select>
                            </div>
                            <div class="flex justify-between text-lg font-extrabold text-stone-900 dark:text-white pt-2 border-t border-stone-200 dark:border-stone-700">
                                <span>Total (PHP)</span>
                                <span id="cartTotal" class="text-orange-600 dark:text-orange-400">₱0.00</span>
                            </div>
                        </div>

                        <!-- Payment Options -->
                        <div class="grid grid-cols-2 gap-2 pt-2">
                            <button onclick="PosModule.openPaymentModal('Cash')" class="py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm">
                                <i class="fa-solid fa-money-bill-wave"></i> Cash
                            </button>
                            <button onclick="PosModule.openPaymentModal('GCash')" class="py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-xl shadow transition flex items-center justify-center gap-2 text-sm">
                                <i class="fa-solid fa-mobile-screen-button"></i> GCash / Maya
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            <!-- TAB 2: ANALYTICS & SALES -->
            <section id="analyticsTab" class="tab-content hidden space-y-6">
                <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                        <h3 class="text-lg font-bold text-stone-800 dark:text-white">Philippine Sales & Performance Analytics</h3>
                        <p class="text-xs text-stone-500 dark:text-stone-400">Real-time operational metrics & revenue breakdowns (PHP ₱)</p>
                    </div>
                    <div class="flex gap-2 bg-white dark:bg-stone-800 p-1.5 rounded-xl border border-stone-200 dark:border-stone-700">
                        <button onclick="AnalyticsModule.setAnalyticsRange('daily')" id="btnRangeDaily" class="range-btn px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-600 text-white transition">Today</button>
                        <button onclick="AnalyticsModule.setAnalyticsRange('weekly')" id="btnRangeWeekly" class="range-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition">This Week</button>
                        <button onclick="AnalyticsModule.setAnalyticsRange('monthly')" id="btnRangeMonthly" class="range-btn px-3 py-1.5 text-xs font-semibold rounded-lg text-stone-600 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-700 transition">This Month</button>
                    </div>
                </div>

                <!-- Metric KPI Cards -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div class="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <p class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">Gross Revenue</p>
                        <h4 id="statRevenue" class="text-xl font-extrabold text-stone-900 dark:text-white mt-1">₱0.00</h4>
                        <span class="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1"><i class="fa-solid fa-arrow-trend-up"></i> POS Sales</span>
                    </div>

                    <div class="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <p class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">Completed Orders</p>
                        <h4 id="statOrders" class="text-xl font-extrabold text-stone-900 dark:text-white mt-1">0</h4>
                        <span class="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1"><i class="fa-solid fa-check"></i> Served customers</span>
                    </div>

                    <div class="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <p class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">Avg Ticket Size</p>
                        <h4 id="statAvgOrder" class="text-xl font-extrabold text-stone-900 dark:text-white mt-1">₱0.00</h4>
                        <span class="text-[11px] text-stone-400 font-medium flex items-center gap-1 mt-1">Per transaction</span>
                    </div>

                    <div class="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <p class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">Est. Net Margin</p>
                        <h4 id="statEstProfit" class="text-xl font-extrabold text-emerald-600 dark:text-emerald-400 mt-1">₱0.00</h4>
                        <span class="text-[11px] text-emerald-500 font-medium flex items-center gap-1 mt-1"><i class="fa-solid fa-piggy-bank"></i> Sales - Expenses</span>
                    </div>

                    <div class="bg-white dark:bg-stone-800 p-4 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <p class="text-xs font-semibold text-stone-500 dark:text-stone-400 uppercase">Active Staff On-Floor</p>
                        <h4 id="statActiveStaff" class="text-xl font-extrabold text-blue-600 dark:text-blue-400 mt-1">0 / 0</h4>
                        <span class="text-[11px] text-blue-500 font-medium flex items-center gap-1 mt-1"><i class="fa-solid fa-user-clock"></i> Clocked In</span>
                    </div>
                </div>

                <!-- Chart.js Graphics -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <h4 class="font-bold text-stone-800 dark:text-white mb-4">Sales Revenue & Margin Trend (₱ PHP)</h4>
                        <div class="relative h-72">
                            <canvas id="salesChart"></canvas>
                        </div>
                    </div>

                    <div class="bg-white dark:bg-stone-800 p-5 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm">
                        <h4 class="font-bold text-stone-800 dark:text-white mb-4">Product Category Revenue Share</h4>
                        <div class="relative h-72 flex items-center justify-center">
                            <canvas id="categoryChart"></canvas>
                        </div>
                    </div>
                </div>

                <!-- Recent Transactions Log -->
                <div class="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm overflow-hidden">
                    <div class="p-5 border-b border-stone-100 dark:border-stone-700 flex justify-between items-center">
                        <h4 class="font-bold text-stone-800 dark:text-white">Recent POS Transaction Log</h4>
                        <span class="text-xs text-stone-400">Saved on this device</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="bg-stone-50 dark:bg-stone-700/50 text-xs text-stone-500 dark:text-stone-400 uppercase">
                                    <th class="p-4">Order Ref</th>
                                    <th class="p-4">Time</th>
                                    <th class="p-4">Mode / Table</th>
                                    <th class="p-4">Payment</th>
                                    <th class="p-4">Items</th>
                                    <th class="p-4 text-right">Total Amount</th>
                                </tr>
                            </thead>
                            <tbody id="transactionTableBody" class="divide-y divide-stone-100 dark:divide-stone-700 text-sm"></tbody>
                        </table>
                    </div>
                </div>
            </section>

            <!-- TAB 3: EMPLOYEE ATTENDANCE & MANAGEMENT -->
            <section id="employeeTab" class="tab-content hidden space-y-6">
                <!-- Timeclock PIN Interface -->
                <div class="bg-gradient-to-r from-stone-900 via-stone-800 to-amber-950 text-white p-6 rounded-2xl shadow-lg flex flex-col md:flex-row justify-between items-center gap-4 border border-stone-800">
                    <div class="space-y-1">
                        <span class="text-xs uppercase tracking-widest text-amber-400 font-bold">Philippine Attendance Terminal</span>
                        <h3 class="text-2xl font-bold">Staff Clock-In / Clock-Out</h3>
                        <p class="text-stone-400 text-sm">Select employee name, enter 4-digit PIN, and record timeclock logs.</p>
                    </div>
                    <div class="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <select id="clockEmpSelect" class="bg-stone-800 border border-stone-700 text-white px-3 py-2.5 rounded-xl text-sm flex-1 md:w-48 focus:outline-none focus:ring-2 focus:ring-orange-500"></select>
                        <input type="password" id="clockEmpPin" maxlength="4" placeholder="PIN" class="bg-stone-800 border border-stone-700 text-white px-3 py-2.5 rounded-xl text-sm w-24 text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-orange-500">
                        <button type="button" onclick="EmployeeModule.handleClockIn()" class="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm flex items-center gap-1.5">
                            <i class="fa-solid fa-right-to-bracket"></i> Clock In
                        </button>
                        <button type="button" onclick="EmployeeModule.handleClockOut()" class="bg-rose-600 hover:bg-rose-500 text-white font-semibold px-4 py-2.5 rounded-xl transition text-sm flex items-center gap-1.5">
                            <i class="fa-solid fa-right-from-bracket"></i> Clock Out
                        </button>
                    </div>
                </div>

                <!-- Roster and Attendance Logs -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-5 space-y-4">
                        <div class="flex justify-between items-center">
                            <h4 class="font-bold text-stone-800 dark:text-white">Staff Roster & Wage Calculation (PHP)</h4>
                            <button onclick="EmployeeModule.openAddEmployeeModal()" class="text-xs bg-orange-600 hover:bg-orange-700 text-white px-3 py-2 rounded-lg transition flex items-center gap-1 font-medium">
                                <i class="fa-solid fa-plus"></i> Add Employee
                            </button>
                        </div>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-stone-50 dark:bg-stone-700/50 text-xs text-stone-500 dark:text-stone-400 uppercase">
                                        <th class="p-3">Staff Name</th>
                                        <th class="p-3">Role</th>
                                        <th class="p-3">Hourly Rate (₱)</th>
                                        <th class="p-3">Status</th>
                                        <th class="p-3">Weekly Hrs</th>
                                        <th class="p-3 text-right">Est. Weekly Wage</th>
                                    </tr>
                                </thead>
                                <tbody id="employeeTableBody" class="divide-y divide-stone-100 dark:divide-stone-700 text-sm"></tbody>
                            </table>
                        </div>
                    </div>

                    <!-- Live Activity Feed -->
                    <div class="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-5 space-y-4">
                        <h4 class="font-bold text-stone-800 dark:text-white">Attendance Activity Feed</h4>
                        <div id="attendanceLogs" class="space-y-3 max-h-[420px] overflow-y-auto pr-1"></div>
                    </div>
                </div>
            </section>

            <!-- TAB 4: FINANCIAL MANAGEMENT & LEDGER -->
            <section id="financeTab" class="tab-content hidden space-y-6">
                <!-- Summary KPI Cards -->
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div class="bg-emerald-600 text-white p-5 rounded-2xl shadow-md">
                        <p class="text-xs uppercase font-bold text-emerald-100">Gross Sales Income</p>
                        <h3 id="financeGrossIncome" class="text-3xl font-extrabold mt-1">₱0.00</h3>
                        <p class="text-xs text-emerald-100 mt-2">All completed POS sales</p>
                    </div>
                    <div class="bg-rose-600 text-white p-5 rounded-2xl shadow-md">
                        <p class="text-xs uppercase font-bold text-rose-100">Operating Expenses</p>
                        <h3 id="financeExpenses" class="text-3xl font-extrabold mt-1">₱0.00</h3>
                        <p class="text-xs text-rose-100 mt-2">Supplies + Utilities + Payroll</p>
                    </div>
                    <div class="bg-stone-900 text-white p-5 rounded-2xl shadow-md">
                        <p class="text-xs uppercase font-bold text-amber-400">Net Profit Margin</p>
                        <h3 id="financeNetProfit" class="text-3xl font-extrabold mt-1">₱0.00</h3>
                        <p class="text-xs text-stone-400 mt-2">Calculated Balance</p>
                    </div>
                </div>

                <!-- Ledger Input & Log -->
                <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div class="bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-5 space-y-4">
                        <h4 class="font-bold text-stone-800 dark:text-white">Record Operating Expense (PHP)</h4>
                        <form id="expenseForm" onsubmit="FinanceModule.handleAddExpense(event)" class="space-y-3">
                            <div>
                                <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">Expense Description</label>
                                <input type="text" id="expenseTitle" required placeholder="e.g. Meat & Vegetables, Meralco Bill" class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                            </div>
                            <div>
                                <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">Category</label>
                                <select id="expenseCategory" class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                                    <option value="Supplies/Ingredients">Ingredients & Supplies</option>
                                    <option value="Utilities/Rent">Utilities & Rent</option>
                                    <option value="Payroll">Staff Payroll</option>
                                    <option value="Maintenance">Equipment & Maintenance</option>
                                </select>
                            </div>
                            <div>
                                <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">Amount (₱ PHP)</label>
                                <input type="number" step="0.01" id="expenseAmount" required placeholder="0.00" class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm focus:outline-none focus:ring-2 focus:ring-orange-500">
                            </div>
                            <button type="submit" class="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2.5 rounded-lg text-sm transition">
                                <i class="fa-solid fa-plus mr-1"></i> Add Expense Entry
                            </button>
                        </form>
                    </div>

                    <div class="lg:col-span-2 bg-white dark:bg-stone-800 rounded-2xl border border-stone-200 dark:border-stone-700 shadow-sm p-5 space-y-4">
                        <h4 class="font-bold text-stone-800 dark:text-white">Expense Ledger Log</h4>
                        <div class="overflow-x-auto">
                            <table class="w-full text-left border-collapse">
                                <thead>
                                    <tr class="bg-stone-50 dark:bg-stone-700/50 text-xs text-stone-500 dark:text-stone-400 uppercase">
                                        <th class="p-3">Date</th>
                                        <th class="p-3">Description</th>
                                        <th class="p-3">Category</th>
                                        <th class="p-3 text-right">Amount (PHP)</th>
                                    </tr>
                                </thead>
                                <tbody id="expenseTableBody" class="divide-y divide-stone-100 dark:divide-stone-700 text-sm"></tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </section>

        </div>
    </main>

    <!-- MODAL: PAYMENT CHECKOUT -->
    <div id="paymentModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden">
        <div class="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-700 space-y-4">
            <div class="flex justify-between items-center border-b border-stone-100 dark:border-stone-700 pb-3">
                <h3 class="font-bold text-stone-800 dark:text-white text-lg flex items-center gap-2">
                    <i class="fa-solid fa-cash-register text-orange-500"></i> Payment Checkout
                </h3>
                <button onclick="AppModule.closeModal('paymentModal')" class="text-stone-400 hover:text-stone-600"><i class="fa-solid fa-xmark text-lg"></i></button>
            </div>
            
            <div class="space-y-2 text-sm bg-stone-50 dark:bg-stone-900/50 p-4 rounded-xl border border-stone-200 dark:border-stone-700">
                <div class="flex justify-between">
                    <span class="text-stone-500">Method:</span>
                    <span id="payModalMethod" class="font-bold text-orange-600">Cash</span>
                </div>
                <div class="flex justify-between">
                    <span class="text-stone-500">Total Amount:</span>
                    <span id="payModalTotal" class="font-extrabold text-stone-900 dark:text-white text-base">₱0.00</span>
                </div>
            </div>

            <div id="cashPayGroup" class="space-y-2">
                <label class="text-xs text-stone-500 dark:text-stone-400 block font-semibold">Tendered Amount (₱ PHP)</label>
                <input type="number" id="cashTendered" onkeyup="PosModule.calculateChange()" placeholder="e.g. 1000" class="w-full px-4 py-3 text-lg font-bold rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-900 dark:text-white focus:ring-2 focus:ring-orange-500 focus:outline-none">
                <div class="flex justify-between text-sm font-semibold pt-1">
                    <span class="text-stone-500">Change Due:</span>
                    <span id="cashChangeDisplay" class="text-emerald-600 dark:text-emerald-400 font-extrabold">₱0.00</span>
                </div>
            </div>

            <div id="digitalPayGroup" class="hidden space-y-2">
                <label class="text-xs text-stone-500 dark:text-stone-400 block font-semibold">GCash / Maya Transaction Ref No.</label>
                <input type="text" id="digitalRefNo" placeholder="e.g. 100293849123" class="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-600 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm">
            </div>

            <button onclick="PosModule.confirmPaymentAndComplete()" class="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl transition shadow-lg">
                Confirm & Issue Receipt
            </button>
        </div>
    </div>

    <!-- MODAL: ADD EMPLOYEE -->
    <div id="addEmployeeModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden">
        <div class="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-md shadow-2xl border border-stone-200 dark:border-stone-700">
            <h3 class="text-lg font-bold text-stone-800 dark:text-white mb-4">Add Staff Member</h3>
            <form id="addEmployeeForm" onsubmit="EmployeeModule.handleAddEmployee(event)" class="space-y-3">
                <div>
                    <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">Full Name</label>
                    <input type="text" id="newEmpName" required class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm">
                </div>
                <div>
                    <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">Role / Position</label>
                    <select id="newEmpRole" class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm">
                        <option value="Head Chef">Head Chef</option>
                        <option value="Line Cook">Line Cook</option>
                        <option value="Server / Waiter">Server / Waiter</option>
                        <option value="Cashier">Cashier</option>
                        <option value="Barista / Bartender">Barista / Bartender</option>
                        <option value="Manager">Manager</option>
                    </select>
                </div>
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">Hourly Rate (₱)</label>
                        <input type="number" step="1" id="newEmpRate" required placeholder="80" class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm">
                    </div>
                    <div>
                        <label class="text-xs text-stone-500 dark:text-stone-400 block mb-1">4-Digit PIN</label>
                        <input type="password" id="newEmpPin" maxlength="4" required placeholder="1234" class="w-full px-3 py-2 rounded-lg border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-800 dark:text-white text-sm text-center">
                    </div>
                </div>
                <div class="flex justify-end gap-2 pt-2">
                    <button type="button" onclick="AppModule.closeModal('addEmployeeModal')" class="px-4 py-2 text-sm text-stone-600 dark:text-stone-300 hover:bg-stone-100 rounded-lg">Cancel</button>
                    <button type="submit" class="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium">Save Staff</button>
                </div>
            </form>
        </div>
    </div>

    <!-- MODAL: RECEIPT PREVIEW -->
    <div id="receiptModal" class="fixed inset-0 bg-stone-900/60 backdrop-blur-sm z-50 flex items-center justify-center hidden">
        <div class="bg-white dark:bg-stone-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-stone-200 dark:border-stone-700 flex flex-col items-center">
            <div id="printableReceipt" class="w-full text-stone-800 bg-white p-4 rounded-lg font-mono text-xs border border-stone-200 shadow-inner">
                <div class="text-center border-b border-dashed pb-3 mb-3">
                    <h2 class="font-bold text-base uppercase">KAINBREW</h2>
                    <p class="text-stone-500">123 Bonifacio Global City, Taguig</p>
                    <p class="text-stone-500">VAT Reg TIN: 000-123-456-000</p>
                    <p class="text-stone-500">Tel: (02) 8888-1234</p>
                </div>
                <div class="space-y-1 mb-3">
                    <p><strong>OR No:</strong> <span id="receiptId">#0000</span></p>
                    <p><strong>Date:</strong> <span id="receiptDate">Oct 30, 2026</span></p>
                    <p><strong>Mode/Table:</strong> <span id="receiptTable">Dine-in (Table 01)</span></p>
                    <p><strong>Payment:</strong> <span id="receiptPayment">Cash</span></p>
                </div>
                <table class="w-full border-b border-dashed mb-3 pb-2">
                    <thead>
                        <tr class="text-left border-b border-stone-300">
                            <th class="py-1">Qty Item</th>
                            <th class="text-right py-1">Amount</th>
                        </tr>
                    </thead>
                    <tbody id="receiptItemsBody"></tbody>
                </table>
                <div class="space-y-1 text-right font-medium">
                    <p>Subtotal: <span id="receiptSubtotal">₱0.00</span></p>
                    <p>12% VAT: <span id="receiptTax">₱0.00</span></p>
                    <p>Discount: <span id="receiptDiscount">-₱0.00</span></p>
                    <p class="text-sm font-bold text-black border-t border-stone-300 pt-1">TOTAL DUE: <span id="receiptTotal">₱0.00</span></p>
                    <p id="receiptTenderedLine" class="text-xs text-stone-600">Tendered: <span id="receiptTendered">₱0.00</span></p>
                    <p id="receiptChangeLine" class="text-xs text-stone-600">Change: <span id="receiptChange">₱0.00</span></p>
                </div>
                <div class="text-center mt-4 border-t border-dashed pt-3 text-stone-500">
                    <p>Maraming Salamat Po!</p>
                    <p>Please Come Again.</p>
                </div>
            </div>

            <div class="flex gap-2 w-full mt-4">
                <button onclick="PosModule.printReceipt()" class="flex-1 bg-stone-900 hover:bg-stone-800 text-white py-2.5 rounded-xl font-semibold text-sm transition flex items-center justify-center gap-2">
                    <i class="fa-solid fa-print"></i> Print
                </button>
                <button onclick="AppModule.closeModal('receiptModal')" class="flex-1 bg-stone-200 dark:bg-stone-700 text-stone-800 dark:text-white hover:bg-stone-300 py-2.5 rounded-xl font-semibold text-sm transition">
                    Done
                </button>
            </div>
        </div>
    </div>

    <!-- Application Script -->
    <script src="app.js"></script>
</body>
</html>
