import doctorService from "../services/doctorService";

let getTopDoctorHome = async (req, res) => {
  let limit = +req.query.limit;
  if (!limit) {
    limit = 10;
  }
  try {
    let response = await doctorService.getTopDoctorHome(limit);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from server",
    });
  }
};

let getAllDoctor = async (req, res) => {
  let nameSearch = req.query.nameSearch || "";
  try {
    let response = await doctorService.getAllDoctors(nameSearch);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let postInforDoctor = async (req, res) => {
  try {
    let response = await doctorService.saveDetailInforDoctor(req.body);
    return res.status(200).json(response);
  } catch (e) {
    console.log(e);
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getDoctorById(req.query.id);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let bulkCreateSchedule = async (req, res) => {
  try {
    let response = await doctorService.bulkCreateSchedule(req.body);
    return res.status(200).json(response);
  } catch (e) {
    return res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getScheduleByDoctor = async (req, res) => {
  try {
    let response = await doctorService.getScheduleByDoctorId(
      req.query.id,
      req.query.time
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getScheduleDoctorByDate = async (req, res) => {
  try {
    console.log(req.query.date);
    let response = await doctorService.getScheduleByDate(
      req.query.doctorId,
      req.query.date
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getExtraInforDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getExtraInforDoctorById(
      req.query.doctorId
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getProfileDoctorById = async (req, res) => {
  try {
    let response = await doctorService.getProfileDoctorById(req.query.doctorId);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getListPatientForDoctor = async (req, res) => {
  try {
    let response = await doctorService.getListPatientForDoctorService(
      req.query.doctorId,
      req.query.date
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let sendRemedy = async (req, res) => {
  try {
    let response = await doctorService.sendRemedyService(req.body);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  getTopDoctorHome,
  getAllDoctor,
  postInforDoctor,
  getDetailDoctorById,
  bulkCreateSchedule,
  getScheduleByDoctor,
  getScheduleDoctorByDate,
  getExtraInforDoctorById,
  getProfileDoctorById,
  getListPatientForDoctor,
  sendRemedy,
};
