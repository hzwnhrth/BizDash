# BizDash

Business analytics dashboard built with PHP and JavaScript.

![PHP](https://img.shields.io/badge/PHP-8.0+-777BB4?style=flat-square&logo=php&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)

## Features

- Revenue and sales KPI cards with trend indicators
- Interactive revenue chart rendered with Canvas API
- Recent orders table with status badges
- Top products breakdown
- Date range filtering
- PHP REST API with demo data generator
- Fully responsive dark theme

## Setup

```bash
git clone https://github.com/hzwnhrth/BizDash.git
cd BizDash
php -S localhost:8000
```

Open `http://localhost:8000` in your browser.

## Structure

```
BizDash/
├── api/
│   ├── dashboard.php      # Dashboard data API
│   └── data/
│       └── seed.php        # Demo data generator
├── assets/
│   ├── css/style.css       # Stylesheet
│   └── js/app.js           # Application logic + charts
├── index.html              # Main page
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard.php?action=summary` | KPI summary data |
| GET | `/api/dashboard.php?action=revenue` | Revenue chart data |
| GET | `/api/dashboard.php?action=orders` | Recent orders |
| GET | `/api/dashboard.php?action=products` | Top products |

## License

MIT
