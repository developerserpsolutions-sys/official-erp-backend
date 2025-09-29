import { RAW_MODULES } from "../config/constants.js";

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
      role: ["Manager", "Operator", "Executive"],
      department: [
        "Accounts",
        "Controlling",
        "Sales & Distribution",
        "Materials Management",
        "Production Planning",
        "Warehouse Management",
        "Plant Maintenance",
        "Quality Management",
        "Human Resources",
        "Project System",
        "Customer Service",
        "Supply Chain Management",
        "Product Lifecycle Management",
        "Governance Risk Compliance",
        "Research & Development",
        "Administration",
        "IT",
        "Marketing",
        "Procurement RM",
        "Logistics Execution",
        "Hospitality",
        "Security",
        "Weighment",
        "Stores",
        "Front Office",
        "Dispatch",
        "Lab",
        "Mechanical",
        "Electrical",
        "Automobile",
      ],
      designation: ["Owner", "Director", "Manager", "Executive"],
      status: ["Active", "Expired", "Revoked"],
      subscriptionType: ["Trial", "Enterprise"],
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

export const getSideBarMenuItems = async (req, res) => {
  try {

    const menuItems = RAW_MODULES.map(module => ({
      id: module.moduleName.toUpperCase().replace(/\s+/g, "_"),
      label: module.moduleName,
      icon: "ri-folder-line", 
      link: "/#",
      subItems: module.subModules.map(sub => ({
        id: `${module.moduleName.toUpperCase().replace(/\s+/g, "_")}.${sub.subModuleName.replace(/\s+/g, "")}`,
        label: sub.subModuleName,
        link: `/${module.moduleName.replace(/\s+/g, "")}/${sub.subModuleName.replace(/\s+/g, "")}`
      }))
    }))

    return res.status(200).json({
      success: true,
      data: menuItems,
    });
  } catch (error) {
    console.error("Get Sidebar Menu Items Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

