import { NextResponse } from 'next/server';
import { getPendingReviews, getReviews, approveReview, rejectReview, deleteReview } from '@/lib/database';
import { validateToken } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const url = new URL(request.url);
    const status = url.searchParams.get('status') || undefined;
    const minRating = url.searchParams.get('minRating') ? Number(url.searchParams.get('minRating')) : undefined;
    const startDate = url.searchParams.get('startDate') || undefined;
    const endDate = url.searchParams.get('endDate') || undefined;
    const search = url.searchParams.get('search') || undefined;

    const reviews = await getReviews({ status, minRating, startDate, endDate, search });

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching pending reviews:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending reviews' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token || !(await validateToken(token))) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { id, action } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: 'Missing id or action' },
        { status: 400 }
      );
    }

    const numericId = Number(id);
    if (isNaN(numericId)) {
      return NextResponse.json({ error: 'Invalid id' }, { status: 400 });
    }

    if (action === 'approve') {
      const review = await approveReview(numericId);
      return NextResponse.json(review);
    } else if (action === 'reject') {
      const review = await rejectReview(numericId);
      return NextResponse.json(review);
    } else if (action === 'delete') {
      await deleteReview(numericId);
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating review:', error);
    return NextResponse.json(
      { error: 'Failed to update review' },
      { status: 500 }
    );
  }
}
