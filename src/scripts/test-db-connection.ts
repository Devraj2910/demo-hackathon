import { DatabaseService } from '../services/database.service';

async function testDatabaseConnection() {
  console.log('Testing database connection...');
  
  // Get database service instance
  const dbService = DatabaseService.getInstance();
  
  try {
    // Test connection
    const isConnected = await dbService.testConnection();
    
    if (isConnected) {
      console.log('✅ Connection to database successful!');
      
      // Execute a simple query to get database version
      const result = await dbService.query<{ version: string }>('SELECT version();');
      console.log('🔍 Database version:', result[0].version);
      
      // Get database tables
      const tables = await dbService.query<{ table_name: string }>(
        `SELECT table_name 
         FROM information_schema.tables 
         WHERE table_schema = 'public'
         ORDER BY table_name;`
      );
      
      console.log('📋 Available tables:');
      if (tables.length === 0) {
        console.log('   No tables found');
      } else {
        tables.forEach(table => {
          console.log(`   - ${table.table_name}`);
        });
      }
    } else {
      console.error('❌ Failed to connect to the database');
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error testing database connection:', error);
    process.exit(1);
  } finally {
    // Close connection
    await dbService.disconnect();
    process.exit(0);
  }
}

// Run the test
testDatabaseConnection(); 