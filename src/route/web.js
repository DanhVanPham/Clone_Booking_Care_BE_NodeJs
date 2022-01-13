import express from "express";
import homeController from "../controllers/homeController";
import userController from "../controllers/userController";
import doctorController from "../controllers/doctorController";
import patientController from "../controllers/patientController";
import specialtyController from "../controllers/specialtyController";
import clinicController from "../controllers/clinicController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.get("/", homeController.getHomePage);

  router.post("/post-crud", homeController.postCRUD);

  router.get("/get-crud", homeController.displayGetCRUD);

  router.get("/edit-crud", homeController.getEditCRUD);

  router.put("/put-crud", homeController.putCRUD);

  router.post("/api/login", userController.handleLogin);
  router.get("/api/get-all-users", userController.handleGetAllUsers);
  router.post("/api/create-new-user", userController.handleCreateNewUSer);
  router.put("/api/edit-user", userController.handleEditUser);
  router.delete("/api/delete-user", userController.handleDeleteUser);

  router.get("/api/v1/allcode", userController.getAllCode);
  router.get("/api/v1/top-doctor-home", doctorController.getTopDoctorHome);
  router.get("/api/v1/get-all-doctors", doctorController.getAllDoctor);

  router.post("/api/v1/save-infor-doctor", doctorController.postInforDoctor);
  router.get("/api/v1/get-detail-doctor", doctorController.getDetailDoctorById);
  router.post(
    "/api/v1/bulk-create-schedule",
    doctorController.bulkCreateSchedule
  );
  router.get(
    "/api/v1/get-schedule-by-doctor",
    doctorController.getScheduleByDoctor
  );
  router.get(
    "/api/v1/get-schedule-doctor-by-date",
    doctorController.getScheduleDoctorByDate
  );
  router.get(
    "/api/v1/get-extra-infor-doctor-by-id",
    doctorController.getExtraInforDoctorById
  );

  router.get(
    "/api/v1/get-profile-doctor-by-id",
    doctorController.getProfileDoctorById
  );

  router.get(
    "/api/v1/get-list-patient-for-doctor",
    doctorController.getListPatientForDoctor
  );
  router.post("/api/v1/send-remedy", doctorController.sendRemedy);

  router.post(
    "/api/v1/patient-book-appointment",
    patientController.postBookAppointment
  );

  router.post(
    "/api/v1/verify-book-appointment",
    patientController.verifyPostBookAppointment
  );

  router.post(
    "/api/v1/create-new-specialties",
    specialtyController.postNewSpecialty
  );

  router.get("/api/v1/get-specialty", specialtyController.getAllSpecialty);

  router.get(
    "/api/v1/get-specialty-by-id",
    specialtyController.getSpecialtyById
  );

  router.get(
    "/api/v1/get-all-doctor-by-specialty",
    specialtyController.getAllDoctorBySpecialtyId
  );

  router.get(
    "/api/v1/get-all-doctor-by-location-and-specialty",
    specialtyController.getAllDoctorBySpecialtyIdAndLocation
  );

  router.post("/api/v1/create-new-clinic", clinicController.createNewClinic);
  router.get("/api/v1/get-clinics", clinicController.getAllClinics);
  router.get(
    "/api/v1/get-detail-clinic-by-id",
    clinicController.getDetailClinicById
  );

  return app.use("/", router);
};

module.exports = initWebRoutes;
