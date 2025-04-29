// app/api/theaters/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient } from 'mongodb';

/**
 * @swagger
 * /api/theaters:
 *   get:
 *     summary: Get all theaters
 *     description: Retrieve a list of all theaters with pagination.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of theaters to return per page
 *     responses:
 *       200:
 *         description: A list of theaters
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const theaters = await db.collection('theaters')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection('theaters').countDocuments();
    
    return NextResponse.json({ 
      status: 200, 
      data: { 
        theaters,
        pagination: {
          total,
          page,
          pages: Math.ceil(total / limit)
        }
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/theaters:
 *   post:
 *     summary: Create a new theater
 *     description: Add a new theater to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               theaterId:
 *                 type: integer
 *               location:
 *                 type: object
 *                 properties:
 *                   address:
 *                     type: object
 *                   geo:
 *                     type: object
 *     responses:
 *       201:
 *         description: Theater created successfully
 *       400:
 *         description: Invalid request body
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    // In a real application, you would parse the request body
    // For this example we'll create a sample theater
    const theater = {
      theaterId: 10002,
      location: {
        address: {
          street1: "555 Broadway",
          city: "Los Angeles",
          state: "CA",
          zipcode: "90001"
        },
        geo: {
          type: "Point",
          coordinates: [-118.2437, 34.0522]
        }
      }
    };
    
    const result = await db.collection('theaters').insertOne(theater);
    
    return NextResponse.json({ 
      status: 201, 
      message: 'Theater created successfully', 
      data: { 
        insertedId: result.insertedId 
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}