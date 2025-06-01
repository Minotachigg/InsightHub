const { MongoClient } = require('mongodb')

async function deleteSpecificUsers() {
  const uri = 'mongodb+srv://admin:admin33@cluster0.bdfgfcd.mongodb.net/BlogNest?retryWrites=true&w=majority'
  const client = new MongoClient(uri)

  const namesToDelete = [
    'John', 'Jane', 'Alice', 'Bob', 'Charlie',
    'David', 'Eva', 'Frank', 'Grace', 'Hank',
  ]

  try {
    await client.connect()
    
    // ✅ Use only the database name here:
    const db = client.db('BlogNest')

    const result = await db.collection('users').deleteMany({
      name: { $in: namesToDelete }
    })

    console.log(`${result.deletedCount} users deleted.`)
  } catch (err) {
    console.error('Error deleting users:', err)
  } finally {
    await client.close()
  }
}

deleteSpecificUsers()
