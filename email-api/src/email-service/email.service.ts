import nodemailer from "nodemailer";

interface IPayload {
  to: string;
  title: string;
  body: string;
  ccEmail: string[];
}

export const mailSender = async (payload: IPayload) => {
  try {
    const { to, title, body, ccEmail } = payload;
    // Create a Transporter to send emails
    let transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.MAIL_SENDER,
        pass: process.env.MAIL_PASS,
      },
    });

    // Send emails to users
    let info: any;
    if (ccEmail && ccEmail?.length <= 0) {
      info = await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to,
        subject: title,
        html: body,
      });
    } else {
      info = await transporter.sendMail({
        from: process.env.MAIL_SENDER,
        to,
        cc: ccEmail,
        subject: title,
        html: body,
      });
    }
    console.log(`Message sent to ${to}`);
    return info;
  } catch (error) {
    throw new Error(error);
  }
};
