// app/actions.ts
import clientPromise from "@/lib/mongodb";

export async function testDatabaseConnection() {  // Renommé 
  let isConnected = false;
  try {
    const mongoClient = await clientPromise;
    // Send a ping to confirm a successful connection
    await mongoClient.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
    isConnected = true;
  } catch (error) {
    console.error("Error connecting to the database:", error);
    throw new Error(`Error connecting to the database: ${error}`);
  }

  return { isConnected };
}