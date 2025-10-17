import { INodeProperties } from 'n8n-workflow';

// Operations
export const hlAutomateV2Operations: INodeProperties[] = [
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['contact'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new contact',
                action: 'Create a contact',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a contact',
                action: 'Delete a contact',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a contact',
                action: 'Get a contact',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List all contacts',
                action: 'List contacts',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a contact',
                action: 'Update a contact',
            },
        ],
        default: 'get',
    },
    // Location Operations
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['location'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new location',
                action: 'Create a location',
            },
            {
                name: 'Delete',
                value: 'delete',
                description: 'Delete a location',
                action: 'Delete a location',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a location',
                action: 'Get a location',
            },
            {
                name: 'List',
                value: 'list',
                description: 'List all locations',
                action: 'List locations',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a location',
                action: 'Update a location',
            },
        ],
        default: 'get',
    },
    // User Operations
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['user'],
            },
        },
        options: [
            {
                name: 'Create',
                value: 'create',
                description: 'Create a new user',
                action: 'Create a user',
            },
            {
                name: 'Get',
                value: 'get',
                description: 'Get a user',
                action: 'Get a user',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update an existing user',
                action: 'Update a user',
            },
        ],
        default: 'get',
    },
    // Calendar Appointment Operations
    {
        displayName: 'Operation',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
            },
        },
        options: [
            {
                name: 'Book',
                value: 'calendarBook',
                description: 'Book a calendar appointment by date slot',
                action: 'Book a calendar appointment by date slot',
            },
            {
                name: 'Create',
                value: 'create',
                description: 'Create a calendar appointment',
                action: 'Create a calendar appointment',
            },
            {
                name: 'Update',
                value: 'update',
                description: 'Update a calendar appointment',
                action: 'Update a calendar appointment',
            },
            {
                name: 'Get Many',
                value: 'list',
                description: 'List calendar appointments',
                action: 'List calendar appointments',
            },
        ],
        default: 'calendarBook',
    },
];

// Fields
export const hlAutomateV2Fields: INodeProperties[] = [
    // Contact ID field
    {
        displayName: 'Contact ID',
        name: 'contactId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['update', 'delete'],
            },
        },
        default: '',
        description: 'The ID of the contact',
    },
    // Fields used by GET (search) operation
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'Email to search for',
    },
    {
        displayName: 'Phone',
        name: 'phone',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'Phone number to search for',
    },
    {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['get', 'delete'],
            },
        },
        default: '',
        description: 'Location ID (required) for the search or delete',
    },
    // Contact data fields for create/update
    {
        displayName: 'Contact Data',
        name: 'contactData',
        type: 'collection',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: ['contact'],
                operation: ['create', 'update'],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Address',
                name: 'address1',
                type: 'string',
                default: '',
            },
            {
                displayName: 'City',
                name: 'city',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Custom Field (JSON)',
                name: 'customField',
                type: 'json',
                default: '',
                description: 'Custom fields as JSON object',
            },
            {
                displayName: 'DND',
                name: 'dnd',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Email',
                name: 'email',
                type: 'string',
                default: '',
                placeholder: 'name@email.com',
            },
            {
                displayName: 'First Name',
                name: 'firstName',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Full Name',
                name: 'name',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Last Name',
                name: 'lastName',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Location ID',
                name: 'locationId',
                type: 'string',
                default: '',
                description: 'The Location ID to associate the contact with',
            },
            {
                displayName: 'Phone',
                name: 'phone',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Postal Code',
                name: 'postalCode',
                type: 'string',
                default: '',
            },
            {
                displayName: 'State',
                name: 'state',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Tags',
                name: 'tags',
                type: 'string',
                default: '',
                description: 'Comma-separated list of tags',
            },
            {
                displayName: 'Timezone Name or ID',
                name: 'timezone',
                type: 'options',
                default: '',
                description: 'Choose from the list, or specify an ID using an expression. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
                typeOptions: {
                    loadOptionsMethod: 'getTimezones',
                },
            },
            {
                displayName: 'Website',
                name: 'website',
                type: 'string',
                default: '',
            },
        ],
    },
    // Email field for location operations
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        displayOptions: {
            show: {
                resource: ['location'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'Email to search for',
    },
    // Location ID field for location operations
    {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['location'],
                operation: ['get', 'update', 'delete'],
            },
        },
        default: '',
        description: 'The ID of the location',
    },
    // Location data fields for create/update
    {
        displayName: 'Location Data',
        name: 'locationData',
        type: 'collection',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: ['location'],
                operation: ['create', 'update'],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Address',
                name: 'loc_address',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Allow Duplicate Contacts',
                name: 'loc_setting_allowDuplicateContact',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Allow Duplicate Opportunities',
                name: 'loc_setting_allowDuplicateOpportunity',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Allow Facebook Name Merge',
                name: 'loc_setting_allowFacebookNameMerge',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Business Name',
                name: 'loc_bname',
                type: 'string',
                default: '',
            },
            {
                displayName: 'City',
                name: 'loc_city',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Country',
                name: 'loc_country',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Custom Values',
                name: 'customValues',
                type: 'json',
                default: '{}',
                description: 'Custom values as JSON object',
            },
            {
                displayName: 'Disable Contact Timezone',
                name: 'loc_setting_disableContactTimezone',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Email',
                name: 'loc_email',
                type: 'string',
                default: '',
                placeholder: 'name@email.com',
            },
            {
                displayName: 'Phone',
                name: 'loc_phone',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Postal Code',
                name: 'loc_postalCode',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Snapshot',
                name: 'snapshot',
                type: 'string',
                default: '',
                description: 'Location snapshot data',
            },
            {
                displayName: 'State',
                name: 'loc_state',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Timezone',
                name: 'loc_timezone',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Website',
                name: 'loc_website',
                type: 'string',
                default: '',
            },
        ],
    },
    // User ID field for update
    {
        displayName: 'User ID',
        name: 'userId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The ID of the user to update',
    },
    
    // Fields used by GET (search) operation for users
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        placeholder: 'name@email.com',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['get'],
            },
        },
        default: '',
        description: 'Email to search for',
    },

    // User data fields for create/update
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'First name of the user',
    },
    {
        displayName: 'First Name',
        name: 'firstName',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'First name of the user',
    },
    {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'Last name of the user',
    },
    {
        displayName: 'Last Name',
        name: 'lastName',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Last name of the user',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'Email address of the user',
        placeholder: 'user@example.com',
    },
    {
        displayName: 'Email',
        name: 'email',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Email address of the user',
        placeholder: 'user@example.com',
    },
    {
        displayName: 'Password',
        name: 'password',
        type: 'string',
        typeOptions: {
            password: true,
        },
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'Password for the user account',
    },
    {
        displayName: 'Password',
        name: 'password',
        type: 'string',
        typeOptions: {
            password: true,
        },
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Password for the user account (leave empty to keep current password)',
    },
    {
        displayName: 'Account Type',
        name: 'type',
        type: 'options',
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'Agency',
                value: 'agency',
            },
            {
                name: 'User',
                value: 'user',
            },
        ],
        default: 'user',
        description: 'Type of user account to create',
    },
    {
        displayName: 'Account Type',
        name: 'type',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        options: [
            {
                name: 'Agency',
                value: 'agency',
            },
            {
                name: 'User',
                value: 'user',
            },
        ],
        default: 'user',
        description: 'Type of user account',
    },
    {
        displayName: 'Account Role',
        name: 'role',
        type: 'options',
        required: true,
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create'],
            },
        },
        options: [
            {
                name: 'Admin',
                value: 'admin',
            },
            {
                name: 'User',
                value: 'user',
            },
        ],
        default: 'user',
        description: 'Role for the user account',
    },
    {
        displayName: 'Account Role',
        name: 'role',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['update'],
            },
        },
        options: [
            {
                name: 'Admin',
                value: 'admin',
            },
            {
                name: 'User',
                value: 'user',
            },
        ],
        default: 'user',
        description: 'Role for the user account',
    },
    {
        displayName: 'Location IDs',
        name: 'locationIds',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'Comma-separated list of location IDs to assign to the user',
        placeholder: 'location1,location2,location3',
    },
    {
        displayName: 'Phone Number',
        name: 'phone',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'Phone number of the user',
        placeholder: '+1234567890',
    },
    // Permissions
    {
        displayName: 'Permissions',
        name: 'permissions',
        type: 'collection',
        placeholder: 'Add Permission',
        displayOptions: {
            show: {
                resource: ['user'],
                operation: ['create', 'update'],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Adwords Reporting',
                name: 'adwordsReportingEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Appointments',
                name: 'appointmentsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Assigned Data Only',
                name: 'assignedDataOnly',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Attributions Reporting',
                name: 'attributionsReportingEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Bulk Requests',
                name: 'bulkRequestsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Call Reporting',
                name: 'phoneCallEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Contacts',
                name: 'contactsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Conversations',
                name: 'conversationsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Dashboard Stats',
                name: 'dashboardStatsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Facebook Ads Reporting',
                name: 'facebookAdsReportingEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Funnels',
                name: 'funnelsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Lead Value',
                name: 'leadValueEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Marketing',
                name: 'marketingEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Membership',
                name: 'membershipEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Online Listings',
                name: 'onlineListingsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Opportunities',
                name: 'opportunitiesEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Reviews',
                name: 'reviewsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Settings',
                name: 'settingsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Tags',
                name: 'tagsEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Triggers',
                name: 'triggersEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Websites',
                name: 'websitesEnabled',
                type: 'boolean',
                default: false,
            },
            {
                displayName: 'Workflows',
                name: 'workflowsEnabled',
                type: 'boolean',
                default: false,
            },
        ],
    },
    // Calendar Appointment Fields
    // Fields for calendarBook operation (existing)
    {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['calendarBook'],
            },
        },
        default: '',
        description: 'The ID of the location',
    },
    {
        displayName: 'Calendar ID',
        name: 'calendarId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['calendarBook'],
            },
        },
        default: '',
        description: 'The ID of the calendar',
    },
    {
        displayName: 'Selected Slot',
        name: 'selectedSlot',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['calendarBook'],
            },
        },
        default: '',
        description: 'ISO 8601 datetime with timezone offset, e.g. 2021-02-05T11:00:00+05:30',
    },
    {
        displayName: 'End At',
        name: 'endAt',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['calendarBook'],
            },
        },
        default: '',
        description: 'ISO 8601 datetime with timezone offset for the end time, e.g. 2021-02-05T11:30:00+05:30',
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['calendarBook'],
            },
        },
        default: '',
        description: 'Title for the appointment',
    },
    
    // Fields for list operation
    {
        displayName: 'Location ID',
        name: 'locationId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['list'],
            },
        },
        default: '',
        description: 'The ID of the location. Example: C2QujeCh8ZnC7al2InWR.',
    },
    {
        displayName: 'Start Time',
        name: 'startTime',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['list'],
            },
        },
        default: '',
        description: 'Start Time. Example: 2021-06-23T03:30:00+05:30.',
    },
    {
        displayName: 'End Time',
        name: 'endTime',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['list'],
            },
        },
        default: '',
        description: 'End Time. Example: 2021-06-23T04:30:00+05:30.',
    },

    // Fields for create operation
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create'],
            },
        },
        default: '',
        description: 'Title for the appointment. Example: Test Event.',
    },
    
    // Shared fields for both create and update operations
    {
        displayName: 'Meeting Location Type',
        name: 'meetingLocationType',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'Meeting location type. If address is provided in the request body, the meetingLocationType defaults to custom. Possible values: [custom, zoom, gmeet, phone, address, ms_teams, google]. Example: custom.',
    },
    {
        displayName: 'Meeting Location ID',
        name: 'meetingLocationId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'The unique identifier for the meeting location. This value can be found in calendar.locationConfigurations or calendar.teamMembers[].locationConfigurations. Default value: default. Example: custom_0.',
    },
    {
        displayName: 'Override Location Config',
        name: 'overrideLocationConfig',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: false,
        description: 'Whether to override location config. false - If only meetingLocationId is provided. true - If only meetingLocationType is provided. Example: true.',
    },
    {
        displayName: 'Appointment Status',
        name: 'appointmentStatus',
        type: 'options',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        options: [
            {
                name: 'Cancelled',
                value: 'cancelled',
            },
            {
                name: 'Confirmed',
                value: 'confirmed',
            },
            {
                name: 'Invalid',
                value: 'invalid',
            },
            {
                name: 'New',
                value: 'new',
            },
            {
                name: 'No Show',
                value: 'noshow',
            },
            {
                name: 'Showed',
                value: 'showed',
            },
        ],
        default: 'confirmed',
    },
    {
        displayName: 'Assigned User ID',
        name: 'assignedUserId',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'Assigned User ID. Example: 0007BWpSzSwfiuSl0tR2.',
    },
    {
        displayName: 'Description',
        name: 'description',
        type: 'string',
        typeOptions: {
            rows: 4,
        },
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'Appointment Description. Example: Booking a call to discuss the project.',
    },
    {
        displayName: 'Address',
        name: 'address',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'Appointment Address. Example: Zoom.',
    },
    {
        displayName: 'Ignore Date Range',
        name: 'ignoreDateRange',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: false,
        description: 'Whether to ignore date range validation. If set to true, the minimum scheduling notice and date range would be ignored. Example: false.',
    },
    {
        displayName: 'To Notify',
        name: 'toNotify',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: false,
        description: 'Whether to send notification. If set to false, the automations will not run. Example: false.',
    },
    {
        displayName: 'Ignore Free Slot Validation',
        name: 'ignoreFreeSlotValidation',
        type: 'boolean',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: false,
        description: 'Whether to ignore free slot validation. If true the time slot validation would be avoided for any appointment creation (even the ignoreDateRange). Example: true.',
    },
    {
        displayName: 'RRule',
        name: 'rrule',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['create', 'update'],
            },
        },
        default: '',
        description: 'RRULE as per the iCalendar (RFC 5545) specification for recurring events. DTSTART is not required, instance IDs are calculated on the basis of startTime of the event. The rrule only be applied if ignoreFreeSlotValidation is true.',
    },

    // Fields for update operation
    {
        displayName: 'Event ID',
        name: 'eventId',
        type: 'string',
        required: true,
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'The ID of the event to update',
    },
    {
        displayName: 'Title',
        name: 'title',
        type: 'string',
        displayOptions: {
            show: {
                resource: ['calendarAppointment'],
                operation: ['update'],
            },
        },
        default: '',
        description: 'Title for the appointment. Example: Test Event.',
    },
    // Note: Other shared fields (meetingLocationType, meetingLocationId, overrideLocationConfig, 
    // appointmentStatus, assignedUserId, description, address, ignoreDateRange, toNotify, 
    // ignoreFreeSlotValidation, rrule, locationId, startTime, endTime) are defined in the 
    // shared section above to avoid duplication

];
