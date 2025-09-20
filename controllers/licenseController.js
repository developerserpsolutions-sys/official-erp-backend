import License from "../models/License.js";
import { v4 as uuidv4 } from "uuid";

// Create License
export const createLicense = async (req, res) => {
  try {
    const {
      companyCode,
      subscriptionType,
      modules,
      companyName, 
      businessType,
      contactPerson,
      designation,
      address,
      city,
      state,
      country,
      pincode,
      mobile,
      emailId,
      gstinRegistration,
      gstin,
      entity,
    } = req.body;

    console.log(req.body);

    if(!companyCode || !subscriptionType || !modules || !companyName || !businessType || !contactPerson || !designation || !address || !city || !state || !country || !pincode || !mobile || !emailId || !gstinRegistration || !gstin || !entity) {
        return res.status(400).json({
            "success":false,
            "message":"All fields are required"
        })
    }

    // Generate unique licenseID & clientID
    const licenseID = uuidv4();
    const clientID = uuidv4();

    // Check if companyCode already exists (still unique)
    const existingClient = await License.findOne({ companyCode });

    if (existingClient) {
      return res.status(400).json({
        success: false,
        message: "License with given companyCode already exists.",
      });
    }

    // Create new License document
    const license = new License({
      licenseID,
      companyCode,
      clientID,
      subscriptionType,
      modules,
      companyName,
      businessType,
      contactPerson,
      designation,
      address,
      city,
      state,
      country,
      pincode,
      mobile,
      emailId,
      gstinRegistration,
      gstin,
      entity
    });

    await license.save();

    return res.status(201).json({
      success: true,
      message: "License created successfully",
      data: license,
    });
  } catch (error) {
    console.error("Error creating license:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while creating license",
      error: error.message,
    });
  }
};

// Update License
// export const updateLicense = async (req, res) => {
//   try {
//     const { licenseId } = req.params;
//     const { subscriptionType, renew } = req.body; 
//     // `renew: true` means customer wants to renew/upgrade

//     let license = await License.findById(licenseId);
//     if (!license) {
//       return res.status(404).json({ success: false, message: "License not found" });
//     }

//     const now = new Date();

//     // === CASE 1: Upgrade trial → enterprise ===
//     if (subscriptionType && license.subscriptionType === "trial" && subscriptionType === "enterprise") {
//       license.subscriptionType = "enterprise";
//       license.startDate = now;
//       license.endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
//       license.status = "active";
//     }

//     // === CASE 2: Renew enterprise license ===
//     else if (license.subscriptionType === "enterprise" && renew) {
//       license.startDate = now;
//       license.endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
//       license.status = "active";
//     }

//     // === CASE 3: Renew trial (if allowed) ===
//     else if (license.subscriptionType === "trial" && renew) {
//       license.startDate = now;
//       license.endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
//       license.status = "active";
//     }

//     // === CASE 4: Expired → renewal ===
//     else if (license.status === "expired" && renew) {
//       license.startDate = now;
//       if (license.subscriptionType === "enterprise") {
//         license.endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
//       } else {
//         license.endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
//       }
//       license.status = "active";
//     }

//     // === CASE 5: Revoked → reactivate manually ===
//     else if (license.status === "revoked" && renew) {
//       license.startDate = now;
//       if (license.subscriptionType === "enterprise") {
//         license.endDate = new Date(now.getTime() + 365 * 24 * 60 * 60 * 1000);
//       } else {
//         license.endDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
//       }
//       license.status = "active";
//     }

//     // Save license
//     await license.save();

//     return res.json({
//       success: true,
//       message: "License updated successfully",
//       license
//     });

//   } catch (err) {
//     console.error("License Update Error:", err);
//     return res.status(500).json({ success: false, message: "Error updating license", error: err.message });
//   }
// };


//new update license
export const updateLicense = async (req, res) => {
  try {
    const { licenseID } = req.params;  // <-- matches :licenseID in route
    const updates = req.body;

    let license = await License.findOne({ licenseID });
    if (!license) {
      return res.status(404).json({ message: "License not found" });
    }

    // update fields
    Object.keys(updates).forEach((key) => {
      if (key === "modules" && Array.isArray(updates.modules)) {
        license.modules = updates.modules; // replace modules array
      } else {
        license[key] = updates[key];
      }
    });

    await license.save();

    res.status(200).json({ message: "License updated successfully", license });
  } catch (error) {
    console.error("Error updating license:", error);
    res.status(500).json({ message: "Internal Server Error", error });
  }
};

export const getCompanyByCode = async (req, res) => {
  try {
    const { companyCode } = req.params;

    const company = await License.findOne({ companyCode })
      .select(
        "companyCode subscriptionType modules companyName businessType contactPerson designation address city state country pincode mobile emailId gstinRegistration gstin entity"
      )
      .lean();
      
    if (!company) {
      return res.status(404).json({
        success: false,
        message: "Company not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Company retrieved successfully",
      data: company,
    });
  } catch (error) {
    console.error("Error retrieving company:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      error: error.message,
    });
  }
};

export const deleteLicense = async (req, res) => {
  try {
    const { licenseId } = req.params;   

    const deletedLicense = await License.findByIdAndUpdate(licenseId, { isActive: false }, { new: true });
    if (!deletedLicense) {
      return res.status(404).json({ message: "License not found" });
    }

    res.json({ message: "License deleted successfully", license: deletedLicense });
  } catch (err) {
    res.status(500).json({ message: "Error deleting license", error: err.message });
  }
};
