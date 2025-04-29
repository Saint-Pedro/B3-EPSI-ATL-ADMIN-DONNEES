// app/api/movies/[idMovie]/comments/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/movies/{idMovie}/comments:
 *   get:
 *     summary: Get comments for a specific movie
 *     description: Retrieve all comments associated with a specific movie ID.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the movie
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
 *         description: List of comments for the movie
 *       400:
 *         description: Invalid movie ID
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const skip = (page - 1) * limit;

    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    // First, check if the movie exists
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }
    
    // Get comments for this movie
    const comments = await db.collection('comments')
      .find({ movie_id: new ObjectId(idMovie) })
      .skip(skip)
      .limit(limit)
      .toArray();
    
    const total = await db.collection('comments').countDocuments({ movie_id: new ObjectId(idMovie) });
    
    return NextResponse.json({ 
      status: 200, 
      data: { 
        movie_id: idMovie,
        movie_title: movie.title,
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
 * /api/movies/{idMovie}/comments:
 *   post:
 *     summary: Add a comment to a movie
 *     description: Create a new comment associated with a specific movie.
 *     parameters:
 *       - in: path
 *         name: idMovie
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the movie
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
 *               text:
 *                 type: string
 *     responses:
 *       201:
 *         description: Comment added successfully
 *       400:
 *         description: Invalid movie ID or request body
 *       404:
 *         description: Movie not found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idMovie } = params;
    if (!ObjectId.isValid(idMovie)) {
      return NextResponse.json({ status: 400, message: 'Invalid movie ID', error: 'ID format is incorrect' });
    }
    
    // First, check if the movie exists
    const movie = await db.collection('movies').findOne({ _id: new ObjectId(idMovie) });
    
    if (!movie) {
      return NextResponse.json({ status: 404, message: 'Movie not found', error: 'No movie found with the given ID' });
    }

    // In a real application, you would parse the request body
    // For this example we'll create a sample comment
    const comment = {
      name: "Movie Fan",
      email: "movie.fan@example.com",
      movie_id: new ObjectId(idMovie),
      text: "Great cinematography and acting!",
      date: new Date()
    };
    
    const result = await db.collection('comments').insertOne(comment);
    
    return NextResponse.json({ 
      status: 201, 
      message: 'Comment added successfully', 
      data: { 
        movie_id: idMovie,
        movie_title: movie.title,
        comment_id: result.insertedId 
      } 
    });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}