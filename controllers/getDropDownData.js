const RAW_MODULES = [
 {
    "moduleId": "M001",
    "moduleName": "Inventory Management",
    "subModules": [
      { "subModuleId": "SM001", "subModuleName": "Stock Entry" },
      { "subModuleId": "SM002", "subModuleName": "Stock Report" },
      { "subModuleId": "SM003", "subModuleName": "Warehouse Management" },
      { "subModuleId": "SM004", "subModuleName": "Item Master" },
      { "subModuleId": "SM005", "subModuleName": "Batch & Serial Tracking" },
      { "subModuleId": "SM006", "subModuleName": "Reorder & Alerts" }
    ]
  },
  {
    "moduleId": "M002",
    "moduleName": "Finance & Accounting",
    "subModules": [
      { "subModuleId": "SM101", "subModuleName": "Chart of Accounts" },
      { "subModuleId": "SM102", "subModuleName": "General Ledger" },
      { "subModuleId": "SM103", "subModuleName": "Accounts Payable" },
      { "subModuleId": "SM104", "subModuleName": "Accounts Receivable" },
      { "subModuleId": "SM105", "subModuleName": "Bank Reconciliation" },
      { "subModuleId": "SM106", "subModuleName": "Expense Management" },
      { "subModuleId": "SM107", "subModuleName": "Financial Reports" }
    ]
  },
  {
    "moduleId": "M003",
    "moduleName": "Sales & CRM",
    "subModules": [
      { "subModuleId": "SM201", "subModuleName": "Customer Master" },
      { "subModuleId": "SM202", "subModuleName": "Quotation Management" },
      { "subModuleId": "SM203", "subModuleName": "Sales Order" },
      { "subModuleId": "SM204", "subModuleName": "Invoice/Billing" },
      { "subModuleId": "SM205", "subModuleName": "Payment Tracking" },
      { "subModuleId": "SM206", "subModuleName": "Customer Support / Helpdesk" }
    ]
  },
  {
    "moduleId": "M004",
    "moduleName": "Purchase Management",
    "subModules": [
      { "subModuleId": "SM301", "subModuleName": "Supplier Master" },
      { "subModuleId": "SM302", "subModuleName": "Purchase Requisition" },
      { "subModuleId": "SM303", "subModuleName": "Purchase Order" },
      { "subModuleId": "SM304", "subModuleName": "Goods Receipt" },
      { "subModuleId": "SM305", "subModuleName": "Supplier Payments" }
    ]
  },
  {
    "moduleId": "M005",
    "moduleName": "Human Resource Management",
    "subModules": [
      { "subModuleId": "SM401", "subModuleName": "Employee Master" },
      { "subModuleId": "SM402", "subModuleName": "Attendance" },
      { "subModuleId": "SM403", "subModuleName": "Leave Management" },
      { "subModuleId": "SM404", "subModuleName": "Payroll" },
      { "subModuleId": "SM405", "subModuleName": "Recruitment" }
    ]
  },
  {
    "moduleId": "M006",
    "moduleName": "Production / Manufacturing",
    "subModules": [
      { "subModuleId": "SM501", "subModuleName": "Bill of Materials (BOM)" },
      { "subModuleId": "SM502", "subModuleName": "Work Orders" },
      { "subModuleId": "SM503", "subModuleName": "Production Planning" },
      { "subModuleId": "SM504", "subModuleName": "Job Costing" },
      { "subModuleId": "SM505", "subModuleName": "Machine Maintenance" }
    ]
  },
  {
    "moduleId": "M007",
    "moduleName": "Supply Chain & Logistics",
    "subModules": [
      { "subModuleId": "SM601", "subModuleName": "Shipment Tracking" },
      { "subModuleId": "SM602", "subModuleName": "Distribution" },
      { "subModuleId": "SM603", "subModuleName": "Fleet Management" },
      { "subModuleId": "SM604", "subModuleName": "Vendor Management" }
    ]
  },
  {
    "moduleId": "M008",
    "moduleName": "Reporting & Analytics",
    "subModules": [
      { "subModuleId": "SM701", "subModuleName": "Dashboard" },
      { "subModuleId": "SM702", "subModuleName": "Custom Reports" },
      { "subModuleId": "SM703", "subModuleName": "KPI Tracking" }
    ]
  }
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
