import { NextResponse } from 'next/server';
import { getAuthenticatedMailUser, sendOutgoingMail } from '@/lib/mailServer';

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedMailUser(request);
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please log in to your mail account.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { to, cc, bcc, subject, bodyText, bodyHtml } = body;

    if (!to || !to.trim()) {
      return NextResponse.json(
        { success: false, error: 'Recipient address (To) is required.' },
        { status: 400 }
      );
    }

    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { success: false, error: 'Subject is required.' },
        { status: 400 }
      );
    }

    const sentRecord = await sendOutgoingMail({
      senderEmail: user.email,
      senderName: user.name,
      to: to.trim(),
      cc: cc ? cc.trim() : undefined,
      bcc: bcc ? bcc.trim() : undefined,
      subject: subject.trim(),
      bodyText: bodyText || '',
      bodyHtml: bodyHtml || undefined,
    });

    return NextResponse.json({
      success: true,
      message: 'Email dispatched successfully via Postfix SMTP',
      sentRecord,
    });
  } catch (error: unknown) {
    console.error('Mail dispatch error:', error);
    const message = error instanceof Error ? error.message : 'Failed to send email';
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
