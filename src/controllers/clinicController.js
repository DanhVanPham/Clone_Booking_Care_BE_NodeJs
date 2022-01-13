import clinicService from "../services/clinicService";

let createNewClinic = async (req, res) => {
  try {
    let response = await clinicService.createNewClinic(req.body);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllClinics = async (req, res) => {
  try {
    let response = await clinicService.getAllClinics();
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getDetailClinicById = async (req, res) => {
  try {
    let response = await clinicService.getDetailClinicById(req.query.clinicId);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  createNewClinic,
  getAllClinics,
  getDetailClinicById,
};
