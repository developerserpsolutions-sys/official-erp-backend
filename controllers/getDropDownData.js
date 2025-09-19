const RAW_MODULES = [
  {
    moduleId: "M001",
    moduleName: "Inventory Management",
    subModules: [
      { subModuleId: "SM001", subModuleName: "Stock Entry" },
      { subModuleId: "SM002", subModuleName: "Stock Report" },
    ],
  },
  {
    moduleId: "M002",
    moduleName: "Sales",
    subModules: [
      { subModuleId: "SM005", subModuleName: "Invoices" },
      { subModuleId: "SM006", subModuleName: "Orders" },
    ],
  },
];

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
      modules: RAW_MODULES,
    };

    const options = dropdowns[businessObject];

    if (!options) {
      return res.status(404).json({
        success: false,
        message: "Invalid business object",
      });
    }

    let data;
    if (businessObject === "modules") {
      data = options.map((mod) => ({
        label: mod.moduleName,
        value: mod.moduleId,
        subModules: mod.subModules.map((sub) => ({
          label: sub.subModuleName,
          value: sub.subModuleId,
        })),
      }));
    } else {
      data = options.map((item) => ({
        label: item,
        value: item,
      }));
    }

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
