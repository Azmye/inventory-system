import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

interface Category {
    id: number;
    name: string;
}

interface Props {
    categories: Category[];
    breadcrumbs: BreadcrumbItem[];
    product?: {
        id?: number;
        name: string;
        description: string;
        sku: string;
        barcode: string;
        price: number;
        cost: number;
        tax: number;
        weight: number;
        category_id: number;
        image: string;
        status: 'active' | 'inactive';
        stock?: {
            reorder_level: number;
            location: string;
        };
    };
}

export default function NewEditForm({ categories, breadcrumbs, product }: Props) {
    const form = useForm({
        defaultValues: {
            name: product?.name || '',
            description: product?.description || '',
            sku: product?.sku || '',
            barcode: product?.barcode || '',
            price: product?.price || 0,
            cost: product?.cost || 0,
            tax: product?.tax || 0,
            weight: product?.weight || 0,
            category_id: product?.category_id?.toString() || '',
            image: product?.image || '',
            status: product?.status || 'active',
            initial_stock: 0,
            reorder_level: product?.stock?.reorder_level || 10,
            location: product?.stock?.location || '',
        },
    });

    const {
        formState: { isSubmitting },
        handleSubmit,
    } = form;

    const onSubmit = (data: any) => {
        if (product?.id) {
            router.put(route('products.update', product.id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show success message
                    console.log('Product updated successfully');
                },
            });
        } else {
            router.post(route('products.store'), data, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show success message
                    console.log('Product created successfully');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={product?.id ? 'Edit Product' : 'Add New Product'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{product?.id ? 'Edit Product' : 'Add New Product'}</CardTitle>
                                <Button className="cursor-pointer" onClick={() => router.visit(route('products.index'))} variant="secondary">
                                    Cancel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                                        {/* Product Name */}
                                        <FormField
                                            control={form.control}
                                            name="name"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Product Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter product name" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Category */}
                                        <FormField
                                            control={form.control}
                                            name="category_id"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Category</FormLabel>
                                                    <Select onValueChange={field.onChange} value={field.value}>
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder="Select a category" />
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {categories?.map((category) => (
                                                                <SelectItem key={category.id} value={category.id.toString()}>
                                                                    {category.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* SKU */}
                                        <FormField
                                            control={form.control}
                                            name="sku"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>SKU</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter SKU" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Barcode */}
                                        <FormField
                                            control={form.control}
                                            name="barcode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Barcode</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter barcode" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Price */}
                                        <FormField
                                            control={form.control}
                                            name="price"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Price</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Enter price"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Cost */}
                                        <FormField
                                            control={form.control}
                                            name="cost"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Cost</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Enter cost"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Initial Stock (only for new products) */}
                                        {!product?.id && (
                                            <FormField
                                                control={form.control}
                                                name="initial_stock"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Initial Stock</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                type="number"
                                                                min="0"
                                                                placeholder="Enter initial stock"
                                                                {...field}
                                                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                            />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        )}

                                        {/* Reorder Level */}
                                        <FormField
                                            control={form.control}
                                            name="reorder_level"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Reorder Level</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter reorder level"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Location */}
                                        <FormField
                                            control={form.control}
                                            name="location"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Location</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Enter location in store" {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Tax */}
                                        <FormField
                                            control={form.control}
                                            name="tax"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Tax (%)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            step="0.01"
                                                            placeholder="Enter tax percentage"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Weight */}
                                        <FormField
                                            control={form.control}
                                            name="weight"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Weight (g)</FormLabel>
                                                    <FormControl>
                                                        <Input
                                                            type="number"
                                                            min="0"
                                                            placeholder="Enter weight in grams"
                                                            {...field}
                                                            onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                                        />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        {/* Status */}
                                        <FormField
                                            control={form.control}
                                            name="status"
                                            render={({ field }) => (
                                                <FormItem className="space-y-3">
                                                    <FormLabel>Status</FormLabel>
                                                    <FormControl>
                                                        <RadioGroup onValueChange={field.onChange} value={field.value} className="flex space-x-4">
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="active" id="active" />
                                                                <Label htmlFor="active">Active</Label>
                                                            </div>
                                                            <div className="flex items-center space-x-2">
                                                                <RadioGroupItem value="inactive" id="inactive" />
                                                                <Label htmlFor="inactive">Inactive</Label>
                                                            </div>
                                                        </RadioGroup>
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    {/* Description */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter product description" rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-4">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {product?.id ? 'Update' : 'Save'}
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
