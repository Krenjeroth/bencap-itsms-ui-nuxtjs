declare global {
  interface ICreateOtherItServiceRequestForm {
    control_number: string | undefined;
    status: string;
    date_of_request: string | undefined;
    department_office: string | undefined;
    requestor_name: string | undefined;

    service_printing: boolean;
    service_information_material: boolean;
    service_program_paper: boolean;
    service_brochure: boolean;
    service_iec_material: boolean;
    service_handbook: boolean;
    service_certificates: boolean;
    service_others: boolean;
    service_qty: number | undefined;
    service_laptop_tv_setup: boolean;
    service_others_specify: string | undefined;

    program_activity_details: string | undefined;
    activity_date_text: string | undefined;
    activity_time: string | undefined;
  }

  interface IUpdateOtherItServiceRequestForm extends ICreateOtherItServiceRequestForm {
    assigned_personnel: string | undefined;
    date_received: string | undefined;
    action_taken: string | undefined;
    feedback_rating: number | undefined;
    feedback_name: string | undefined;
    feedback_date: string | undefined;
  }
}

export {};
