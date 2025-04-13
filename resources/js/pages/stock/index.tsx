import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Stock } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { ArrowDownToLine, ArrowUpFromLine, BarChart4, History } from 'lucide-react';

interface Props {
    stocks: (Stock & { product: { name: string; sku: string } })[];
    breadcrumbs: BreadcrumbItem[];
}

export default function Index({ stocks, breadcrumbs }: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Stock Management" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl px-4 sm:px-6">
                    <div className="mb-6 flex items-center justify-between">
                        <h1 className="text-2xl font-semibold">Stock Management</h1>
                        <div className="flex gap-2">
                            <Button asChild variant="outline" size="sm">
                                <Link href={route('stocks.report')}>
                                    <BarChart4 className="mr-2 h-4 w-4" />
                                    Stock Report
                                </Link>
                            </Button>
                            <Button asChild variant="outline" size="sm">
                                <Link href={route('stocks.out')}>
                                    <ArrowUpFromLine className="mr-2 h-4 w-4" />
                                    Stock Out
                                </Link>
                            </Button>
                            <Button asChild size="sm">
                                <Link href={route('stocks.create')}>
                                    <ArrowDownToLine className="mr-2 h-4 w-4" />
                                    Stock In
                                </Link>
                            </Button>
                        </div>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Product</TableHead>
                                    <TableHead>SKU</TableHead>
                                    <TableHead>Current Stock</TableHead>
                                    <TableHead>Reorder Level</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {stocks.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={7} className="py-6 text-center text-gray-500">
                                            No stock records found. Add products to manage inventory.
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    stocks.map((stock) => (
                                        <TableRow key={stock.id}>
                                            <TableCell className="font-medium">{stock.product.name}</TableCell>
                                            <TableCell>{stock.product.sku || 'N/A'}</TableCell>
                                            <TableCell>{stock.quantity}</TableCell>
                                            <TableCell>{stock.reorder_level}</TableCell>
                                            <TableCell>
                                                {stock.quantity <= stock.reorder_level ? (
                                                    <Badge variant="destructive">Low Stock</Badge>
                                                ) : (
                                                    <Badge variant="outline">In Stock</Badge>
                                                )}
                                            </TableCell>
                                            <TableCell>{stock.location || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Button asChild variant="ghost" size="sm">
                                                    <Link href={route('stocks.history', stock.product_id)}>
                                                        <History className="mr-2 h-4 w-4" />
                                                        History
                                                    </Link>
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
