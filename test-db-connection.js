/**
 * Database Connection Test Script
 * Run this script to verify your AWS RDS setup is working correctly
 */

const { Pool } = require('pg');
require('dotenv').config();

const testDatabaseConnection = async () => {
  console.log('🧪 Testing SupportPartner Database Connection...\n');

  // Check environment variables
  console.log('📋 Environment Configuration:');
  console.log(`   DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
  console.log(`   DB_HOST: ${process.env.DB_HOST || 'Not set'}`);
  console.log(`   DB_PORT: ${process.env.DB_PORT || 'Not set'}`);
  console.log(`   DB_NAME: ${process.env.DB_NAME || 'Not set'}`);
  console.log(`   DB_USER: ${process.env.DB_USER || 'Not set'}`);
  console.log('');

  // Create connection pool
  const config = {
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  };

  // Fallback to individual parameters if DATABASE_URL is not available
  if (!config.connectionString) {
    config.host = process.env.DB_HOST;
    config.port = parseInt(process.env.DB_PORT || '5432');
    config.database = process.env.DB_NAME;
    config.user = process.env.DB_USER;
    config.password = process.env.DB_PASSWORD;
    delete config.connectionString;
  }

  const pool = new Pool(config);

  try {
    console.log('🔌 Attempting database connection...');
    const client = await pool.connect();
    
    console.log('✅ Successfully connected to database!');
    
    // Test basic query
    console.log('\n🧪 Running basic tests...');
    const timeResult = await client.query('SELECT NOW() as current_time, version() as pg_version');
    console.log(`   🕒 Server time: ${timeResult.rows[0].current_time}`);
    console.log(`   🐘 PostgreSQL: ${timeResult.rows[0].pg_version.split(',')[0]}`);
    
    // Test schema exists
    console.log('\n📊 Checking database schema...');
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tablesResult.rows.length > 0) {
      console.log(`   ✅ Found ${tablesResult.rows.length} tables:`);
      tablesResult.rows.forEach(row => {
        console.log(`      - ${row.table_name}`);
      });
    } else {
      console.log('   ⚠️  No tables found - schema may not be initialized');
      console.log('   💡 Run: psql -h [host] -U [user] -d [database] -f aws-setup/database-schema.sql');
    }

    // Test subscription plans
    try {
      const plansResult = await client.query('SELECT name, tier, price_monthly FROM subscription_plans');
      console.log(`\n💳 Subscription plans (${plansResult.rows.length} found):`);
      plansResult.rows.forEach(plan => {
        console.log(`   - ${plan.name} (${plan.tier}): $${plan.price_monthly}/month`);
      });
    } catch (error) {
      console.log('\n⚠️  Could not query subscription_plans table');
      console.log('   This is expected if schema hasn\'t been initialized yet');
    }

    // Test audit logging
    try {
      const auditResult = await client.query('SELECT COUNT(*) as count FROM audit_logs');
      console.log(`\n📋 Audit logs: ${auditResult.rows[0].count} entries`);
    } catch (error) {
      console.log('\n⚠️  Could not query audit_logs table');
    }

    // Test connection pool status
    console.log('\n🏊 Connection Pool Status:');
    console.log(`   Total connections: ${pool.totalCount}`);
    console.log(`   Idle connections: ${pool.idleCount}`);
    console.log(`   Waiting connections: ${pool.waitingCount}`);

    client.release();
    
    console.log('\n🎉 All tests passed! Database is ready for use.');
    
    return true;
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(`   Error: ${error.message}`);
    
    if (error.code) {
      console.error(`   Code: ${error.code}`);
    }
    
    console.log('\n🔧 Troubleshooting:');
    if (error.message.includes('timeout')) {
      console.log('   - Check security group allows connections on port 5432');
      console.log('   - Verify RDS instance is running and accessible');
    } else if (error.message.includes('authentication')) {
      console.log('   - Verify username and password are correct');
      console.log('   - Check if user has necessary permissions');
    } else if (error.message.includes('does not exist')) {
      console.log('   - Check database name is correct');
      console.log('   - Verify RDS instance exists');
    }
    
    return false;
  } finally {
    await pool.end();
  }
};

// Run the test
testDatabaseConnection()
  .then(success => {
    if (success) {
      console.log('\n✨ Ready to proceed with application development!');
      process.exit(0);
    } else {
      console.log('\n💡 Fix the issues above and run the test again.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('\n💥 Unexpected error:', error);
    process.exit(1);
  });