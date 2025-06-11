/**
 * AWS RDS PostgreSQL Setup for SupportPartner
 * Enhanced security configuration for partner support data
 */

const AWS = require('aws-sdk');
require('dotenv').config();

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION || 'us-east-1'
});

const rds = new AWS.RDS();

const createRDSInstance = async () => {
  const params = {
    // Instance configuration
    DBInstanceIdentifier: 'supportpartner-db',
    DBInstanceClass: 'db.t3.micro', // Start small, can scale up
    Engine: 'postgres',
    EngineVersion: '15.4',
    AllocatedStorage: 20,
    StorageType: 'gp2',
    StorageEncrypted: true,
    
    // Database configuration
    DBName: 'supportpartner',
    MasterUsername: 'supportpartner_admin',
    MasterUserPassword: process.env.DB_MASTER_PASSWORD || 'TempPassword123!',
    
    // Security configuration
    VpcSecurityGroupIds: [process.env.VPC_SECURITY_GROUP_ID],
    DBSubnetGroupName: process.env.DB_SUBNET_GROUP_NAME,
    PubliclyAccessible: false, // Keep private for security
    
    // Backup and maintenance
    BackupRetentionPeriod: 7,
    PreferredBackupWindow: '03:00-04:00',
    PreferredMaintenanceWindow: 'sun:04:00-sun:05:00',
    
    // Monitoring and logging
    MonitoringInterval: 60,
    MonitoringRoleArn: process.env.MONITORING_ROLE_ARN,
    EnablePerformanceInsights: true,
    PerformanceInsightsRetentionPeriod: 7,
    
    // Enhanced security
    DeletionProtection: true,
    CopyTagsToSnapshot: true,
    Tags: [
      {
        Key: 'Environment',
        Value: 'production'
      },
      {
        Key: 'Application',
        Value: 'SupportPartner'
      },
      {
        Key: 'DataClassification',
        Value: 'Sensitive'
      }
    ]
  };

  try {
    console.log('🚀 Creating RDS PostgreSQL instance for SupportPartner...');
    const result = await rds.createDBInstance(params).promise();
    
    console.log('✅ RDS instance creation initiated successfully!');
    console.log('📋 Instance Details:');
    console.log(`   - Instance ID: ${result.DBInstance.DBInstanceIdentifier}`);
    console.log(`   - Engine: ${result.DBInstance.Engine} ${result.DBInstance.EngineVersion}`);
    console.log(`   - Status: ${result.DBInstance.DBInstanceStatus}`);
    console.log(`   - Storage: ${result.DBInstance.AllocatedStorage}GB (Encrypted: ${result.DBInstance.StorageEncrypted})`);
    
    console.log('\n⏳ Instance is being created... This will take 10-15 minutes.');
    console.log('🔍 Monitor progress in AWS Console: https://console.aws.amazon.com/rds/');
    
    return result;
  } catch (error) {
    console.error('❌ Error creating RDS instance:', error.message);
    throw error;
  }
};

const waitForInstanceReady = async (instanceId) => {
  console.log('⏳ Waiting for instance to be available...');
  
  const params = {
    DBInstanceIdentifier: instanceId
  };
  
  try {
    await rds.waitFor('dBInstanceAvailable', params).promise();
    console.log('✅ RDS instance is now available!');
    
    // Get instance details
    const result = await rds.describeDBInstances(params).promise();
    const instance = result.DBInstances[0];
    
    console.log('📋 Connection Details:');
    console.log(`   - Endpoint: ${instance.Endpoint.Address}`);
    console.log(`   - Port: ${instance.Endpoint.Port}`);
    console.log(`   - Database: ${instance.DBName}`);
    console.log(`   - Username: ${instance.MasterUsername}`);
    
    return instance;
  } catch (error) {
    console.error('❌ Error waiting for instance:', error.message);
    throw error;
  }
};

const createDatabase = async () => {
  try {
    console.log('🏗️ Starting SupportPartner Database Setup...\n');
    
    // Create RDS instance
    const result = await createRDSInstance();
    const instanceId = result.DBInstance.DBInstanceIdentifier;
    
    // Wait for instance to be ready
    const instance = await waitForInstanceReady(instanceId);
    
    console.log('\n🎉 Database setup complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Update your .env file with the connection details');
    console.log('2. Configure your security groups to allow connections');
    console.log('3. Run the database schema initialization');
    console.log('4. Test the connection');
    
    return {
      endpoint: instance.Endpoint.Address,
      port: instance.Endpoint.Port,
      database: instance.DBName,
      username: instance.MasterUsername
    };
    
  } catch (error) {
    console.error('💥 Database setup failed:', error.message);
    process.exit(1);
  }
};

// Environment validation
const validateEnvironment = () => {
  const required = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY',
    'DB_MASTER_PASSWORD'
  ];
  
  const missing = required.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(key => console.error(`   - ${key}`));
    console.error('\n📝 Please update your .env file and try again.');
    process.exit(1);
  }
};

// Main execution
if (require.main === module) {
  validateEnvironment();
  createDatabase();
}

module.exports = {
  createDatabase,
  waitForInstanceReady
};