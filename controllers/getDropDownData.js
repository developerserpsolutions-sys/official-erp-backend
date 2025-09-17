export const getDropDownData = async (req, res) => {
  const { businessObject } = req.params;

  try {
    if (!businessObject) {
      return res.status(400).json({
        success: false,
        message: "Business Object is required",
      });
    }

    const dropdowns = {
      businessType: [
        "Manufacturing",
        "Retail",
        "Service",
        "Wholesale",
        "Construction",
        "Agriculture",
        "Finance",
        "Transportation",
        "Healthcare",
        "Education",
        "Hospitality",
        "Other",
      ],
      designation: ["Owner", "Director", "Manager", "Executive"],
      status: ["Active", "Expired", "Revoked"],
      subscriptionType: ["Trial", "Enterprise"],
      department: [
        "HR",
        "Finance",
        "IT",
        "Sales",
        "Marketing",
        "Operations",
        "Support",
      ],
    };

    const options = dropdowns[businessObject];

    if (!options) {
      return res.status(404).json({
        success: false,
        message: "Invalid business object",
      });
    }

    const data = options.map((item) => ({
      label: item,
      value: item,
    }));

    return res.status(200).json({
      success: true,
      businessObject,
      data,
    });
  } catch (error) {
    console.error("Get Dropdown Data Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
