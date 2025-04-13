import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Product } from '@/types';
import { Head, router } from '@inertiajs/react';
import { AlertCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

interface Props {
    products: Product[];
    breadcrumbs: BreadcrumbItem[];
    type: 'in' | 'out' | 'adjustment';
    stock?: {
        id?: number;
        product_id: string;
        quantity: number;
        reference: string;
        notes: string;
        type: 'in' | 'out' | 'adjustment';
    };
}

export default function StockForm({ products, breadcrumbs, type, stock }: Props) {
    const form = useForm({
        defaultValues: {
            product_id: stock?.product_id || '',
            quantity: stock?.quantity || 1,
            type: stock?.type || type,
            reference: stock?.reference || '',
            notes: stock?.notes || '',
        },
    });

    const {
        formState: { isSubmitting },
        handleSubmit,
        watch,
    } = form;

    const productId = watch('product_id');
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

    // Find the selected product when product_id changes
    useEffect(() => {
        if (productId) {
            const product = products.find((p) => p.id.toString() === productId);
            setSelectedProduct(product || null);
        } else {
            setSelectedProduct(null);
        }
    }, [productId, products]);

    const onSubmit = (data: any) => {
        if (stock?.id) {
            router.put(route('stocks.update', stock.id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Stock record updated successfully');
                },
            });
        } else {
            router.post(route('stocks.store'), data, {
                preserveScroll: true,
                onSuccess: () => {
                    console.log('Stock record created successfully');
                },
            });
        }
    };

    const title = type === 'in' ? 'Stock In' : type === 'out' ? 'Stock Out' : 'Adjust Stock';

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={title} />

            <div className="py-6">
                <div className="sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{title}</CardTitle>
                                <Button className="cursor-pointer" onClick={() => router.visit(route('stocks.index'))} variant="secondary">
                                    Cancel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Product Selection */}
                                    <FormField
                                        control={form.control}
                                        name="product_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product</FormLabel>
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a product" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {products.map((product) => (
                                                            <SelectItem key={product.id} value={product.id.toString()}>
                                                                {product.name}
                                                                {type === 'out' && ` (Current: ${product.stock.quantity || 0})`}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Low stock warning */}
                                    {selectedProduct && type === 'out' && selectedProduct.stock.quantity <= 0 && (
                                        <Alert variant="destructive" className="mb-4">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertDescription>This product is out of stock</AlertDescription>
                                        </Alert>
                                    )}

                                    {/* Quantity */}
                                    <FormField
                                        control={form.control}
                                        name="quantity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Quantity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        placeholder="Enter quantity"
                                                        {...field}
                                                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Reference */}
                                    <FormField
                                        control={form.control}
                                        name="reference"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Reference</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Invoice or reference number" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Notes */}
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Notes</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Additional notes or comments" rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-4">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {isSubmitting ? 'Processing...' : stock?.id ? 'Update' : 'Submit'}
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
