

export class DefineConstants {
  public static readonly LIMIT_ROW_EXCEL_EXPORT: number = 10000;

  public static readonly ROLE_GROUP_ADMIN: string = 'admin';
  public static readonly ROLE_GROUP_MANAGER: string = 'manager';
  public static readonly ROLE_GROUP_OWNER: string = 'owner';
  public static readonly ROLE_GROUP_USER: string = 'user';

  public static readonly ERROR_MESSAGE_EMPTY_VALID: string = 'i18n_valid_empty_message';
  public static readonly ERROR_MESSAGE_PATTEN_VALID: string = 'i18n_valid_pattern_message';
  public static readonly ERROR_MESSAGE_MIN_VALID: string = 'i18n_message_error_input_min_value';
  public static readonly ERROR_MESSAGE_MAX_VALID: string = 'i18n_message_error_input_max_value';

  public static readonly TOAST_ERROR_FUNCTION_NAME: string = 'error';
  public static readonly TOAST_INFO_FUNCTION_NAME: string = 'info';
  public static readonly TOAST_SUCCESS_FUNCTION_NAME: string = 'success';
  public static readonly TOAST_WARNING_FUNCTION_NAME: string = 'warning';


  public static readonly PERMISSION_ACTION_VIEW: number = 1;
  public static readonly PERMISSION_ACTION_HIDDEN_OR_VIEW: number = 2;
  public static readonly PERMISSION_ACTION_EDIT: number = 3;
  public static readonly PERMISSION_ACTION_DELETE: number = 4;
  public static readonly PERMISSION_BROWSE_OR_CANCEL_CARD: number = 5; // tên cũ để bỏ đi- không dùng nữa
  public static readonly PERMISSION_ACTION_ACCEPT: number = 5; // chức năng hiện tại là duyệt
  public static readonly PERMISSION_ACTION_CREATE_NEW: number = 6;
  public static readonly PERMISSION_ACTION_EXPORT_FILE: number = 7;
  public static readonly PERMISSION_ACTION_COPY: number = 8;
  public static readonly PERMISSION_ACTION_SETTING: number = 9;
  public static readonly PERMISSION_ACTION_CONNECT_SOCIAL: number = 10;
  public static readonly PERMISSION_ACTION_POST: number = 11;
  public static readonly PERMISSION_ACTION_FORWARD: number = 12;
  public static readonly PERMISSION_ACTION_CLASSIFY_FEEDBACK_STATE: number = 13;
  public static readonly PERMISSION_ACTION_SEND_FB_MESSENGER: number = 14; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_SEND_EMAIL_MKT: number = 15; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_SEND_SMS: number = 16; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_PUSH_IN_APP: number = 17; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_CANCEL: number = 18;
  public static readonly PERMISSION_ACTION_ADD_CONTENT_DISPLAY: number = 19;
  public static readonly PERMISSION_ACTION_MANIPULATION: number = 20; // THAO TÁC
  public static readonly PERMISSION_ACTION_REPORT: number = 21;
  public static readonly PERMISSION_ACTION_UNIFY: number = 22; // HỢP NHẤT
  public static readonly PERMISSION_ACTION_CHECK: number = 23;
  public static readonly PERMISSION_ACTION_CREATE_NOTE: number = 24;
  public static readonly PERMISSION_ACTION_ACTIVATED: number = 25;
  public static readonly PERMISSION_ACTION_SEND_ZALO: number = 26; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_OPEN_IN_MESSENGER: number = 27;
  public static readonly PERMISSION_CALL_CENTER_MODE: number = 28;
  public static readonly PERMISSION_ACTION_EDIT_NOTE: number = 29;
  public static readonly PERMISSION_ACTION_DELETE_NOTE: number = 30;
  public static readonly PERMISSION_ACTION_SEND_SMS_TO_PROFILE: number = 31;
  public static readonly PERMISSION_ACTION_SEND_SMS_EXPERIMENT: number = 32; // gửi sms thử nghiệm
  public static readonly PERMISSION_ACTION_SEND_EMAIL_EXPERIMENT: number = 33; // gửi email thử nhiệm;
  public static readonly PERMISSION_ACTION_SEND_CHANNEL_SMS_QC: number = 34; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_SEND_CHANNEL_SMS_CSKH: number = 35; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_SEND_CHANNEL_WEBPUSH: number = 36; // khối kênh trong JB, MKT
  public static readonly PERMISSION_ACTION_SEND_EMAIL: number = 37; // gửi email

  public static readonly BASE_PATH: string = '/';
  public static readonly ROOT_PATH_LOGIN: string = '/login';
  public static readonly ROOT_PATH_DASHBOARD: string = '/dashboard';

  public static readonly ROOT_PATH_CUSTOMER: string = '/manage-customer/profiles';
  public static readonly ROOT_PATH_CUSTOMER_PROFILE_DISPLAY: string = '/manage-customer/profiles/profiles-display-role';
  public static readonly SUB_PATH_CUSTOMER_DETAIL: string = '/manage-customer/profiles/detail';
  public static readonly SUB_PATH_CUSTOMER_NOTE: string = '/manage-customer/permission/note';
  public static readonly ROOT_PATH_CUSTOMER_MERGE_PROFILE: string = '/manage-customer/merge-profiles';
  public static readonly ROOT_PATH_CUSTOMER_VALIDATOR_EMAIL: string = '/manage-customer/validator-email';
  public static readonly ROOT_PATH_CUSTOMER_FIELD_CONFIG: string = '/setting/tenant/custom-field/profiles';
  public static readonly ROOT_PATH_CUSTOMER_FIELD_CONFIG_DETAIL: string = '/setting/tenant/custom-field/profiles/detail';
  public static readonly ROOT_PATH_CUSTOMER_PROFILE_GROUPS: string = '/setting/tenant/object/profile-group';
  public static readonly ROOT_PATH_CUSTOMER_PROFILE_GROUPS_DETAIL: string = '/setting/tenant/object/profile-group/detail';
  public static readonly ROOT_PATH_CUSTOMER_EVENT_CONFIG: string = '/setting/tenant/integration/sync-data/event-dynamic';
  public static readonly ROOT_PATH_CUSTOMER_EVENT_CONFIG_DETAIL: string = '/setting/tenant/integration/sync-data/event-dynamic/detail';
  public static readonly ROOT_PATH_CUSTOMER_SPAM_CONTACT: string = '/manage-customer/spam-contact';

  public static readonly ROOT_PATH_SETTING_PERSONAL_WORK_EMAIL: string = '/setting/personal/integration/work-email';
  public static readonly ROOT_PATH_SETTING_PERSONAL_CALENDAR: string = '/setting/personal/integration/connect/google-calendar';
  public static readonly ROOT_PATH_SETTING_DISPLAY_TYPE: string = '/setting/personal/display-type';

  public static readonly ROOT_PATH_MARKETING: string = '/marketing/dashboard';
  public static readonly SUB_PATH_MARKETING_DETAIL: string = '/marketing/dashboard/detail';
  public static readonly ROOT_PATH_MARKETING_ACTIVE_CAMPAIGN: string = '/marketing/dashboard/active-campaign';
  public static readonly ROOT_PATH_MARKETING_MASTER_CAMPAIGN: string = '/marketing/master-campaign';
  public static readonly ROOT_PATH_MARKETING_LIST_MAIL: string = '/marketing/template-email/list-mail';

  public static readonly ROOT_PATH_PERSONALIZED: string = '/marketing/config-personalized';
  public static readonly ROOT_PATH_PERSONALIZED_DETAIL: string = '/marketing/config-personalized/detail';
  public static readonly ROOT_PATH_TEMPLATE_SMS: string = '/sms-brandname/template-sms';

  public static readonly ROOT_PATH_SOCIAL: string = '/social/dashboard';
  public static readonly SUB_PATH_SOCIAL_CHAT: string = '/social/chat';
  public static readonly SUB_PATH_SOCIAL_FACEBOOK: string = '/social/chat/facebook';
  public static readonly SUB_PATH_SOCIAL_INSTAGRAM: string = '/social/chat/instagram';
  public static readonly SUB_PATH_SOCIAL_ZALO: string = '/social/chat/zalo';
  public static readonly SUB_PATH_SOCIAL_LINE: string = '/social/chat/line';
  public static readonly SUB_PATH_SOCIAL_YOUTUBE: string = '/social/chat/youtube';
  public static readonly SUB_PATH_SOCIAL_WEB_LIVE_CHAT: string = '/social/chat/web-live-chat';
  public static readonly SUB_PATH_SOCIAL_REPLY: string = '/setting/tenant/social/reply';
  public static readonly SUB_PATH_SOCIAL_ASSISTED: string = '/setting/tenant/social/assisted';
  public static readonly SUB_PATH_SOCIAL_COMMENT: string = '/setting/tenant/social/comment';
  public static readonly SUB_PATH_SOCIAL_HASHTAG_TAG_ASSIGN: string = '/social/hashtag-and-tags-assign';

  public static readonly ROOT_PATH_SOCIAL_COMMENT: string = '/setting/tenant/social/comment';
  public static readonly ROOT_PATH_CALL_CENTER: string = '/call-center/manage-calls';

  public static readonly ROOT_PATH_STATISTICS: string = '/statistics/voucher-report';
  public static readonly SUB_PATH_RATED_TRANSACTIONS: string = '/statistics/rated-transactions';

  public static readonly ROOT_PATH_CMS_SUNWORLD: string = '/cms-sunworld';
  public static readonly SUB_PATH_CMS_SUNWORLD_SITE_LIST: string = '/cms-sunworld/site-list';
  public static readonly SUB_PATH_CMS_SUNWORLD_PLACE_LIST: string = '/cms-sunworld/place-list';
  public static readonly SUB_PATH_CMS_SUNWORLD_CATEGORY_LIST: string = '/cms-sunworld/category-list';
  public static readonly SUB_PATH_CMS_SUNWORLD_PUSH_IN_APP: string = '/cms-sunworld/push-in-app';
  public static readonly SUB_PATH_CMS_SUNWORLD_NEWS: string = '/cms-sunworld/news';
  public static readonly SUB_PATH_CMS_SUNWORLD_FRAMES: string = '/cms-sunworld/frames';
  public static readonly ALL_PAHT_OF_MODULE_SUNWORLD: Array<string> = [
    DefineConstants.SUB_PATH_CMS_SUNWORLD_SITE_LIST,
    DefineConstants.SUB_PATH_CMS_SUNWORLD_PLACE_LIST,
    DefineConstants.SUB_PATH_CMS_SUNWORLD_CATEGORY_LIST,
    DefineConstants.SUB_PATH_CMS_SUNWORLD_PUSH_IN_APP,
    DefineConstants.SUB_PATH_CMS_SUNWORLD_NEWS,
    DefineConstants.SUB_PATH_CMS_SUNWORLD_FRAMES
  ];

  public static readonly ROOT_PATH_LOYALTY: string = '/loyalty/voucher';
  public static readonly SUB_PATH_LOYALTY_DETAIL: string = '/loyalty/voucher/detail';
  public static readonly ROOT_RATH_PORTAL_VERIFY_VOUCHER: string = '/portal/verify-voucher';
  public static readonly ROOT_PATH_COMPANY_APP_BANNER: string = '/app/mobio/banner';
  public static readonly ROOT_PATH_COMPANY_APP_NEWS: string = `/app/mobio/news`;
  public static readonly SUB_PATH_COMPANY_APP_NEWS_DETAIL: string = `/app/mobio/news/detail`;
  public static readonly ROOT_PATH_COMPANY_APP_VIDEO: string = `/app/mobio/video`;
  public static readonly SUB_PATH_COMPANY_APP_VIDEO_DETAIL: string = `/app/mobio/video/detail`;
  public static readonly SUB_PATH_APP_SEND_NOTIFICATION: string = `/app/mobio/send-in-app-notification`;
  public static readonly SUB_PATH_APP_SEND_NOTIFICATION_DETAIL: string = `/app/mobio/send-in-app-notification/detail`;
  public static readonly ROOT_PATH_INFOMATION: string = '/setting/personal/account-information';
  public static readonly ROOT_PATH_ACCOUNT_MANAGEMENT_ROLE: string = '/setting/tenant/decentralized-admin/role';
  public static readonly ROOT_PATH_ACCOUNT_MANAGEMENT_ROLE_DETAIL: string = '/setting/tenant/decentralized-admin/role/detail';
  public static readonly ROOT_PATH_ACCOUNT_MANAGEMENT_RIGHTS_GROUP: string = '/setting/tenant/decentralized-admin/role-permission';
  public static readonly ROOT_PATH_ACCOUNT_MANAGEMENT_RIGHTS_GROUP_DETAIL: string = '/setting/tenant/decentralized-admin/role-permission/detail';
  public static readonly ROOT_PATH_ACCOUNT_MANAGEMENT_SETTING: string = '/setting/tenant/decentralized-admin/policy-account';
  public static readonly ROOT_PATH_TAGS_ASSIGN: string = '/setting/tenant/object/tag/job-classification';
  public static readonly ROOT_PATH_TAGS: string = '/setting/tenant/object/tag/activity';

  public static readonly ROOT_PATH_ADS: string = '/ads/facebook';
  public static readonly SUB_PATH_ADS_DETAIL: string = '/ads/facebook/detail';
  public static readonly SUB_PATH_ADS_TARGET_AUDIENCE: string = '/ads/target-audience';
  public static readonly SUB_PATH_ADS_TARGET_AUDIENCE_DETAIL: string = '/ads/target-audience/detail';
  public static readonly SUB_PATH_ADS_ACCOUNT_CONNECT: string = '/setting/tenant/integration/ads-connect';
  public static readonly SUB_PATH_ADS_ACCOUNT_CONNECT_DETAIL: string = '/setting/tenant/integration/ads-connect/detail';
  public static readonly SUB_PATH_ADS_MANAGE_CAMPAIGN: string = '/ads/manage-campaign';

  public static readonly ROOT_PATH_SALES: string = '/sales/order';
  public static readonly ROOT_PATH_SALES_ASSIGNMENT: string = '/sales/order/assignment';
  public static readonly ROOT_PATH_SALES_WAITING_ASSIGNMENT: string = '/sales/order/waiting-assignment';
  public static readonly SUB_PATH_DETAIL_SALES: string = '/sales/order/detail';
  public static readonly SUB_PATH_SALES_PROCESS: string = '/setting/tenant/sales/process';
  public static readonly SUB_PATH_SALES_PROCESS_DETAIL: string = '/setting/tenant/sales/process/detail';
  public static readonly SUB_PATH_FIELD_INFO: string = '/setting/tenant/custom-field/sales';
  public static readonly SUB_PATH_FIELD_INFO_DETAIL: string = '/setting/tenant/custom-field/sales/detail';
  public static readonly SUB_PATH_SALES_APPOINTMENT_SCHEDULE: string = '/sales/appointment-schedule';
  public static readonly SUB_PATH_ASSIGN_ORDER_PROCESSING: string = '/sales/assign-order-processing';
  public static readonly SUB_PATH_CONFIG_KPI_TARGET: string = '/sales/config-kpi-target';
  public static readonly SUB_PATH_SALES_ASSISTED: string = '/setting/tenant/sales/assignment';
  public static readonly SUB_PATH_DEAL_AUTOMATION: string = '/setting/tenant/sales/deal-automation';
  public static readonly SUB_PATH_DEAL_AUTOMATION_DETAIL: string = '/setting/tenant/sales/deal-automation/detail';

  public static readonly SUB_PATH_SMS_OF_ROOT_PATH_MARKETING: string = '/marketing/dashboard/sms';
  public static readonly SUB_PATH_EMAIL_OF_ROOT_PATH_MARKETING: string = '/marketing/dashboard/email';
  public static readonly SUB_PATH_EXPORT_FILE_OF_ROOT_PATH_MARKETING: string = '/marketing/dashboard/export-profile-block';

  public static readonly SUB_PATH_CONFIG_CALL_CENTER: string = '/setting/tenant/call-center/config';

  public static readonly ROOT_PATH_TICKET: string = '/ticket/dashboard';
  public static readonly SUB_PATH_DETAIL_TICKET: string = '/ticket/dashboard/detail';
  public static readonly ROOT_PATH_TICKET_FIELD_CONFIG: string = '/setting/tenant/custom-field/ticket';
  public static readonly ROOT_PATH_TICKET_FIELD_CONFIG_DETAIL: string = '/setting/tenant/custom-field/ticket/detail';
  public static readonly ROOT_PATH_SETTING_OBJECT_TICKET: string = '/setting/tenant/object/ticket';
  public static readonly ROOT_PATH_SETTING_ASSIGN_TICKET: string = '/setting/tenant/ticket/assisted';

  public static readonly ROOT_PATH_TENENT_MANAGEMENT: string = '/tenant-management/account';

  public static readonly ROOT_PATH_PRODUCT_LIBRARY: string = '/product-library/product';
  public static readonly ROOT_PATH_PRODUCT_LIBRARY_CATEGORY: string = '/product-library/category';
  public static readonly ROOT_PATH_PRODUCT_LIBRARY_SUPPLIER: string = '/product-library/supplier';
  public static readonly ROOT_PATH_PRODUCT_LIBRARY_PRODUCT_DETAIL: string = '/product-library/product/detail';
  public static readonly ROOT_PATH_PRODUCT_LIBRARY_CATEGORY_DETAIL: string = '/product-library/category/detail';
  public static readonly ROOT_PATH_PRODUCT_LIBRARY_FIELDS_CONFIG: string = '/setting/tenant/custom-field/product-library';
  public static readonly ROOT_PATH_PRODUCT_LIBRARY_FIELDS_CONFIG_DETAIL: string = '/setting/tenant/custom-field/product-library/detail';

  public static readonly ROOT_PATH_WEB_LIVE_CHAT: string = '/setting/tenant/integration/web-live-chat';
  public static readonly ROOT_PATH_WEB_LIVE_CHAT_DETAIL: string = '/setting/tenant/integration/web-live-chat/detail';

  public static readonly ROOT_PATH_LOYALTY_REWARD_POINT_POLICY: string = '/setting/tenant/loyalty-policy/reward-point-policy';
  public static readonly ROOT_PATH_LOYALTY_MEMBERSHIP_CARD_POLICY: string = '/setting/tenant/loyalty-policy/membership-card-policy';
  public static readonly ROOT_PATH_LOYALTY_MEMBERSHIP_CARD_POLICY_DETAIL: string = '/setting/tenant/loyalty-policy/membership-card-policy/detail';
  public static readonly ROOT_PATH_LOYALTY_VOUCHER_OFFERING_POLICY: string = '/setting/tenant/loyalty-policy/voucher-offering-policy';
  public static readonly ROOT_PATH_LOYALTY_VOUCHER_CODE_STORAGE: string = '/loyalty/voucher-code-storage';
  public static readonly ROOT_PATH_LOYALTY_MEMBERSHIP_CARD_CODE_STORAGE: string = '/loyalty/membership-card-code-storage';
  public static readonly ROOT_PATH_LOYALTY_NOTIFICATION: string = '/setting/tenant/loyalty-policy/feedback-notification';

  public static readonly ROOT_PATH_SAMSUNG_IMPORT: string = '/samsung/import';
  public static readonly ROOT_PATH_SAMSUNG_EXPORT: string = '/samsung/export-fanpage';

  public static readonly ROOT_PATH_BANK_PROFILES: string = '/bank/profiles';
  public static readonly ROOT_PATH_BANK_FILTER: string = '/bank/filter';
  public static readonly ROOT_PATH_BANK_REPORT_MARKETING: string = '/bank/report-marketing';
  public static readonly ROOT_PATH_BANK_EXPORT_REPORT: string = '/bank/export-report';
  public static readonly ROOT_PATH_BANK_MANAGE_MCC_MERCHANT: string = '/bank/manage-mcc-merchant';
  public static readonly ROOT_PATH_BANK_MANAGE_MCC_MERCHANT_DETAIL: string = '/bank/manage-mcc-merchant/detail';

  public static readonly ROOT_PATH_LANDING_PAGE: string = '/landing-page/create-url';
  public static readonly ROOT_PATH_LANDING_PAGE_THIRD_PARTY_INTEGRATION: string = '/setting/tenant/integration/landing-page';

  public static readonly SOCIAL_TYPE_FACEBOOK: number = 1;
  public static readonly SOCIAL_TYPE_ZALO: number = 2;
  public static readonly SOCIAL_TYPE_INSTAGRAM: number = 3;
  public static readonly SOCIAL_TYPE_YOUTUBE: number = 4;
  public static readonly SOCIAL_TYPE_MOBILE_APP: number = 5;
  public static readonly SOCIAL_TYPE_LINE: number = 6;
  public static readonly SOCIAL_TYPE_WEB_LIVE_CHAT: number = 7;

  public static readonly ROOT_PATH_VOUCHER_CODE_STORAGE: string = '/voucher/code-storage';
  public static readonly ROOT_PATH_VOUCHER: string = '/voucher/list';
  public static readonly SUB_PATH_VOUCHER_DETAIL: string = '/voucher/list/detail';
  public static readonly ROOT_PATH_VOUCHER_VERIFICATION: string = '/voucher/verification';
  public static readonly ROOT_PATH_VOUCHER_REWARD_BY_PURCHASE: string = '/voucher/reward-by-purchase';

  public static readonly ROOT_PATH_JOURNEY_BUILDER: string = '/journey-builder/list';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_DETAIL: string = '/journey-builder/list/detail';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_REPORT: string = '/journey-builder/list/report';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_MASTER_CAMPAIGN: string = '/journey-builder/master-campaign';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_MASTER_CAMPAIGN_REPORT: string = '/journey-builder/master-campaign/report';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_PERSONALIZED: string = '/journey-builder/config-personalized';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_PERSONALIZED_DETAIL: string = '/journey-builder/config-personalized/detail';
  public static readonly ROOT_PATH_JOURNEY_BUILDER_TEMPLATE_EMAIL: string = '/journey-builder/template-email';

  public static readonly ROOT_PATH_SURVEY: string = '/survey/list';
  public static readonly ROOT_PATH_SURVEY_DETAIL: string = '/survey/list/detail';

  //dùng ở config status nhận phân công công việc
  public static readonly ROOT_PATH_CUSTOMIZE_RULE = '/account/path-customize-rule';

  public static readonly ROOT_PATH_BRAND_AND_LOCATION: string = '/setting/tenant/brand-and-location/brand';
  public static readonly ROOT_PATH_BRAND_AND_LOCATION_SUB_BRAND: string = '/setting/tenant/brand-and-location/sub-brand';
  public static readonly ROOT_PATH_BRAND_AND_LOCATION_SUB_BRAND_DETAIL: string = '/setting/tenant/brand-and-location/sub-brand/detail';
  public static readonly ROOT_PATH_LOYALTY_AREA: string = '/setting/tenant/object/location/area';
  public static readonly ROOT_PATH_LOYALTY_AREA_DETAIL: string = '/setting/tenant/object/location/area/detail';
  public static readonly SUB_PATH_LOYALTY_STORE: string = '/setting/tenant/object/location/brand-store';
  public static readonly SUB_PATH_LOYALTY_STORE_DETAIL: string = '/setting/tenant/object/location/brand-store/detail';

  public static readonly LIST_DOMAIN_PVCOMBANK = ['dev.pvcb.vn', 'pvcombank'];
  public static readonly LIST_DOMAIN_MSB = ['cdp-uat.msb.com.vn', 'cdp.msb.com.vn'];

  public static readonly DYNAMIC_CONFIG_TENENT_SOCIAL_CHAT_BOT = 'social_chat_bot';
  public static readonly DYNAMIC_CONFIG_TENENT_PROFILE_OWNER_CAN_SHOW_PROFILE_DETAIL = 'profile_owner_can_show_profile_detail';

  public static readonly ROOT_PATH_COMPANY: string = '/manage-company/companies';
  public static readonly SUB_PATH_COMPANY_DETAIL: string = '/manage-company/companies/detail';
  public static readonly ROOT_PATH_COMPANY_FIELD_CONFIG: string = '/setting/tenant/custom-field/company';
  public static readonly ROOT_PATH_COMPANY_FIELD_CONFIG_DETAIL: string = '/setting/tenant/custom-field/company/detail';
  public static readonly ROOT_PATH_TEAM_MANAGER: string = '/setting/tenant/team';

  public static readonly SUB_PATH_ACCOUNT_SETTING_WHITE_LIST_DOMAIN: string = '/setting/tenant/journey-builder/whitelist-domain';

  public static readonly ROOT_PATH_SETTING_OBJECT_PROFILES: string = '/setting/tenant/object/profiles';
  public static readonly ROOT_PATH_SETTING_OBJECT_COMPANY: string = '/setting/tenant/object/company';
  public static readonly ROOT_PATH_SETTING_OBJECT_SALES: string = '/setting/tenant/object/sales';
  public static readonly ROOT_PATH_SETTING_OBJECT_PRODUCT_LIBRARY: string = '/setting/tenant/object/product-library';

  public static readonly ROOT_PATH_SETTING_VOUCHER_LOCATION_DISPLAY: string = '/setting/tenant/voucher/location-display';

  public static readonly ROOT_PATH_SETTING_SYNC_DATA_PROFILE_SYNC_RULE: string = '/setting/tenant/integration/sync-data/profile-sync-rule';

  public static readonly SUB_PATH_BANK_SPREADSHEET_DETAIL: string = '/bank/spreadsheet/detail';
  public static readonly ROOT_PATH_BANK_SPREADSHEET: string = '/bank/spreadsheet';

  public static readonly ROOT_PATH_SETTING_TENANT_TEMPLATE_EMAIL: string = '/setting/tenant/form/email-template';
  public static readonly ROOT_PATH_SETTING_PERSONAL_TEMPLATE_EMAIL: string = '/setting/personal/form/email-template';
  public static readonly ROOT_PATH_POPUP_BUILDER: string = '/popup-builder/list';
}
