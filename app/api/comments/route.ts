// app/api/comments/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient } from 'mongodb';

/**
 * @swagger
 * /api/comments:
 *   get:
 *     summary: Get all comments
 *     description: Retrieve a list of all comments with pagination.
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
 *         description: Number of comments to return per page
 *     responses:
 *       200:
 *         description: A list of comments
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
    
    const comments = await db.collection('comments')
      .find({})
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection('comments').countDocuments();
    
    return NextResponse.json({ 
      status: 200, 
      data: { 
        comments,
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
 * /api/comments:
 *   post:
 *     summary: Create a new comment
 *     description: Add a new comment to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               movie_id:
 *                 type: string
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment created successfully
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
    // For this example we'll create a sample comment
    const comment = {
      name: "API User",
      email: "api.user@example.com",
      movie_id: "573a1390f29313caabcd42e8", // Example movie ID
      text: "Comment created through API",
      date: new Date()
    };
    
    const result = await db.collection('comments').insertOne(comment);
    
    return NextResponse.json({ 
      status: 201, 
      message: 'Comment created successfully', 
      data: { 
        insertedId: result.insertedId 
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}