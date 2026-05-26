<?php

header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');

$action = $_GET['action'] ?? 'summary';

try {
    $response = match ($action) {
        'summary' => getSummary(),
        'revenue' => getRevenue(),
        'orders' => getOrders(),
        'products' => getProducts(),
        default => ['success' => false, 'error' => 'Invalid action'],
    };

    echo json_encode($response, JSON_PRETTY_PRINT);
} catch (Throwable $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}

function getSummary(): array
{
    return [
        'success' => true,
        'data' => [
            'revenue' => [
                'value' => 48250.00,
                'change' => 12.5,
                'period' => 'vs last month',
            ],
            'orders' => [
                'value' => 384,
                'change' => 8.2,
                'period' => 'vs last month',
            ],
            'customers' => [
                'value' => 1247,
                'change' => 3.1,
                'period' => 'vs last month',
            ],
            'conversion' => [
                'value' => 3.24,
                'change' => -0.4,
                'period' => 'vs last month',
            ],
        ],
    ];
}

function getRevenue(): array
{
    $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $currentMonth = (int)date('n');

    $data = [];
    for ($i = 0; $i < 12; $i++) {
        $monthIndex = ($currentMonth - 12 + $i) % 12;
        if ($monthIndex < 0) $monthIndex += 12;

        $base = 25000 + ($i * 2000);
        $variation = rand(-3000, 5000);
        $revenue = max(15000, $base + $variation);
        $expenses = $revenue * (rand(55, 72) / 100);

        $data[] = [
            'month' => $months[$monthIndex],
            'revenue' => round($revenue),
            'expenses' => round($expenses),
            'profit' => round($revenue - $expenses),
        ];
    }

    return ['success' => true, 'data' => $data];
}

function getOrders(): array
{
    $names = ['Ahmad Razak', 'Sarah Chen', 'David Lee', 'Nurul Aisyah', 'James Wong', 'Fatimah Hassan', 'Ryan Tan', 'Aisha Malik', 'Kevin Lim', 'Siti Aminah'];
    $products = ['Web Hosting Pro', 'SSL Certificate', 'Domain Name', 'Cloud Storage', 'Email Suite', 'VPN Service', 'CDN Package', 'Backup Solution'];
    $statuses = ['completed', 'processing', 'shipped', 'pending'];

    $orders = [];
    for ($i = 0; $i < 10; $i++) {
        $status = $statuses[array_rand($statuses)];
        $daysAgo = rand(0, 14);
        $date = date('Y-m-d', strtotime("-{$daysAgo} days"));

        $orders[] = [
            'id' => 'ORD-' . str_pad(rand(1000, 9999), 4, '0', STR_PAD_LEFT),
            'customer' => $names[array_rand($names)],
            'product' => $products[array_rand($products)],
            'amount' => round(rand(1500, 25000) / 100, 2),
            'status' => $status,
            'date' => $date,
        ];
    }

    usort($orders, fn($a, $b) => strtotime($b['date']) - strtotime($a['date']));

    return ['success' => true, 'data' => $orders];
}

function getProducts(): array
{
    return [
        'success' => true,
        'data' => [
            ['name' => 'Web Hosting Pro', 'sales' => 142, 'revenue' => 14200, 'growth' => 15.3],
            ['name' => 'SSL Certificate', 'sales' => 98, 'revenue' => 9800, 'growth' => 8.7],
            ['name' => 'Cloud Storage', 'sales' => 76, 'revenue' => 11400, 'growth' => 22.1],
            ['name' => 'Domain Name', 'sales' => 203, 'revenue' => 6090, 'growth' => -2.4],
            ['name' => 'Email Suite', 'sales' => 54, 'revenue' => 8100, 'growth' => 5.8],
        ],
    ];
}
