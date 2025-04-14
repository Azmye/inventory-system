import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { idrFormatter } from '@/lib/utils';
import { BreadcrumbItem, Product, Stock, StockTransaction } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { AlertCircle, DollarSign, Package } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type TopSellingProducts = {
    product: Product;
    product_id: number;
    total_sold: number;
};

interface Props {
    breadcrumbs: BreadcrumbItem[];
    summary: {
        totalStockValue: number;
        totalItems: number;
        totalProducts: number;
        lowStockItems: number;
    };
    topSellingProducts: TopSellingProducts[];
    recentTransactions: StockTransaction[];
    stocks: Stock[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function Report({ breadcrumbs, summary, topSellingProducts, recentTransactions, stocks }: Props) {
    console.log({
        topSellingProducts,
        recentTransactions,
        stocks,
    });
    // Prepare data for charts
    const topProductsData = topSellingProducts.map((item) => ({
        name: item.product.name.length > 15 ? item.product.name.substring(0, 15) + '...' : item.product.name,
        value: item.total_sold,
        fullName: item.product.name,
    }));

    // Prepare stock value by category data
    const stockByCategory = stocks.reduce((acc: any, stock: Stock) => {
        const categoryName = stock.product.category ? stock.product.category.name : 'Uncategorized';
        if (!acc[categoryName]) {
            acc[categoryName] = {
                name: categoryName,
                value: 0,
            };
        }
        acc[categoryName].value += stock.quantity * stock.product.cost;
        return acc;
    }, {});

    const stockByCategoryData = Object.values(stockByCategory);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Report" />

            <div className="px-4 py-12 md:px-0">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Stock Report</h2>
                        <Button asChild variant="outline">
                            <Link href={route('stocks.index')}>Back to Stocks</Link>
                        </Button>
                    </div>

                    {/* Summary Cards */}
                    <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Stock Value</CardTitle>
                                <DollarSign className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{idrFormatter.format(summary.totalStockValue)}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Items</CardTitle>
                                <Package className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.totalItems}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="h-4 w-4 text-gray-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.totalProducts}</div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
                                <AlertCircle className="h-4 w-4 text-red-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{summary.lowStockItems}</div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Charts Section */}
                    <div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                        {/* Top Selling Products */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Top Selling Products</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        width={500}
                                        height={300}
                                        data={topProductsData}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 20,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip
                                            formatter={(value: any) => {
                                                return [value, 'Quantity Sold'];
                                            }}
                                            labelFormatter={(label: string) => {
                                                const item = topProductsData.find((p) => p.name === label);
                                                return item ? item.fullName : label;
                                            }}
                                        />
                                        <Bar dataKey="value" fill="#8884d8" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>

                        {/* Stock Value by Category */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Stock Value by Category</CardTitle>
                            </CardHeader>
                            <CardContent className="h-80">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart width={400} height={400}>
                                        <Pie
                                            data={stockByCategoryData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {stockByCategoryData.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value: any) => [idrFormatter.format(value), 'Stock Value']} />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Transactions */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle>Recent Stock Transactions</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Type</TableHead>
                                        <TableHead>Quantity</TableHead>
                                        <TableHead>User</TableHead>
                                        <TableHead>Reference</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {recentTransactions.map((transaction: any) => (
                                        <TableRow key={transaction.id}>
                                            <TableCell>{format(new Date(transaction.created_at), 'MMM d, yyyy')}</TableCell>
                                            <TableCell>{transaction.product.name}</TableCell>
                                            <TableCell>
                                                <Badge
                                                    variant={
                                                        transaction.type === 'in' ? 'default' : transaction.type === 'out' ? 'destructive' : 'outline'
                                                    }
                                                >
                                                    {transaction.type === 'in' ? 'Stock In' : transaction.type === 'out' ? 'Stock Out' : 'Adjustment'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell>{transaction.quantity}</TableCell>
                                            <TableCell>{transaction.user.name}</TableCell>
                                            <TableCell>{transaction.reference || 'N/A'}</TableCell>
                                        </TableRow>
                                    ))}
                                    {recentTransactions.length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={6} className="py-4 text-center text-gray-500">
                                                No recent transactions
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {/* Low Stock Items */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Low Stock Items</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Product</TableHead>
                                        <TableHead>Current Stock</TableHead>
                                        <TableHead>Reorder Level</TableHead>
                                        <TableHead>Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {stocks
                                        .filter((stock: any) => stock.quantity <= stock.reorder_level)
                                        .map((stock: any) => (
                                            <TableRow key={stock.id}>
                                                <TableCell>{stock.product.name}</TableCell>
                                                <TableCell>
                                                    <div className="flex items-center">
                                                        <AlertCircle className="mr-2 h-4 w-4 text-red-500" />
                                                        {stock.quantity}
                                                    </div>
                                                </TableCell>
                                                <TableCell>{stock.reorder_level}</TableCell>
                                                <TableCell>
                                                    <Button asChild variant="ghost" size="sm">
                                                        <Link href={route('stocks.create')}>Restock</Link>
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    {stocks.filter((stock: any) => stock.quantity <= stock.reorder_level).length === 0 && (
                                        <TableRow>
                                            <TableCell colSpan={4} className="py-4 text-center text-gray-500">
                                                No low stock items
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
