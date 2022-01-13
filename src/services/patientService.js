import db from "../models/index";
require("dotenv").config();
import _ from "lodash";
import emailService from "./emailService";
import { v4 as uuidv4 } from "uuid";

let buildUrlEmail = (doctorId, token) => {
  let result = "";
  result = `${process.env.URL_REACT}/verify-booking?token=${token}&doctorId=${doctorId}`;
  return result;
};

let postBookAppointment = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.email ||
        !data.doctorId ||
        !data.date ||
        !data.firstName ||
        !data.lastName ||
        !data.timeType ||
        !data.phoneNumber ||
        !data.gender ||
        !data.address
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required paramaters!",
        });
      } else {
        let [user, created] = await db.User.findOrCreate({
          where: { email: data.email },
          defaults: {
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            roleId: "R3",
            gender: data.gender,
            phoneNumber: data.phoneNumber,
            address: data.address,
          },
        });

        //create a booking appointment
        if (user) {
          let uuid = uuidv4();
          let fullName =
            data.language === "vi"
              ? `${data.lastName} ${data.firstName}`
              : `${data.firstName} ${data.lastName}`;
          await emailService.sendEmail({
            receiverEmail: data.email,
            patientName: fullName,
            time: data.timeString,
            doctorName: data.doctorName,
            language: data.language,
            redirectLink: buildUrlEmail(data.doctorId, uuid),
          });
          await db.Booking.findOrCreate({
            where: { patientId: user.id },
            defaults: {
              statusId: "S1",
              doctorId: data.doctorId,
              token: uuid,
              patientId: user.id,
              date: data.date,
              timeType: data.timeType,
            },
          });
        }
        resolve({
          errCode: 0,
          errMessage: "Save booking appointment successed",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let postVerifyBookAppointment = ({ token, doctorId }) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!token || !doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: doctorId,
            token: token,
            statusId: "S1",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S2";
          await appointment.save();
          resolve({
            errCode: 0,
            errMessage: "Verify booking appointment succeesfull.",
          });
        } else {
          resolve({
            errCode: 2,
            errMessage: "Appointment has been activated or does not exist!",
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  postBookAppointment,
  postVerifyBookAppointment,
};
