import specialtyService from "../services/specialtyService";

let postNewSpecialty = async (req, res) => {
  try {
    let response = await specialtyService.createNewSpecialty(req.body);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllSpecialty = async (req, res) => {
  try {
    let response = await specialtyService.getAllSpecialty();
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getSpecialtyById = async (req, res) => {
  try {
    let response = await specialtyService.getSpecialtyById(
      req.query.specialtyId
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllDoctorBySpecialtyId = async (req, res) => {
  try {
    let response = await specialtyService.getAllDoctorBySpecialtyId(
      req.query.specialtyId
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let getAllDoctorBySpecialtyIdAndLocation = async (req, res) => {
  try {
    let response = await specialtyService.getAllDoctorBySpecialtyIdAndLocation(
      req.query.specialtyId,
      req.query.provinceId
    );
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  postNewSpecialty,
  getAllSpecialty,
  getSpecialtyById,
  getAllDoctorBySpecialtyId,
  getAllDoctorBySpecialtyIdAndLocation,
};
