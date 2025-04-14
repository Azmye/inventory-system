<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class FlushAllDatabaseData extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:flush-all';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Flush all data from database tables for demo purposes';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Starting complete database flush...');

        // Get all tables except migrations and users
        $tables = Schema::getConnection()
            ->getDoctrineSchemaManager()
            ->listTableNames();

        // Filter out tables you want to keep (like users table)
        $tablesToKeep = ['migrations', 'users', 'password_reset_tokens', 'failed_jobs', 'personal_access_tokens'];
        $tablesToFlush = array_diff($tables, $tablesToKeep);

        foreach ($tablesToFlush as $table) {
            DB::table($table)->truncate();
            $this->info("Truncated table: {$table}");
        }

        // For SQLite - reclaim space
        if (config('database.default') === 'sqlite') {
            DB::statement('VACUUM;');
            $this->info('Executed VACUUM to optimize SQLite database');
        }

        $this->info('Database flush completed successfully');

        // Optionally, add some seed data back for demonstration purposes
        $this->call('db:seed');
        $this->info('Added fresh demo data');
    }
}
