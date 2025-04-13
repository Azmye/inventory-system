import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useForm } from 'react-hook-form';

interface Category {
    id?: number;
    name: string;
    description: string;
}

interface Props {
    category?: Category;
    breadcrumbs: BreadcrumbItem[];
}

export default function NewEditForm({ category, breadcrumbs }: Props) {
    const form = useForm({
        defaultValues: {
            name: category?.name || '',
            description: category?.description || '',
        },
    });

    const {
        formState: { isSubmitting },
        handleSubmit,
    } = form;

    const onSubmit = (data: any) => {
        if (category?.id) {
            router.put(route('categories.update', category.id), data, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show success message
                    console.log('Category updated successfully');
                },
            });
        } else {
            router.post(route('categories.store'), data, {
                preserveScroll: true,
                onSuccess: () => {
                    // Optionally show success message
                    console.log('Category created successfully');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={category?.id ? 'Edit Category' : 'Create Category'} />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{category?.id ? 'Edit Category' : 'Create Category'}</CardTitle>
                                <Button className="cursor-pointer" onClick={() => router.visit(route('categories.index'))} variant="secondary">
                                    Cancel
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Form {...form}>
                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                                    {/* Name Field */}
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="Enter category name" {...field} required />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Description Field */}
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Textarea placeholder="Enter category description" rows={4} {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end space-x-4">
                                        <Button type="submit" disabled={isSubmitting}>
                                            {category?.id ? 'Update' : 'Save'}
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
