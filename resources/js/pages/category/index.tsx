import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, Category } from '@/types';
import { Head, Link } from '@inertiajs/react';

interface Props {
    categories: Category[];
    breadcrumbs: BreadcrumbItem[];
}

export default function Index({ categories, breadcrumbs }: Props) {
    console.log(categories);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="space-y-6 p-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-bold tracking-tight">Category Management</h1>
                    <Button asChild>
                        <Link href={route('categories.create')}>Add Category</Link>
                    </Button>
                </div>

                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Description</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.map((category) => (
                                <TableRow key={category.id}>
                                    <TableCell className="font-medium">
                                        <Link href={route('categories.edit', category.id)} className="hover:underline">
                                            {category.name}
                                        </Link>
                                    </TableCell>
                                    <TableCell>{category.description || '-'}</TableCell>
                                    <TableCell className="flex justify-center gap-2">
                                        <Button size="sm" asChild>
                                            <Link href={route('categories.edit', category.id)}>Edit</Link>
                                        </Button>
                                        <Button variant="destructive" size="sm" asChild>
                                            <Link href={route('categories.destroy', category.id)}>Delete</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {categories.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No categories found
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
