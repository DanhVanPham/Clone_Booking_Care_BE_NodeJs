require("dotenv").config();
import nodemailer from "nodemailer";

let sendEmail = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <Danhskipper18@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: "Thông tin đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmail(dataSend), // html body
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName},</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    <p>Nếu các thông tin trên là đúng vui lòng click vào đường link bên dưới để xác nhận
    và hoàn ttat thủ tục đặt lịch khám bệnh.</p>
    <div>
        <a href=${dataSend.redirectLink} target="_blank">Bấm vào đây</a>
    </div>
    <div>Xin chân thành cảm ơn.</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName},</h3>
    <p>You received this email because you booked an online medical appointment on BookingCare</p>
    <p>Information to schedule an appointment:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor Name: ${dataSend.doctorName}</b></div>
    <p>If the above information is correct, please click on the link below to confirm
    and complete the procedure to schedule a medical examination.</p>
    <div>
        <a href=${dataSend.redirectLink} target="_blank">Click here</a>
    </div>
    <div>Sincerely thank.</div>
    `;
  }
  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = "";
  if (dataSend.language === "vi") {
    result = `
    <h3>Xin chào ${dataSend.patientName},</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên BookingCare thành công.</p>
    <p>Thông tin đặt lịch đơn thuốc/hóa đơn được gửi trong file đính kèm:</p>
    <div>Xin chân thành cảm ơn.</div>
    `;
  }
  if (dataSend.language === "en") {
    result = `
    <h3>Dear ${dataSend.patientName},</h3>
    <p>You received this email because you have successfully booked an online medical appointment on BookingCare.</p>
    <p>Information on ordering prescription/invoice is sent in the attached file:</p>
    <div>Sincerely thank.</div>
    `;
  }
  return result;
};

let sendEmailAttachment = async (dataSend) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: '"Fred Foo 👻" <Danhskipper18@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: "Kết quả đặt lịch khám bệnh", // Subject line
    html: getBodyHTMLEmailRemedy(dataSend), // html body
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imageBase64.split("base64")[1],
        encoding: "base64",
      },
    ],
  });
};

module.exports = {
  sendEmail,
  sendEmailAttachment,
};
