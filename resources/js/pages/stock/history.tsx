import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product, StockTransaction } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';

interface HistoryProps {
    product: Product;
    transactions: {
        data: StockTransaction[];
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
    };
    breadcrumbs: BreadcrumbItem[];
}

export default function History({ product, transactions, breadcrumbs }: HistoryProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Stock History - ${product.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-semibold">Stock History</h2>
                            <p>Product: {product.name}</p>
                        </div>
                        <Button asChild variant="outline">
                            <Link href={route('stocks.index')}>Back to Stocks</Link>
                        </Button>
                    </div>

                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Quantity</TableHead>
                                    <TableHead>User</TableHead>
                                    <TableHead>Reference</TableHead>
                                    <TableHead>Notes</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {transactions.data.map((transaction: StockTransaction) => (
                                    <TableRow key={transaction.id}>
                                        <TableCell>{format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}</TableCell>
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
                                        <TableCell className="max-w-xs truncate">{transaction.notes || 'N/A'}</TableCell>
                                    </TableRow>
                                ))}
                                {transactions.data.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="py-8 text-center text-gray-500">
                                            No transaction history found
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>

                        <div className="mt-6">
                            <Pagination>
                                <PaginationContent>
                                    {/* Previous Page Button */}
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href={transactions.current_page > 1 ? transactions.links[0].url || '#' : undefined}
                                            aria-disabled={transactions.current_page === 1}
                                            className={transactions.current_page === 1 ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>

                                    {/* Page Number Links */}
                                    {transactions.links.slice(1, -1).map((link, i) => {
                                        // If it's ellipsis (typically "...")
                                        if (link.label === '...' || !link.url) {
                                            return (
                                                <PaginationItem key={i}>
                                                    <PaginationEllipsis />
                                                </PaginationItem>
                                            );
                                        }

                                        return (
                                            <PaginationItem key={i}>
                                                <PaginationLink href={link.url} isActive={link.active}>
                                                    {link.label}
                                                </PaginationLink>
                                            </PaginationItem>
                                        );
                                    })}

                                    {/* Next Page Button */}
                                    <PaginationItem>
                                        <PaginationNext
                                            href={
                                                transactions.current_page < transactions.last_page
                                                    ? transactions.links[transactions.links.length - 1].url || '#'
                                                    : undefined
                                            }
                                            aria-disabled={transactions.current_page === transactions.last_page}
                                            className={transactions.current_page === transactions.last_page ? 'pointer-events-none opacity-50' : ''}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
