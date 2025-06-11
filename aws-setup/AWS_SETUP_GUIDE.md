# 🚀 AWS Database Setup Guide for SupportPartner

This guide will walk you through setting up a production-ready AWS RDS PostgreSQL database for the SupportPartner application.

## 📋 Prerequisites

Before starting, ensure you have:

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js** and npm installed
4. **Git** access to this repository

## 🔧 Step 1: AWS IAM Setup

### Create IAM User for RDS Management

1. **Go to AWS Console → IAM → Users**
2. **Click "Create User"**
3. **User Details:**
   - Username: `supportpartner-db-admin`
   - Access type: ✅ Programmatic access

4. **Attach Permissions:**
   ```
   AmazonRDSFullAccess
   AmazonVPCReadOnlyAccess
   CloudWatchReadOnlyAccess
   ```

5. **Save the Access Key ID and Secret Access Key** securely

### Create RDS Monitoring Role (Optional but Recommended)

```bash
# Create trust policy
cat > rds-monitoring-trust-policy.json << EOF
{
  \"Version\": \"2012-10-17\",
  \"Statement\": [
    {
      \"Effect\": \"Allow\",
      \"Principal\": {
        \"Service\": \"monitoring.rds.amazonaws.com\"
      },
      \"Action\": \"sts:AssumeRole\"
    }
  ]
}
EOF

# Create role
aws iam create-role --role-name rds-monitoring-role --assume-role-policy-document file://rds-monitoring-trust-policy.json

# Attach policy
aws iam attach-role-policy --role-name rds-monitoring-role --policy-arn arn:aws:iam::aws:policy/service-role/AmazonRDSEnhancedMonitoringRole
```

## ⚙️ Step 2: Environment Configuration

### Create Environment File

1. **Copy the example environment file:**
   ```bash
   cp aws-setup/env.example .env.aws
   ```

2. **Update the configuration:**
   ```bash
   # Required AWS credentials
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=xxxxx...
   AWS_REGION=us-east-1
   
   # Set a strong master password
   DB_MASTER_PASSWORD=YourVerySecurePassword123!
   ```

### Security Group Setup (Optional)

If you want custom VPC configuration:

```bash
# Create security group
aws ec2 create-security-group --group-name supportpartner-db-sg --description \"SupportPartner Database Security Group\"

# Allow PostgreSQL access (adjust source as needed)
aws ec2 authorize-security-group-ingress --group-name supportpartner-db-sg --protocol tcp --port 5432 --cidr 0.0.0.0/0
```

## 🏗️ Step 3: Create RDS Instance

### Install Dependencies

```bash
npm install aws-sdk dotenv
```

### Run Database Setup Script

```bash
# Load environment variables
source .env.aws

# Run the setup script
node aws-setup/aws-rds-setup.js
```

**Expected Output:**
```
🚀 Creating RDS PostgreSQL instance for SupportPartner...
✅ RDS instance creation initiated successfully!
📋 Instance Details:
   - Instance ID: supportpartner-db
   - Engine: postgres 15.4
   - Status: creating
   - Storage: 20GB (Encrypted: true)

⏳ Instance is being created... This will take 10-15 minutes.
🔍 Monitor progress in AWS Console: https://console.aws.amazon.com/rds/
```

### Wait for Completion

The script will automatically wait for the instance to be ready. You can also monitor progress in the AWS Console.

## 📊 Step 4: Initialize Database Schema

### Connect to Database

Once the instance is ready, you'll get connection details:

```
📋 Connection Details:
   - Endpoint: supportpartner-db.xxxxxxxxx.us-east-1.rds.amazonaws.com
   - Port: 5432
   - Database: supportpartner
   - Username: supportpartner_admin
```

### Run Schema Creation

```bash
# Install PostgreSQL client (if not already installed)
# macOS: brew install postgresql
# Ubuntu: sudo apt-get install postgresql-client
# Windows: Download from postgresql.org

# Connect and run schema
psql -h your-endpoint -U supportpartner_admin -d supportpartner -f aws-setup/database-schema.sql
```

**Expected Output:**
```sql
NOTICE:  🎉 SupportPartner database schema created successfully!
NOTICE:  📊 Tables created: 25
NOTICE:  🔒 Row Level Security enabled for user data protection
NOTICE:  📝 Audit trails configured for compliance
NOTICE:  🚀 Ready for application deployment!
```

## 🔐 Step 5: Update Application Configuration

### Update Main Environment File

```bash
# Update .env with database connection
echo \"DATABASE_URL=postgresql://supportpartner_admin:YOUR_PASSWORD@YOUR_ENDPOINT:5432/supportpartner\" >> .env
```

### Test Database Connection

Create a test script to verify connectivity:

```javascript
// test-db-connection.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function testConnection() {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('✅ Database connection successful!');
    console.log('🕒 Server time:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
  } finally {
    await pool.end();
  }
}

testConnection();
```

Run the test:
```bash
node test-db-connection.js
```

## 🛡️ Step 6: Security Hardening

### Update Security Group Rules

```bash
# Remove broad access and add specific IPs
aws ec2 revoke-security-group-ingress --group-name supportpartner-db-sg --protocol tcp --port 5432 --cidr 0.0.0.0/0

# Add your specific IP (replace with your actual IP)
aws ec2 authorize-security-group-ingress --group-name supportpartner-db-sg --protocol tcp --port 5432 --cidr YOUR_IP/32
```

### Enable Additional Monitoring

```bash
# Enable log exports (optional but recommended)
aws rds modify-db-instance --db-instance-identifier supportpartner-db --cloudwatch-logs-configuration '{\"postgresql\":{\"Enable\":true}}'
```

## 📈 Step 7: Monitoring Setup

### CloudWatch Alarms

```bash
# CPU utilization alarm
aws cloudwatch put-metric-alarm --alarm-name \"SupportPartner-DB-CPU\" --alarm-description \"High CPU on SupportPartner DB\" --metric-name CPUUtilization --namespace AWS/RDS --statistic Average --period 300 --threshold 80 --comparison-operator GreaterThanThreshold --dimensions Name=DBInstanceIdentifier,Value=supportpartner-db --evaluation-periods 2

# Connection count alarm
aws cloudwatch put-metric-alarm --alarm-name \"SupportPartner-DB-Connections\" --alarm-description \"High connections on SupportPartner DB\" --metric-name DatabaseConnections --namespace AWS/RDS --statistic Average --period 300 --threshold 40 --comparison-operator GreaterThanThreshold --dimensions Name=DBInstanceIdentifier,Value=supportpartner-db --evaluation-periods 2
```

## 🔄 Step 8: Backup Configuration

### Automated Backups

The instance is configured with:
- ✅ **7-day backup retention**
- ✅ **Daily backups at 3:00 AM UTC**
- ✅ **Point-in-time recovery enabled**

### Manual Snapshot

```bash
# Create manual snapshot
aws rds create-db-snapshot --db-instance-identifier supportpartner-db --db-snapshot-identifier supportpartner-initial-snapshot
```

## 🧪 Step 9: Testing

### Basic Functionality Test

```sql
-- Test user creation
INSERT INTO user_profiles (email, name, partner_name) 
VALUES ('test@example.com', 'Test User', 'Test Partner');

-- Verify subscription plans
SELECT * FROM subscription_plans;

-- Test audit logging
SELECT * FROM audit_logs ORDER BY timestamp DESC LIMIT 5;
```

## 🚀 Step 10: Application Integration

### Backend API Setup

The database is now ready for integration with your Node.js backend. Key integration points:

1. **Connection Pool:** Use `pg` with connection pooling
2. **Migrations:** Consider using Prisma or similar ORM
3. **Row Level Security:** Implement user context setting
4. **Error Handling:** Proper database error handling

### Next Steps

1. **Create Backend API** endpoints for data operations
2. **Implement Authentication** with Supabase integration
3. **Set up Production Deployment** with environment variables
4. **Configure SSL** for secure connections

## 📞 Support & Troubleshooting

### Common Issues

**Connection Timeout:**
- Check security group rules
- Verify endpoint and port
- Ensure instance is in \"available\" state

**Authentication Failed:**
- Verify username and password
- Check if user has necessary permissions

**SSL Connection Issues:**
```javascript
// For production, add SSL configuration
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync('path/to/rds-cert.pem')
  }
});
```

### Monitoring Commands

```bash
# Check instance status
aws rds describe-db-instances --db-instance-identifier supportpartner-db

# View recent events
aws rds describe-events --source-identifier supportpartner-db --source-type db-instance

# Check performance insights
aws pi get-resource-metrics --service-type RDS --identifier supportpartner-db --metric-queries file://metrics-query.json
```

## 🎉 Completion Checklist

- [ ] AWS RDS instance created and running
- [ ] Database schema initialized successfully
- [ ] Security groups configured properly
- [ ] Backup and monitoring enabled
- [ ] Connection tested from application
- [ ] Environment variables updated
- [ ] SSL/TLS configured for production
- [ ] Initial test data inserted

Your SupportPartner database is now ready for production use! 🚀