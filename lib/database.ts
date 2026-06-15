import pool from '@/lib/mysql';

// Generic query function for executing SQL - returns both rows and metadata
export async function query(sql: string, params?: any[]): Promise<any> {
  const [rows, fields] = await pool.execute(sql, params || [])
  return { rows, fields, insertId: (rows as any)?.insertId }
}

// Backwards compatibility helper - just returns rows
export async function queryRows(sql: string, params?: any[]): Promise<any[]> {
  const result = await query(sql, params)
  return result.rows || []
}

export interface Review {
  id: number;
  name: string;
  email: string;
  rating: number;
  comment: string;
  status: 'pending' | 'approved';
  created_at: string;
  approved_at?: string | null;
}

export async function insertReview(review: Omit<Review, 'id' | 'created_at' | 'status' | 'approved_at'>): Promise<Review> {
  let conn;
  try {
    console.log('📝 Getting database connection...');
    conn = await pool.getConnection();
    console.log('✅ Database connection obtained');
    
    console.log('📝 Executing INSERT query...');
    const [result]: any = await conn.execute(
      'INSERT INTO reviews (name, email, rating, comment, status, created_at) VALUES (?, ?, ?, ?, ?, NOW())',
      [review.name, review.email, review.rating, review.comment, 'pending']
    );
    console.log('✅ INSERT successful, insertId:', result.insertId);
    
    const insertId = result.insertId;
    console.log('📝 Fetching inserted review...');
    const [rows]: any = await conn.execute('SELECT * FROM reviews WHERE id = ?', [insertId]);
    console.log('✅ Review fetched successfully:', rows[0]);
    
    return rows[0];
  } catch (error) {
    console.error('❌ Error in insertReview:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  } finally {
    if (conn) {
      console.log('🔄 Releasing database connection...');
      conn.release();
      console.log('✅ Connection released');
    }
  }
}

export async function getAllReviews(): Promise<Review[]> {
  const [rows]: any = await pool.execute('SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC', ['approved']);
  return rows || [];
}

export async function getPendingReviews(): Promise<Review[]> {
  const [rows]: any = await pool.execute('SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC', ['pending']);
  return rows || [];
}

export async function approveReview(id: number): Promise<Review> {
  const conn = await pool.getConnection();
  try {
    await conn.execute('UPDATE reviews SET status = ?, approved_at = NOW() WHERE id = ?', ['approved', id]);
    const [rows]: any = await conn.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function rejectReview(id: number): Promise<Review> {
  const conn = await pool.getConnection();
  try {
    await conn.execute('UPDATE reviews SET status = ? WHERE id = ?', ['rejected', id]);
    const [rows]: any = await conn.execute('SELECT * FROM reviews WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function deleteReview(id: number): Promise<void> {
  await pool.execute('DELETE FROM reviews WHERE id = ?', [id]);
}

export async function getRejectedReviews(): Promise<Review[]> {
  const [rows]: any = await pool.execute('SELECT * FROM reviews WHERE status = ? ORDER BY created_at DESC', ['rejected']);
  return rows || [];
}

export async function getReviews(filters: { status?: string | undefined; minRating?: number | undefined; startDate?: string | undefined; endDate?: string | undefined; search?: string | undefined } = {}): Promise<Review[]> {
  const { status, minRating, startDate, endDate, search } = filters
  const params: any[] = []
  let sql = 'SELECT * FROM reviews WHERE 1=1'
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  if (minRating) {
    sql += ' AND rating >= ?'
    params.push(minRating)
  }
  if (startDate) {
    sql += ' AND created_at >= ?'
    params.push(startDate)
  }
  if (endDate) {
    sql += ' AND created_at <= ?'
    params.push(endDate)
  }
  if (search) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR comment LIKE ?)'
    const like = `%${search}%`
    params.push(like, like, like)
  }
  sql += ' ORDER BY created_at DESC'
  const [rows]: any = await pool.execute(sql, params)
  return rows || []
}

export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone_number?: string | null;
  whatsapp_number?: string | null;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'handled' | 'deleted';
  created_at: string;
}

export async function insertContactSubmission(submission: { name: string; email: string; phone_number?: string | null; whatsapp_number?: string | null; subject: string; message: string; status?: string }) {
  const conn = await pool.getConnection();
  try {
    const [result]: any = await conn.execute(
      'INSERT INTO contact_submissions (name, email, phone_number, whatsapp_number, subject, message, status, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, NOW())',
      [submission.name, submission.email, submission.phone_number || null, submission.whatsapp_number || null, submission.subject, submission.message, submission.status || 'new']
    );
    const insertId = result.insertId;
    const [rows]: any = await conn.execute('SELECT * FROM contact_submissions WHERE id = ?', [insertId]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function getContactSubmissions(filters: { status?: string | undefined; q?: string | undefined; startDate?: string | undefined; endDate?: string | undefined } = {}) {
  const { status, q, startDate, endDate } = filters
  const params: any[] = []
  let sql = 'SELECT * FROM contact_submissions WHERE 1=1'
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  if (q) {
    sql += ' AND (name LIKE ? OR email LIKE ? OR subject LIKE ? OR message LIKE ?)'
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
  }
  if (startDate) {
    sql += ' AND created_at >= ?'
    params.push(startDate)
  }
  if (endDate) {
    sql += ' AND created_at <= ?'
    params.push(endDate)
  }
  sql += ' ORDER BY created_at DESC'
  const [rows]: any = await pool.execute(sql, params)
  return rows || []
}

export async function updateContactStatus(id: number, status: string) {
  const conn = await pool.getConnection();
  try {
    await conn.execute('UPDATE contact_submissions SET status = ? WHERE id = ?', [status, id]);
    const [rows]: any = await conn.execute('SELECT * FROM contact_submissions WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function deleteContactSubmission(id: number) {
  await pool.execute('DELETE FROM contact_submissions WHERE id = ?', [id]);
}

export async function getSetting(key: string) {
  const [[row]]: any = await pool.execute('SELECT value FROM settings WHERE `key` = ?', [key])
  if (!row) return null
  try {
    return JSON.parse(row.value)
  } catch (e) {
    return row.value
  }
}

export async function setSetting(key: string, value: any) {
  const json = JSON.stringify(value)
  await pool.execute('INSERT INTO settings (`key`, `value`) VALUES (?, ?) ON DUPLICATE KEY UPDATE `value` = VALUES(`value`), updated_at = NOW()', [key, json])
}



export interface Order {
  id: number;
  order_number: string;
  customer_email: string;
  vehicle_type: string;
  identification_type: 'vin' | 'plate';
  identification_value: string;
  vin_number?: string | null;
  package_type: string;
  country_code: string;
  state?: string | null;
  currency: string;
  amount: number;
  payment_status: 'pending' | 'completed' | 'failed';
  payment_provider?: string | null;
  payment_id?: string | null;
  status: 'pending' | 'processing' | 'completed' | 'cancelled';
  report_url?: string | null;
  created_at: string;
  updated_at: string;
  completed_at?: string | null;
}

function normalizeOrder(row: any): Order {
  if (!row) return row;
  return {
    id: Number(row.id),
    order_number: row.order_number,
    customer_email: row.customer_email,
    vehicle_type: row.vehicle_type,
    identification_type: row.identification_type,
    identification_value: row.identification_value,
    vin_number: row.vin_number || null,
    package_type: row.package_type,
    country_code: row.country_code,
    state: row.state || null,
    currency: row.currency,
    amount: typeof row.amount === 'string' ? parseFloat(row.amount) : Number(row.amount),
    payment_status: row.payment_status,
    payment_provider: row.payment_provider || null,
    payment_id: row.payment_id || null,
    status: row.status,
    report_url: row.report_url || null,
    created_at: row.created_at ? row.created_at.toString() : '',
    updated_at: row.updated_at ? row.updated_at.toString() : '',
    completed_at: row.completed_at ? row.completed_at.toString() : null,
  }
}

export async function insertOrder(order: {
  customer_email: string;
  vehicle_type: string;
  vin_number?: string;
  package_type: string;
  country_code: string;
  state?: string | null;
  currency: string;
  amount: number;
  identification_type: string;
  identification_value: string;
  payment_provider?: string;
}): Promise<Order> {
  let conn;
  try {
    conn = await pool.getConnection();
  } catch (err: any) {
    // Fallback: if database is unavailable in development, return mock order
    const msg = String(err?.message || err);
    if ((err?.code === 'ECONNREFUSED' || /ECONNREFUSED|connect ECONNREFUSED/.test(msg)) && process.env.NODE_ENV !== 'production') {
      console.warn('⚠️  Database unavailable in development, using mock order');
      const mockId = Math.floor(Math.random() * 1000000) + 1;
      const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(mockId).padStart(5,'0')}`;
      return {
        id: mockId,
        order_number: orderNumber,
        customer_email: order.customer_email,
        vehicle_type: order.vehicle_type,
        vin_number: order.vin_number || null,
        identification_type: order.identification_type,
        identification_value: order.identification_value,
        package_type: order.package_type,
        country_code: order.country_code || 'US',
        state: order.state || null,
        currency: order.currency || 'USD',
        amount: order.amount,
        payment_status: 'pending',
        payment_provider: order.payment_provider || 'paypal',
        status: 'pending',
        created_at: new Date().toISOString(),
        completed_at: null,
        report_url: null,
      };
    }
    throw err;
  }

  try {
    const provider = order.payment_provider || 'paypal'
    // Try to insert including `state` column. If the database schema hasn't
    // been migrated yet (older installs), MySQL will throw an error for the
    // unknown column; in that case fall back to inserting without `state` so
    // the app continues to work without requiring an immediate migration.
    let result: any
    try {
      [result] = await conn.execute(
        `INSERT INTO orders (customer_email, vehicle_type, identification_type, identification_value, vin_number, package_type, country_code, state, currency, amount, payment_status, payment_provider, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          order.customer_email,
          order.vehicle_type,
          order.identification_type,
          order.identification_value,
          order.vin_number || null,
          order.package_type,
          order.country_code || 'US',
          order.state || null,
          order.currency || 'USD',
          order.amount,
          'pending',
          provider,
          'pending',
        ]
      )
    } catch (err: any) {
      const msg = String(err?.message || err)
      // MySQL error number for unknown column is 1054 (ER_BAD_FIELD_ERROR).
      if (err?.errno === 1054 || /Unknown column .* in 'field list'/.test(msg)) {
        // Fallback: insert without state column for older schemas
        console.warn('insertOrder: state column not present in DB, falling back to insert without state')
        const [fallbackResult]: any = await conn.execute(
          `INSERT INTO orders (customer_email, vehicle_type, identification_type, identification_value, vin_number, package_type, country_code, currency, amount, payment_status, payment_provider, status, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            order.customer_email,
            order.vehicle_type,
            order.identification_type,
            order.identification_value,
            order.vin_number || null,
            order.package_type,
            order.country_code || 'US',
            order.currency || 'USD',
            order.amount,
            'pending',
            provider,
            'pending',
          ]
        )
        result = fallbackResult
      } else {
        throw err
      }
    }

    const insertId = result.insertId;
    console.log('✅ INSERT successful, insertId:', insertId)
    
    // Generate order number based on date and id
    const orderNumber = `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(insertId).padStart(5,'0')}`;
    console.log('📝 Generated orderNumber:', orderNumber)
    
    await conn.execute('UPDATE orders SET order_number = ? WHERE id = ?', [orderNumber, insertId]);
    console.log('✅ Updated order_number')
    
    const [rows]: any = await conn.execute('SELECT * FROM orders WHERE id = ?', [insertId]);
    console.log('✅ Retrieved order rows:', rows?.length, 'first row:', rows?.[0] ? 'exists' : 'null')
    
    if (!rows?.[0]) {
      throw new Error(`Failed to retrieve order after insert. ID: ${insertId}`)
    }
    
    return normalizeOrder(rows[0]);
  } finally {
    conn.release();
  }
}

export async function getAllOrders(): Promise<Order[]> {
  const [rows]: any = await pool.execute('SELECT * FROM orders ORDER BY created_at DESC');
  return (rows || []).map((r: any) => normalizeOrder(r));
}

export async function getOrders(filters: { status?: string; startDate?: string; endDate?: string; search?: string; currency?: string; limit?: number; offset?: number } = {}): Promise<Order[]> {
  const params: any[] = []
  let sql = 'SELECT * FROM orders WHERE 1=1'
  if (filters.status) {
    sql += ' AND status = ?'
    params.push(filters.status)
  }
  if (filters.startDate) {
    sql += ' AND created_at >= ?'
    params.push(filters.startDate)
  }
  if (filters.endDate) {
    sql += ' AND created_at <= ?'
    params.push(filters.endDate)
  }
  if (filters.currency) {
    sql += ' AND currency = ?'
    params.push(filters.currency)
  }
  if (filters.search) {
    sql += " AND (order_number LIKE ? OR customer_email LIKE ? OR identification_value LIKE ? OR vin_number LIKE ? OR package_type LIKE ?)"
    const like = `%${filters.search}%`
    params.push(like, like, like, like, like)
  }
  sql += ' ORDER BY created_at DESC'
  if (filters.limit) {
    sql += ' LIMIT ?'
    params.push(filters.limit)
  }
  if (typeof filters.offset === 'number') {
    sql += ' OFFSET ?'
    params.push(filters.offset)
  }
  const [rows]: any = await pool.execute(sql, params)
  return (rows || []).map((r: any) => normalizeOrder(r))
}

export async function getOrderById(id: number): Promise<Order | null> {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0] ? normalizeOrder(rows[0]) : null;
  } catch (err: any) {
    // Fallback: if database is unavailable in development, return mock order
    const msg = String(err?.message || err);
    const isDbUnavailable = err?.code === 'ECONNREFUSED' || err?.code === 'ETIMEDOUT' || /ECONNREFUSED|ETIMEDOUT|connect ECONNREFUSED|timeout/.test(msg);
    
    if (isDbUnavailable && process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️  Database unavailable (${err?.code}) in development, returning mock order for id ${id}`);
      // Return a mock order matching the expected structure
      return {
        id,
        order_number: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(id).padStart(5,'0')}`,
        customer_email: 'mock@example.com',
        vehicle_type: 'Car',
        vin_number: null,
        identification_type: 'vin',
        identification_value: 'MOCK123456789',
        package_type: 'basic',
        country_code: 'US',
        state: null,
        currency: 'USD',
        amount: 19.99,
        payment_status: 'pending',
        payment_provider: 'paypal',
        status: 'pending',
        created_at: new Date().toISOString(),
        completed_at: null,
        report_url: null,
      };
    }
    throw err;
  }
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  try {
    const [rows]: any = await pool.execute('SELECT * FROM orders WHERE order_number = ?', [orderNumber]);
    return rows[0] ? normalizeOrder(rows[0]) : null;
  } catch (err: any) {
    // Fallback: if database is unavailable in development, return mock order
    const msg = String(err?.message || err);
    if ((err?.code === 'ECONNREFUSED' || /ECONNREFUSED|connect ECONNREFUSED/.test(msg)) && process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️  Database unavailable in development, returning mock order for number ${orderNumber}`);
      // Extract ID from order number format: ORD-20260220-610903
      const parts = orderNumber.split('-');
      const mockId = parseInt(parts[2], 10) || Math.floor(Math.random() * 1000000) + 1;
      return {
        id: mockId,
        order_number: orderNumber,
        customer_email: 'mock@example.com',
        vehicle_type: 'Car',
        vin_number: null,
        identification_type: 'vin',
        identification_value: 'MOCK123456789',
        package_type: 'basic',
        country_code: 'US',
        state: null,
        currency: 'USD',
        amount: 19.99,
        payment_status: 'pending',
        payment_provider: 'paypal',
        status: 'pending',
        created_at: new Date().toISOString(),
        completed_at: null,
        report_url: null,
      };
    }
    throw err;
  }
}

export async function getAdminCounts(): Promise<{ orders: number; reviews: number; contacts: number; registrations: number }> {
  // Count orders that are not completed (only decrease when status becomes 'completed')
  const [[orderCount]]: any = await pool.execute(
    "SELECT COUNT(*) as cnt FROM orders WHERE status <> 'completed'"
  );
  const [[reviewCount]]: any = await pool.execute(
    "SELECT COUNT(*) as cnt FROM reviews WHERE status = 'pending'"
  );
  const [[contactCount]]: any = await pool.execute(
    "SELECT COUNT(*) as cnt FROM contact_submissions WHERE status = 'new'"
  );
  const [[registrationCount]]: any = await pool.execute(
    "SELECT COUNT(*) as cnt FROM vehicle_registrations WHERE approval_status = 'pending'"
  );
  return {
    orders: Number(orderCount?.cnt || 0),
    reviews: Number(reviewCount?.cnt || 0),
    contacts: Number(contactCount?.cnt || 0),
    registrations: Number(registrationCount?.cnt || 0),
  }
}

export async function getOrdersStats(days = 30) {
  // returns array [{ date: 'YYYY-MM-DD', count, totalAmount }]
  try {
    console.log('[DB] getOrdersStats: Starting query for', days, 'days')
    const [rows]: any = await pool.execute(
      `SELECT DATE(created_at) as day, COUNT(*) as count, COALESCE(SUM(amount),0) as totalAmount
      FROM orders
      WHERE created_at >= DATE_SUB(CURDATE(), INTERVAL ? DAY)
      GROUP BY day
      ORDER BY day ASC`,
      [days]
    );
    console.log('[DB] getOrdersStats: Query successful, returned', rows?.length, 'rows')
    return rows || [];
  } catch (error) {
    console.error('[DB] getOrdersStats: Query failed')
    console.error('[DB] Error message:', error instanceof Error ? error.message : String(error))
    console.error('[DB] Error type:', error?.constructor?.name)
    console.error('[DB] Full error:', error)
    throw error; // Re-throw to be caught by the API route
  }
}

export async function getSales({ startDate, endDate, status, currency, q }: { startDate?: string; endDate?: string; status?: string; currency?: string; q?: string }) {
  const params: any[] = []
  let sql = 'SELECT * FROM orders WHERE 1=1'
  if (startDate) {
    sql += ' AND created_at >= ?'
    params.push(startDate)
  }
  if (endDate) {
    sql += ' AND created_at <= ?'
    params.push(endDate)
  }
  if (status) {
    sql += ' AND status = ?'
    params.push(status)
  }
  if (currency) {
    sql += ' AND currency = ?'
    params.push(currency)
  }
  if (q) {
    sql += ' AND (customer_email LIKE ? OR order_number LIKE ? OR vehicle_type LIKE ? OR package_type LIKE ?)'
    params.push(`%${q}%`, `%${q}%`, `%${q}%`, `%${q}%`)
  }
  sql += ' ORDER BY created_at DESC LIMIT 1000'
  const [rows]: any = await pool.execute(sql, params)
  return (rows || []).map((r: any) => normalizeOrder(r))
}


export async function updateOrderPaymentStatus(
  id: number,
  paymentStatus: 'pending' | 'completed' | 'failed',
  paymentId?: string
): Promise<Order> {
  let conn;
  try {
    conn = await pool.getConnection();
  } catch (err: any) {
    // Fallback: if database is unavailable in development, return mock order with updated status
    const msg = String(err?.message || err);
    if ((err?.code === 'ECONNREFUSED' || /ECONNREFUSED|connect ECONNREFUSED/.test(msg)) && process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️  Database unavailable in development, mock updating order ${id} payment status to ${paymentStatus}`);
      return {
        id,
        order_number: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(id).padStart(5,'0')}`,
        customer_email: 'mock@example.com',
        vehicle_type: 'Car',
        vin_number: null,
        identification_type: 'vin',
        identification_value: 'MOCK123456789',
        package_type: 'basic',
        country_code: 'US',
        state: null,
        currency: 'USD',
        amount: 19.99,
        payment_status: paymentStatus,
        payment_provider: 'paypal',
        status: paymentStatus === 'completed' ? 'pending' : 'pending',
        created_at: new Date().toISOString(),
        completed_at: paymentStatus === 'completed' ? new Date().toISOString() : null,
        report_url: null,
      };
    }
    throw err;
  }

  try {
    await conn.execute('UPDATE orders SET payment_status = ?, payment_id = ?, updated_at = NOW() WHERE id = ?', [paymentStatus, paymentId || null, id]);
    const [rows]: any = await conn.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return rows[0];
  } finally {
    conn.release();
  }
}

export async function updateOrderReportStatus(
  id: number,
  reportStatus: 'pending' | 'processing' | 'completed' | 'cancelled' | 'refunded',
  reportUrl?: string
): Promise<Order> {
  let conn;
  try {
    conn = await pool.getConnection();
  } catch (err: any) {
    // Fallback: if database is unavailable in development, return mock order with updated status
    const msg = String(err?.message || err);
    if ((err?.code === 'ECONNREFUSED' || /ECONNREFUSED|connect ECONNREFUSED/.test(msg)) && process.env.NODE_ENV !== 'production') {
      console.warn(`⚠️  Database unavailable in development, mock updating order ${id} report status to ${reportStatus}`);
      return {
        id,
        order_number: `ORD-${new Date().toISOString().slice(0,10).replace(/-/g,'')}-${String(id).padStart(5,'0')}`,
        customer_email: 'mock@example.com',
        vehicle_type: 'Car',
        vin_number: null,
        identification_type: 'vin',
        identification_value: 'MOCK123456789',
        package_type: 'basic',
        country_code: 'US',
        state: null,
        currency: 'USD',
        amount: 19.99,
        payment_status: 'completed',
        payment_provider: 'paypal',
        status: reportStatus,
        created_at: new Date().toISOString(),
        completed_at: reportStatus === 'completed' ? new Date().toISOString() : null,
        report_url: reportUrl || null,
      };
    }
    throw err;
  }

  try {
    const [result]: any = await conn.execute('UPDATE orders SET status = ?, report_url = ?, completed_at = ?, updated_at = NOW() WHERE id = ?', [
      reportStatus,
      reportUrl || null,
      reportStatus === 'completed' ? new Date() : null,
      id,
    ]);

    // Determine affected rows and throw an error if the update did not persist
    try {
      const affected = typeof result?.affectedRows === 'number' ? result.affectedRows : (result?.affectedRows || 0)
      if (!affected) {
        console.warn(`updateOrderReportStatus: no rows affected for id=${id}, reportStatus=${reportStatus}`)
        throw new Error(`No rows affected when updating order ${id} to status ${reportStatus}`)
      }
    } catch (e) {
      console.warn('Could not determine affectedRows for updateOrderReportStatus result', e)
      throw e
    }

    const [rows]: any = await conn.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return normalizeOrder(rows[0]);
  } finally {
    conn.release();
  }
}

export async function deleteOrder(id: number) {
  console.log(`📝 deleteOrder: Deleting order ${id}`)
  const conn = await pool.getConnection();
  try {
    const [result]: any = await conn.execute('DELETE FROM orders WHERE id = ?', [id])
    const affected = typeof result?.affectedRows === 'number' ? result.affectedRows : 0
    console.log(`🗑️ deleteOrder: Deleted ${affected} order(s)`)
    if (!affected) {
      throw new Error(`Failed to delete order ${id}: no rows affected`)
    }
    return affected
  } finally {
    conn.release();
  }
}

export async function updateOrderDetails(id: number, fields: Partial<{
  customer_email: string
  vehicle_type: string
  package_type: string
  vin_number: string | null
  country_code: string
  currency: string
  amount: number
  report_url: string | null
  payment_status: 'pending' | 'completed' | 'failed'
}>) {
  const allowedKeys = ['customer_email','vehicle_type','package_type','vin_number','country_code','currency','amount','report_url','payment_status']
  // include state as updatable
  if (!allowedKeys.includes('state')) allowedKeys.push('state')
  const updates: string[] = []
  const params: any[] = []
  for (const key of allowedKeys) {
    if ((fields as any)[key] !== undefined) {
      updates.push(`${key} = ?`)
      params.push((fields as any)[key])
    }
  }
  if (updates.length === 0) {
    const [rows]: any = await pool.execute('SELECT * FROM orders WHERE id = ?', [id]);
    return normalizeOrder(rows[0]);
  }
  params.push(id)
  const sql = `UPDATE orders SET ${updates.join(', ')}, updated_at = NOW() WHERE id = ?`
  const conn = await pool.getConnection();
  try {
    await conn.execute(sql, params)
    const [rows]: any = await conn.execute('SELECT * FROM orders WHERE id = ?', [id])
    return normalizeOrder(rows[0])
  } finally {
    conn.release();
  }
}