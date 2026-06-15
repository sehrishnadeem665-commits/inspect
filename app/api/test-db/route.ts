import pool from '@/lib/mysql'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    // Get a connection from the pool
    const connection = await pool.getConnection()
    
    try {
      // Test the connection with a simple query
      const [rows] = await connection.execute('SELECT 1 + 1 AS result')
      
      return NextResponse.json({
        message: 'Database connected successfully!',
        result: rows,
        timestamp: new Date().toISOString()
      }, { status: 200 })
    } finally {
      // Always release the connection back to the pool
      connection.release()
    }
  } catch (error: any) {
    console.error('Database connection test failed:', error)
    
    return NextResponse.json({
      message: 'Database connection failed',
      error: error.message || String(error),
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
