import db from "../models/index";
import Sequelize from "sequelize";
const Op = Sequelize.Op;
require("dotenv").config();
import _ from "lodash";

let createNewSpecialty = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (
        !data.name ||
        !data.image ||
        !data.descriptionHTML ||
        !data.descriptionMarkdown
      ) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameter!",
        });
      } else {
        await db.Specialties.create({
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

let getAllSpecialty = () => {
  return new Promise(async (resolve, reject) => {
    try {
      let data = await db.specialties.findAll({});
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

let getSpecialtyById = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.specialties.findOne({
          where: { id: specialtyId },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        if (data) {
          data.image =
            data.image && Buffer.from(data.image, "base64").toString("binary");
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

let getAllDoctorBySpecialtyId = (specialtyId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Doctor_Info.findAll({
          where: { specialtyId: specialtyId },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        if (!data) {
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

let getAllDoctorBySpecialtyIdAndLocation = (specialtyId, provinceId) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!specialtyId || !provinceId) {
        resolve({
          errCode: 1,
          errMessage: "Missing required parameters!",
        });
      } else {
        let data = await db.Doctor_Info.findAll({
          where: { specialtyId: specialtyId, provinceId: provinceId },
          attributes: {
            exclude: ["createdAt", "updatedAt"],
          },
        });
        if (!data) {
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
  createNewSpecialty,
  getAllSpecialty,
  getSpecialtyById,
  getAllDoctorBySpecialtyId,
  getAllDoctorBySpecialtyIdAndLocation,
};
