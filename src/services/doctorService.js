import db from "../models/index";
import Sequelize from "sequelize";
const Op = Sequelize.Op;
require("dotenv").config();
import _ from "lodash";
import emailService from "../services/emailService";

const MAX_NUMBER_SCHEDULE = process.env.MAX_NUMBER_SCHEDULE;

let getTopDoctorHome = (limit) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = await db.User.findAll({
        limit,
        where: { roleId: "R2" },
        order: [["createdAt", "DESC"]],
        attributes: {
          exclude: ["password"],
        },
        include: [
          {
            model: db.Allcode,
            as: "positionData",
            attributes: ["valueEn", "valueVi"],
          },
          {
            model: db.Allcode,
            as: "genderData",
            attributes: ["valueEn", "valueVi"],
          },
        ],
        raw: true,
        nest: true,
      });
      resolve({
        errCode: 0,
        data: users,
      });
    } catch (e) {
      reject(e);
    }
  });
};

let getAllDoctors = (nameSearch) => {
  return new Promise(async (resolve, reject) => {
    try {
      let limit = 10;
      if (nameSearch) {
        let users = await db.User.findAll({
          limit,
          where: {
            roleId: "R2",
            [Op.or]: [
              {
                firstName: {
                  [Op.like]: `%${nameSearch}%`,
                },
              },
              {
                lastName: {
                  [Op.like]: `%${nameSearch}%`,
                },
              },
            ],
          },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password", "image"],
          },
          raw: true,
        });
        resolve({
          errCode: 0,
          data: users,
        });
      } else {
        let users = await db.User.findAll({
          limit,
          where: {
            roleId: "R2",
          },
          order: [["createdAt", "DESC"]],
          attributes: {
            exclude: ["password", "image"],
          },
          raw: true,
        });
        resolve({
          errCode: 0,
          data: users,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let saveDetailInforDoctor = (inputData) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !inputData.doctorId ||
        !inputData.contentHTML ||
        !inputData.contentMarkdown ||
        !inputData.priceId ||
        !inputData.paymentId ||
        !inputData.provinceId ||
        !inputData.nameClinic ||
        !inputData.specialtyId ||
        !inputData.clinicId ||
        !inputData.addressClinic
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let doctorDetail = await db.Markdown.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });
        if (!doctorDetail) {
          await db.Markdown.create({
            contentHTML: inputData.contentHTML,
            contentMarkdown: inputData.contentMarkdown,
            description: inputData.description,
            doctorId: inputData.doctorId,
          });
        } else {
          doctorDetail.contentHTML = inputData.contentHTML;
          doctorDetail.contentMarkdown = inputData.contentMarkdown;
          doctorDetail.description = inputData.description;
          doctorDetail.updatedAt = new Date();
          await doctorDetail.save();
        }

        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: inputData.doctorId },
          raw: false,
        });
        if (!doctorInfo) {
          await db.Doctor_Info.create({
            doctorId: inputData.doctorId,
            priceId: inputData.priceId,
            provinceId: inputData.provinceId,
            paymentId: inputData.paymentId,
            specialtyId: inputData.specialtyId,
            clinicId: inputData.clinicId,
            addressClinic: inputData.addressClinic,
            nameClinic: inputData.nameClinic,
            note: inputData.note || doctorInfo.note,
          });
        } else {
          doctorInfo.priceId = inputData.priceId;
          doctorInfo.provinceId = inputData.provinceId;
          doctorInfo.paymentId = inputData.paymentId;
          doctorInfo.clinicId = inputData.clinicId;
          doctorInfo.specialtyId = inputData.specialtyId;
          doctorInfo.addressClinic = inputData.addressClinic;
          doctorInfo.nameClinic = inputData.nameClinic;
          doctorInfo.note = inputData.note || doctorInfo.note;
          await doctorInfo.save();
        }
        resolve({
          errCode: 0,
          errMessage: "Save infor detail doctor succeed.",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getDoctorById = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!userId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        let data = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
          include: [
            {
              model: db.Markdown,
              as: "markDownData",
              attributes: ["description", "contentHTML", "contentMarkdown"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              as: "doctorInfoData",
              attributes: [
                "clinicId",
                "priceId",
                "provinceId",
                "paymentId",
                "addressClinic",
                "nameClinic",
                "note",
              ],
              include: [
                {
                  model: db.specialties,
                  as: "specialtyData",
                  attributes: ["id", "name"],
                },
              ],
            },
          ],
          raw: true,
          nest: true,
        });
        if (!data) data = {};
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let bulkCreateSchedule = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.arrSchedule) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let schedule = data.arrSchedule;
        if (schedule && schedule.length > 0) {
          schedule = schedule.map((item) => {
            item.maxNumber = MAX_NUMBER_SCHEDULE;
            return item;
          });

          let existing = await db.Schedule.findAll({
            where: {
              doctorId: schedule[0]["doctorId"],
              date: `` + schedule[0]["date"],
            },
            attributes: {
              exclude: ["id", "currentNumber", "createdAt", "updatedAt"],
            },
          });
          let difference = _.differenceWith(schedule, existing, (a, b) => {
            return a.timeType === b.timeType && +a.date === +b.date;
          });
          if (difference && difference.length > 0) {
            await db.Schedule.bulkCreate(difference);
          }
        }
        resolve({
          errCode: 0,
          errMessage: "Ok",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleByDoctorId = (doctorId, time) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !time) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let scheduleDoctor = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: +time,
          },
          attributes: {
            exclude: ["id", "currentNumber", "createdAt", "updatedAt"],
          },
        });
        resolve({
          errCode: 0,
          data: scheduleDoctor,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getScheduleByDate = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Schedule.findAll({
          where: {
            doctorId: doctorId,
            date: date,
          },
          include: [
            {
              model: db.Allcode,
              as: "timeTypeData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.User,
              as: "doctorScheduleData",
              attributes: ["firstName", "lastName"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (!data) {
          data = [];
        }
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getExtraInforDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let doctorInfo = await db.Doctor_Info.findOne({
          where: { doctorId: doctorId },
          include: [
            {
              model: db.Allcode,
              as: "priceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "provinceData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Allcode,
              as: "paymentData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          raw: true,
          nest: true,
        });
        if (!doctorInfo) doctorInfo = {};
        resolve({
          errCode: 0,
          data: doctorInfo,
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let getProfileDoctorById = (doctorId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let doctorInfo = await db.User.findOne({
          where: { id: doctorId },
          attributes: {
            exclude: ["password", "createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Markdown,
              as: "markDownData",
              attributes: ["description"],
            },
            {
              model: db.Allcode,
              as: "positionData",
              attributes: ["valueEn", "valueVi"],
            },
            {
              model: db.Doctor_Info,
              as: "doctorInfoData",
              attributes: [
                "priceId",
                "provinceId",
                "paymentId",
                "addressClinic",
                "nameClinic",
                "note",
              ],
              include: [
                {
                  model: db.Allcode,
                  as: "priceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "provinceData",
                  attributes: ["valueEn", "valueVi"],
                },
                {
                  model: db.Allcode,
                  as: "paymentData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
          ],
          raw: false,
          nest: true,
        });

        if (doctorInfo && doctorInfo.image) {
          doctorInfo.image = Buffer.from(doctorInfo.image, "base64").toString(
            "binary"
          );
        }

        if (!doctorInfo) doctorInfo = {};
        resolve({
          errCode: 0,
          data: doctorInfo,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getListPatientForDoctorService = (doctorId, date) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!doctorId || !date) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Booking.findAll({
          where: {
            statusId: "S2",
            doctorId: doctorId,
            date: date,
          },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.User,
              as: "patientData",
              attributes: ["email", "firstName", "lastName", "address"],
              include: [
                {
                  model: db.Allcode,
                  as: "genderData",
                  attributes: ["valueEn", "valueVi"],
                },
              ],
            },
            {
              model: db.Allcode,
              as: "timeTypeBookingData",
              attributes: ["valueEn", "valueVi"],
            },
          ],
          raw: true,
          nest: true,
        });
        resolve({
          errCode: 0,
          data,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let sendRemedyService = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.email || !data.doctorId || !data.patientId || !data.timeType) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        //update patient status
        let appointment = await db.Booking.findOne({
          where: {
            doctorId: data.doctorId,
            patientId: data.patientId,
            timeType: data.timeType,
            statusId: "S2",
          },
          raw: false,
        });
        if (appointment) {
          appointment.statusId = "S3";
          await appointment.save();
        }

        await emailService.sendEmailAttachment(data);

        resolve({
          errCode: 0,
          errMessage: "Send Remedy successful",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  getTopDoctorHome,
  getAllDoctors,
  saveDetailInforDoctor,
  getDoctorById,
  bulkCreateSchedule,
  getScheduleByDoctorId,
  getScheduleByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListPatientForDoctorService,
  sendRemedyService,
};
