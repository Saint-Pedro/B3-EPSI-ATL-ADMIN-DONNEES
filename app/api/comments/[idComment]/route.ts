// app/api/comments/[idComment]/route.ts

import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { Db, MongoClient, ObjectId } from 'mongodb';

/**
 * @swagger
 * /api/comments/{idComment}:
 *   get:
 *     summary: Get a comment by ID
 *     description: Retrieve a single comment document by its MongoDB ObjectId.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     responses:
 *       200:
 *         description: Comment found
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    
    const { idComment } = params;
    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }
    
    const comment = await db.collection('comments').findOne({ _id: new ObjectId(idComment) });
    
    if (!comment) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment found with the given ID' });
    }
    
    return NextResponse.json({ status: 200, data: { comment } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/comments/{idComment}:
 *   post:
 *     summary: Create a new comment
 *     description: Add a new comment to the collection.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     responses:
 *       201:
 *         description: Comment created successfully
 *       500:
 *         description: Internal server error
 */
export async function POST(): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');

    const comment = {
      name: "John Doe",
      email: "john.doe@example.com",
      movie_id: new ObjectId("573a1390f29313caabcd42e8"), // Example movie ID
      text: "Great movie, highly recommended!",
      date: new Date()
    };

    const result = await db.collection('comments').insertOne(comment);

    return NextResponse.json({ status: 201, message: 'Comment created successfully', data: { insertedId: result.insertedId } });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/comments/{idComment}:
 *   put:
 *     summary: Update a comment by ID
 *     description: Update the comment document with a specific ID.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     responses:
 *       200:
 *         description: Comment updated successfully
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function PUT(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idComment } = params;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const comment = {
      text: "Updated comment text - this movie was even better on second viewing!",
      date: new Date()
    };

    const result = await db.collection('comments').updateOne(
      { _id: new ObjectId(idComment) },
      { $set: comment }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment to update with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Comment updated successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}

/**
 * @swagger
 * /api/comments/{idComment}:
 *   delete:
 *     summary: Delete a comment by ID
 *     description: Delete a comment document using its ID.
 *     parameters:
 *       - in: path
 *         name: idComment
 *         required: true
 *         schema:
 *           type: string
 *         description: MongoDB ObjectId of the comment
 *     responses:
 *       200:
 *         description: Comment deleted successfully
 *       400:
 *         description: Invalid comment ID
 *       404:
 *         description: Comment not found
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request: Request, { params }: { params: any }): Promise<NextResponse> {
  try {
    const client: MongoClient = await clientPromise;
    const db: Db = client.db('sample_mflix');
    const { idComment } = params;

    if (!ObjectId.isValid(idComment)) {
      return NextResponse.json({ status: 400, message: 'Invalid comment ID', error: 'ID format is incorrect' });
    }

    const result = await db.collection('comments').deleteOne({ _id: new ObjectId(idComment) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ status: 404, message: 'Comment not found', error: 'No comment to delete with the given ID' });
    }

    return NextResponse.json({ status: 200, message: 'Comment deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ status: 500, message: 'Internal Server Error', error: error.message });
  }
}