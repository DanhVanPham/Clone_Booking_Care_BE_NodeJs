import patientService from "../services/patientService";

let postBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postBookAppointment(req.body);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

let verifyPostBookAppointment = async (req, res) => {
  try {
    let response = await patientService.postVerifyBookAppointment(req.body);
    res.status(200).json(response);
  } catch (e) {
    res.status(200).json({
      errCode: -1,
      errMessage: "Error from the server",
    });
  }
};

module.exports = {
  postBookAppointment,
  verifyPostBookAppointment,
};
