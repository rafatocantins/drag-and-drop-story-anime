import nodemailer from 'nodemailer';

export interface ApprovalEmailPayload {
  narrativeTitle: string;
  reviewerEmail: string;
  approvalLink: string;
  promptPreview: string;
}

export async function sendApprovalEmail(payload: ApprovalEmailPayload) {
  const transport = nodemailer.createTransport({
    host: process.env.MAIL_TRANSPORT_HOST ?? 'localhost',
    port: Number(process.env.MAIL_TRANSPORT_PORT ?? 1025),
    secure: process.env.MAIL_TRANSPORT_SECURE === 'true',
    auth:
      process.env.MAIL_TRANSPORT_USER && process.env.MAIL_TRANSPORT_PASSWORD
        ? {
            user: process.env.MAIL_TRANSPORT_USER,
            pass: process.env.MAIL_TRANSPORT_PASSWORD
          }
        : undefined
  });

  const from = process.env.MAIL_FROM ?? 'studio@echoes.local';

  await transport.sendMail({
    from,
    to: payload.reviewerEmail,
    subject: `[Echoes Approval] ${payload.narrativeTitle}`,
    text: [`Preview: ${payload.promptPreview}`, '', `Approve: ${payload.approvalLink}`].join('\n')
  });
}
