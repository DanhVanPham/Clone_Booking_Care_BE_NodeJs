import db from "../models/index";
import Sequelize from "sequelize";
const Op = Sequelize.Op;
require("dotenv").config();
import _ from "lodash";

let createNewClinic = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.address ||
        !data.image ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        await db.Clinic.create({
          address: data.address,
          descriptionHTML: data.descriptionHTML,
          descriptionMarkdown: data.descriptionMarkdown,
          image: data.image,
          name: data.name,
        });
        resolve({
          errCode: 0,
          errMessage: "Create new specialty successfull.",
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getAllClinics = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.Clinic.findAll();
      if (data && data.length > 0) {
        data = data.map((item) => {
          if (item.image) {
            item.image = Buffer.from(item.image, "base64").toString("binary");
          }
          return item;
        });
      }
      resolve({
        data,
        errCode: 0,
      });
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

let getDetailClinicById = (clinicId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!clinicId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Clinic.findAll({
          where: { id: clinicId },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
          include: [
            {
              model: db.Doctor_Info,
              as: "clinicDoctorInfoData",
              attributes: ["doctorId"],
            },
          ],
          raw: true,
          nest: true,
        });
        if (data) {
          data =
            data &&
            data.length > 0 &&
            data.map((item) => {
              item.image =
                item.image &&
                Buffer.from(item.image, "base64").toString("binary");
              return item;
            });
        } else {
          data = {};
        }
        resolve({
          data,
          errCode: 0,
        });
      }
    } catch (e) {
      console.log(e);
      reject(e);
    }
  });
};

module.exports = {
  createNewClinic,
  getAllClinics,
  getDetailClinicById,
};
