# Inventory System Setup Guide

This guide will walk you through setting up the inventory system using Laravel, Inertia.js with React, and PostgreSQL.

## System Requirements

- PHP 8.1 or higher
- Composer
- Node.js & npm
- PostgreSQL database

## Step 1: Clone the Project

```bash
git clone <repository-url>
cd inventory-system
```

## Step 2: Install Dependencies

```bash
composer install
npm install
```

## Step 3: Environment Setup

Copy the example environment file and modify it with your database credentials:

```bash
cp .env.example .env
```

Edit the `.env` file with your PostgreSQL database information:

```
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=inventory_system
DB_USERNAME=your_username
DB_PASSWORD=your_password
```

## Step 4: Generate Application Key

```bash
php artisan key:generate
```

## Step 5: Run Migrations

```bash
php artisan migrate
```

## Step 6: Compile Assets

```bash
npm run dev
```

## Step 7: Start the Development Server

```bash
php artisan serve
```

Visit `http://localhost:8000` in your browser.

## Step 8: Initial Setup

1. Register a new user account
2. Set up your store profile
3. Start adding product categories
4. Add products to your inventory
5. Manage stock levels

## Features Overview

### Single Store Management

- Manage store details and settings
- View store dashboard with performance metrics

### Product Management

- Create, view, update, and delete products
- Organize products into categories
- Track product information including SKU, price, cost, etc.

### Stock Management

- Track stock levels for all products
- Record stock movements (in/out)
- Generate stock reports
- Get low stock alerts
- View transaction history

## Additional Commands

- To run tests: `php artisan test`
- To seed sample data: `php artisan db:seed`
- To clear cache: `php artisan optimize:clear`
