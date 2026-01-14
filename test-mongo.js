// test-mongo.js
const { MongoClient } = require('mongodb');

async function testConnection() {
    const uri = 'mongodb://127.0.0.1:27017';
    const client = new MongoClient(uri);
    
    try {
        await client.connect();
        console.log('✅ Connected to MongoDB successfully!');
        
        // List all databases
        const adminDb = client.db().admin();
        const databases = await adminDb.listDatabases();
        
        console.log('\n📊 Available Databases:');
        databases.databases.forEach(db => {
            console.log(`  - ${db.name} (${db.sizeOnDisk} bytes)`);
        });
        
        // Check if moodlight database exists
        const moodlightExists = databases.databases.some(db => db.name === 'moodlight');
        
        if (!moodlightExists) {
            console.log('\n✨ Creating moodlight database...');
            const db = client.db('moodlight');
            // Create a test collection to initialize the database
            await db.collection('test').insertOne({ message: 'MoodLight database initialized', timestamp: new Date() });
            console.log('✅ moodlight database created!');
        } else {
            console.log('\n✅ moodlight database already exists!');
        }
        
    } catch (error) {
        console.error('❌ Connection failed:', error.message);
    } finally {
        await client.close();
        console.log('\n🔗 Connection closed');
    }
}

testConnection();