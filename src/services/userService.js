import db from "../models/index";
import bcrypt from "bcrypt";
const salt = bcrypt.genSaltSync(10);

let handleUserLogin = (email, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let userData = {};
      let isExist = await checkUserEmail(email);
      if (isExist) {
        let user = await db.User.findOne({
          where: { email: email },
          attributes: {
            exclude: ["image", "createdAt", "updatedAt"],
          },
          raw: true,
        });

        if (user) {
          let isMatch = bcrypt.compareSync(password, user.password);

          if (isMatch) {
            let { password, ...rest } = user;
            userData.errCode = 0;
            userData.errMessage = "Ok";
            userData.user = rest;
          } else {
            userData.errCode = 3;
            userData.errMessage = `Wrong password`;
          }
        } else {
          userData.errCode = 2;
          userData.errMessage = `User's not found`;
        }
      } else {
        userData.errCode = 1;
        userData.errMessage = `Your's email isn't exist in system. Please try other email!`;
      }
      resolve(userData);
    } catch (e) {
      reject(e);
    }
  });
};

let checkUserEmail = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { email: email },
      });
      if (user) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (e) {
      reject(e);
    }
  });
};

let handleGetAllUsers = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let users = "";
      if (userId === "ALL" || !userId) {
        users = await db.User.findAll({
          attributes: {
            exclude: ["password"],
          },
        });
      } else {
        users = await db.User.findOne({
          where: { id: userId },
          attributes: {
            exclude: ["password"],
          },
        });
      }
      resolve(users);
    } catch (e) {
      reject(e);
    }
  });
};

let createNewUser = (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      let check = await checkUserEmail(user.email);
      if (check) {
        resolve({
          errCode: 1,
          errMessage: "Your email is already in used, Plz try another email!",
        });
      } else {
        let hashPasswordFromBcrypt = await hashUserPassword(user.password);
        await db.User.create({
          email: user.email,
          password: hashPasswordFromBcrypt,
          firstName: user.firstName,
          lastName: user.lastName,
          address: user.address,
          gender: user.gender,
          roleId: user.roleId,
          phoneNumber: user.phoneNumber,
          positionId: user.positionId,
          image: user.avatar,
        });
        resolve({
          errCode: 0,
          message: "OK",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let deleteUser = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      let user = await db.User.findOne({
        where: { id: userId },
        raw: false,
      });
      if (!user) {
        resolve({
          errCode: 2,
          errMessage: `The user isn't exist`,
        });
      } else {
        await user.destroy();
        resolve({
          errCode: 0,
          errMessage: "The user is deleted",
        });
      }
    } catch (e) {
      reject(e);
    }
  });
};

let updateUserData = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (!data.id) {
        resolve({
          errCode: 2,
          errMessage: "Missing required parameters!",
        });
      } else {
        let user = await db.User.findOne({
          where: { id: data.id },
          raw: false,
        });
        if (user) {
          user.firstName = data.firstName;
          user.lastName = data.lastName;
          user.address = data.address;
          user.phoneNumber = data.phoneNumber
            ? data.phoneNumber
            : user.phoneNumber;
          user.roleId = data.roleId ? data.roleId : user.roleId;
          user.gender = data.gender ? data.gender : user.gender;
          user.positionId = data.positionId ? data.positionId : user.positionId;
          if (data.avatar) {
            user.image = data.avatar;
          }
          await user.save();
          resolve({
            errCode: 0,
            errMessage: "Update the user success!",
          });
        } else {
          resolve({
            errCode: 1,
            errMessage: `User's not found!`,
          });
        }
      }
    } catch (e) {
      reject(e);
    }
  });
};

let hashUserPassword = (password) => {
  return new Promise(async (resolve, reject) => {
    try {
      let hashPassword = await bcrypt.hashSync(password, salt);
      resolve(hashPassword);
    } catch (e) {
      reject(e);
    }
  });
};

let getAllCodeService = (typeInput) => {
  return new Promise(async (resolve, reject) => {
    try {
      let res = {};
      if (!typeInput) {
        resolve({
          errCode: 1,
          errMessage: "Missing requires parameters!",
        });
      } else {
        let allcode = await db.Allcode.findAll({
          where: { type: typeInput },
        });
        res.errCode = 0;
        res.data = allcode;
        resolve(res);
      }
    } catch (e) {
      reject(e);
    }
  });
};

module.exports = {
  handleUserLogin,
  handleGetAllUsers,
  createNewUser,
  deleteUser,
  updateUserData,
  getAllCodeService,
};
