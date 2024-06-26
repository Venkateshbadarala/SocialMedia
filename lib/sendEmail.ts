import User from '@/app/Database/models/user';
import bcrypt from 'bcrypt';
import nodemailer from 'nodemailer';

interface Iprop {
  emailAddress: string;
  emailtype: 'forgotPassword' | 'emailvalidation' | 'updateUser';
  userId: string;
}

const sendEmail = async ({ emailAddress, emailtype, userId }: Iprop) => {
  try {
    const convertedId = userId.toString();
    const hashedToken = await bcrypt.hash(convertedId, 10);
    const tokenExpiry = new Date();
    tokenExpiry.setHours(tokenExpiry.getHours() + 5);

    const updateUserInformation =
      emailtype === 'emailvalidation'
        ? {
            verifyToken: hashedToken,
            verifyTokenExpiry: tokenExpiry,
          }
        : {
            forgotPasswordToken: hashedToken,
            forgotPasswordTokenExpiry: tokenExpiry,
          };

    await User.updateOne({ _id: userId }, { $set: updateUserInformation });

    console.log('User information updated');

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const tokenLink = `${process.env.NEXTAUTH_URL}/api/users/verify?type=${emailtype}&token=${encodeURIComponent(hashedToken)}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: emailAddress,
      subject: 'Validation Email',
      html: `<b>Verify this link: <a href="${tokenLink}">${tokenLink}</a></b>`,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return info;
  } catch (error: any) {
    console.error('Error:', error.message);
    return false;
  }
};

export default sendEmail;
