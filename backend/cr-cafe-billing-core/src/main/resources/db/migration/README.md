# Database Migration Guide

## Manual Migration Execution

Since Flyway is disabled in the Spring Boot application, you need to run migrations manually in MySQL Workbench.

### Migration Files

- **V1__Create_Complete_Schema.sql** - Complete database schema with payment mode support
- **Add_Payment_Mode_Column.sql** - Add payment_mode column to existing bills table

### How to Run Migration

#### Option 1: Complete Schema (New Database or Missing Tables)
1. **Open MySQL Workbench**
2. **Connect to your database** (`cr_cafe`)
3. **Open V1__Create_Complete_Schema.sql** in MySQL Workbench
4. **Execute the SQL script**

#### Option 2: Add Payment Mode Only (Existing Database)
1. **Open MySQL Workbench**
2. **Connect to your database** (`cr_cafe`)
3. **Open Add_Payment_Mode_Column.sql** in MySQL Workbench
4. **Execute the SQL script**

### Migration Contents

#### V1__Create_Complete_Schema.sql
- ✅ Create all required tables (if they don't exist)
- ✅ Add payment_mode column to bills table
- ✅ Create performance indexes
- ✅ Work for both existing and new databases

#### Add_Payment_Mode_Column.sql
- ✅ Add payment_mode column to existing bills table
- ✅ Set default value to 'CASH' for existing records
- ✅ Create index for payment_mode queries
- ✅ Verify column addition

### Important Notes

- **Safe for existing databases** - Uses `CREATE TABLE IF NOT EXISTS`
- **No sample data** - Only creates schema structure
- **Payment mode support** - Adds `ENUM('CASH', 'ONLINE')` to bills table
- **Choose the right script** - Use V1 for complete setup, Add_Payment_Mode_Column for existing tables

### After Migration

1. **Start the Spring Boot application** - It will now work without Flyway errors
2. **Test the payment mode feature** - Should display correctly in receipts
3. **Verify database structure** - All tables should have proper relationships

### Troubleshooting

If you encounter any issues:
1. Check that the database connection is correct
2. Ensure you have proper permissions on the database
3. Verify that the SQL syntax is compatible with your MySQL version
4. Make sure the bills table exists before running Add_Payment_Mode_Column.sql 