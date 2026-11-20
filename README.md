# Personal Expense Tracker

A full-stack web application for managing personal finances. Track income and expenses, categorize transactions, monitor your balance, and analyze spending habits through interactive charts and transaction filters.

## Features

- **Transaction Management** – Add, view, edit, and delete income and expense records.
- **Income & Expense Tracking** – Track total income, total expenses, and available balance.
- **Categories** – Organize transactions into categories such as Food, Shopping, Transportation, Salary, Healthcare, and more.
- **Search** – Find transactions using relevant search terms.
- **Filtering** – Filter transactions by type, category, and date range.
- **Sorting** – Organize transactions based on available sorting options.
- **Spending Analytics** – Visualize expenses by category using interactive charts.
- **Monthly Summary** – Review monthly income, expenses, and balance.
- **Database Storage** – Store transactions persistently using MongoDB.

## Tech Stack

### Frontend
- HTML5
- CSS3
- JavaScript (Vanilla JS)
- Chart.js

### Backend
- Node.js
- Express.js
- Mongoose

### Database
- MongoDB

## Project Structure

```text
personal-expense-tracker/
│
├── config/
│   └── db.js
│
├── controllers/
│   └── transactionController.js
│
├── models/
│   └── Transaction.js
│
├── routes/
│   └── transactionRoutes.js
│
├── frontend/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── app.js
│   └── index.html
│
├── app.js
├── server.js
├── .env
├── .gitignore
└── package.json
```

## Installation and Setup

### 1. Clone the repository

```bash
git clone YOUR_REPOSITORY_URL
```

### 2. Navigate to the project directory

```bash
cd personal-expense-tracker
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file in the root directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

Replace the MongoDB connection string with your own MongoDB URI.

### 5. Start the backend server

```bash
node server.js
```

The server will run at:

```text
http://localhost:5000
```

### 6. Open the frontend

Open `frontend/index.html` in your browser.

## API Endpoints

Base URL: `http://localhost:5000/api/transactions`

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Retrieve all transactions |
| POST | `/` | Create a transaction |
| PUT | `/:id` | Update a transaction |
| DELETE | `/:id` | Delete a transaction |

## How It Works

1. Users enter transaction details through the frontend.
2. JavaScript sends HTTP requests to the Express.js backend using the Fetch API.
3. The backend processes requests through routes and controllers.
4. Mongoose interacts with MongoDB to store and retrieve transaction records.
5. The frontend displays updated financial summaries and visual analytics based on the retrieved data.

## Learning Objectives

This project helped me practice:

- Building a complete frontend and backend application.
- Designing MongoDB schemas using Mongoose.
- Implementing RESTful API endpoints.
- Performing CRUD operations.
- Handling asynchronous JavaScript and Fetch API requests.
- Implementing search, filtering, and sorting.
- Working with dates and financial calculations.
- Creating data visualizations using Chart.js.
- Separating application logic into routes, controllers, and models.

## Future Improvements

- User authentication and personal accounts.
- Monthly spending budgets.
- Recurring transactions.
- Export transactions to CSV or PDF.
- Improved transaction editing interface.

## Author

**Sanket Sugave**

- GitHub: [@sanketsugavedev](https://github.com/sanketsugavedev)

---

*Built as part of my full-stack web development learning journey.*
