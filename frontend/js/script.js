
const API_URL = 'http://localhost:5000/api/transaction';

const form = document.getElementById('transactionForm');
const transactionList = document.getElementById('transactionList');
const formMessage = document.getElementById('formMessage');

let transactions = [];
let spendingChart = null;

// Currency formatter
const formatCurrency = (amount) =>
    new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
    }).format(amount);

// Escape database values before inserting into HTML
const escapeHTML = (value) =>
    String(value ?? '').replace(/[&<>"']/g, char => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    })[char]);

// Current date
document.getElementById('currentDate').textContent =
    new Date().toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });

document.getElementById('date').value =
    new Date().toISOString().split('T')[0];

document.getElementById('monthlyName').textContent =
    new Date().toLocaleDateString('en-IN', {
        month: 'long',
        year: 'numeric'
    });

// Fetch transactions
const fetchTransactions = async () => {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Failed to fetch transactions');
        }

        const result = await response.json();

        transactions = Array.isArray(result)
            ? result
            : result.data || [];

        updateDashboard();
        renderTransactions();

    } catch (error) {
        console.error(error);
        transactionList.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    Unable to load transactions.
                </td>
            </tr>
        `;
    }
};

// Add transaction
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = document.getElementById('submitBtn');

    const transaction = {
        title: document.getElementById('title').value.trim(),
        amount: Number(document.getElementById('amount').value),
        type: document.getElementById('type').value,
        category: document.getElementById('category').value,
        date: document.getElementById('date').value,
        description: document.getElementById('description').value.trim()
    };

    if (!transaction.title || !transaction.category ||
        !Number.isFinite(transaction.amount) || transaction.amount <= 0) {
        formMessage.textContent = 'Please enter valid transaction details.';
        formMessage.style.color = '#dc2626';
        return;
    }

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Saving...';

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(transaction)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Failed to create transaction');
        }

        form.reset();

        document.getElementById('date').value =
            new Date().toISOString().split('T')[0];

        formMessage.textContent = 'Transaction added successfully!';
        formMessage.style.color = '#16a34a';

        await fetchTransactions();

    } catch (error) {
        formMessage.textContent = error.message;
        formMessage.style.color = '#dc2626';
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = '+ Add Transaction';
    }
});

// Update dashboard calculations
const updateDashboard = () => {
    const income = transactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + Number(t.amount), 0);

    const expenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + Number(t.amount), 0);

    document.getElementById('totalIncome').textContent =
        formatCurrency(income);

    document.getElementById('totalExpenses').textContent =
        formatCurrency(expenses);

    document.getElementById('balance').textContent =
        formatCurrency(income - expenses);

    // Current month calculations
    const now = new Date();

    const monthlyTransactions = transactions.filter(t => {
        const date = new Date(t.date);

        return date.getMonth() === now.getMonth() &&
               date.getFullYear() === now.getFullYear();
    });

    const monthlyIncome = monthlyTransactions
        .filter(t => t.type === 'income')
        .reduce((total, t) => total + Number(t.amount), 0);

    const monthlyExpenses = monthlyTransactions
        .filter(t => t.type === 'expense')
        .reduce((total, t) => total + Number(t.amount), 0);

    document.getElementById('monthlyIncome').textContent =
        formatCurrency(monthlyIncome);

    document.getElementById('monthlyExpenses').textContent =
        formatCurrency(monthlyExpenses);

    document.getElementById('monthlyBalance').textContent =
        formatCurrency(monthlyIncome - monthlyExpenses);

    updateChart(monthlyTransactions);
};

// Display transactions
const renderTransactions = () => {
    const type = document.getElementById('filterType').value;
    const category = document.getElementById('filterCategory').value;
    const startDate = document.getElementById('filterStartDate').value;
    const endDate = document.getElementById('filterEndDate').value;

    const filteredTransactions = transactions.filter(t => {
        const date = new Date(t.date).toISOString().split('T')[0];

        return (!type || t.type === type) &&
               (!category || t.category === category) &&
               (!startDate || date >= startDate) &&
               (!endDate || date <= endDate);
    });

    if (filteredTransactions.length === 0) {
        transactionList.innerHTML = `
            <tr>
                <td colspan="6" class="empty-state">
                    No transactions found.
                </td>
            </tr>
        `;
        return;
    }

    transactionList.innerHTML = filteredTransactions.map(t => `
        <tr>
            <td>${escapeHTML(t.title)}</td>
            <td>${escapeHTML(t.category)}</td>
            <td>${new Date(t.date).toLocaleDateString('en-IN')}</td>
            <td>
                <span class="type-badge ${t.type}-badge">
                    ${escapeHTML(t.type)}
                </span>
            </td>
            <td class="${t.type}-text">
                ${t.type === 'income' ? '+' : '-'}${formatCurrency(t.amount)}
            </td>
            <td>
                <button class="action-btn edit-btn"
                    data-action="edit" data-id="${escapeHTML(t._id)}">
                    Edit
                </button>
                <button class="action-btn delete-btn"
                    data-action="delete" data-id="${escapeHTML(t._id)}">
                    Delete
                </button>
            </td>
        </tr>
    `).join('');
};

// Chart.js
const updateChart = (monthlyTransactions) => {
    const expenses = monthlyTransactions.filter(
        t => t.type === 'expense'
    );

    const categoryTotals = {};

    expenses.forEach(t => {
        categoryTotals[t.category] =
            (categoryTotals[t.category] || 0) + Number(t.amount);
    });

    const labels = Object.keys(categoryTotals);
    const values = Object.values(categoryTotals);

    const ctx = document.getElementById('spendingChart');

    if (spendingChart) {
        spendingChart.destroy();
    }

    spendingChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: values,
                borderWidth: 0
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
};

// Edit and delete transactions
transactionList.addEventListener('click', async (e) => {
    const button = e.target.closest('button[data-action]');

    if (!button) return;

    const id = button.dataset.id;
    const action = button.dataset.action;

    const transaction = transactions.find(t => t._id === id);

    if (!transaction) return;

    try {
        if (action === 'delete') {
            if (!confirm('Are you sure you want to delete this transaction?')) {
                return;
            }

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }

            await fetchTransactions();
        }

        if (action === 'edit') {
            const title = prompt('Enter transaction title:', transaction.title);
            if (title === null) return;

            const amount = prompt('Enter amount:', transaction.amount);
            if (amount === null) return;

            const newAmount = Number(amount);

            if (!title.trim() || !Number.isFinite(newAmount) || newAmount <= 0) {
                alert('Please enter a valid title and positive amount.');
                return;
            }

            const response = await fetch(`${API_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...transaction,
                    title: title.trim(),
                    amount: newAmount
                })
            });

            if (!response.ok) {
                throw new Error('Failed to update transaction');
            }

            await fetchTransactions();
        }

    } catch (error) {
        alert(error.message);
    }
});

// Filters
['filterType', 'filterCategory', 'filterStartDate', 'filterEndDate']
    .forEach(id => {
        document.getElementById(id).addEventListener('change', renderTransactions);
    });

// Clear filters
document.getElementById('clearFilters').addEventListener('click', () => {
    document.getElementById('filterType').value = '';
    document.getElementById('filterCategory').value = '';
    document.getElementById('filterStartDate').value = '';
    document.getElementById('filterEndDate').value = '';

    renderTransactions();
});

// Initial load
fetchTransactions();
