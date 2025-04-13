import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Store, type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { AlertTriangle, DollarSign, Package, TrendingUp } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

type Stats = {
    productCount: number;
    stockValue: number;
    lowStockCount: number;
};

interface Props {
    stats: Stats;
    store: Store;
}

export default function Dashboard({ stats, store }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <h1 className="mb-6 text-2xl font-bold">Inventory Dashboard</h1>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="col-span-4">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle>Muhammad Azmi's Store</CardTitle>
                                <Button asChild>
                                    <Link href={route('store.profile')}>View</Link>
                                </Button>
                            </CardHeader>
                            <CardContent>
                                <p>Address: {store.address}</p>
                                <p className="text-muted-foreground">Phone: {store.phone}</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                                <Package className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.productCount}</div>
                                <p className="text-muted-foreground text-xs">Items in inventory</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Low Stock</CardTitle>
                                <AlertTriangle className="h-4 w-4 text-amber-500" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{stats.lowStockCount}</div>
                                <p className="text-muted-foreground text-xs">Products need reordering</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Stock Value</CardTitle>
                                <DollarSign className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">${stats.stockValue.toLocaleString()}</div>
                                <p className="text-muted-foreground text-xs">Total inventory value</p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-sm font-medium">Stock Movements</CardTitle>
                                <TrendingUp className="text-muted-foreground h-4 w-4" />
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">12</div>
                                <p className="text-muted-foreground text-xs">Today's transactions</p>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Products</CardTitle>
                                <CardDescription>Recently added products</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* <ul className="space-y-2">
                                    {recentProducts.map((product) => (
                                        <li key={product.id} className="bg-secondary flex items-center gap-2 rounded-md p-2">
                                            <PackageOpen className="h-4 w-4" />
                                            <span>{product.name}</span>
                                        </li>
                                    ))}
                                </ul> */}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Low Stock Products</CardTitle>
                                <CardDescription>Products that need reordering</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {/* Low stock products would go here */}
                                <p className="text-muted-foreground">No data available</p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
