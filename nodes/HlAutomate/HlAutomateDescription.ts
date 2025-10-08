import { INodeProperties } from 'n8n-workflow';

// Contact Operations
export const contactOperations: INodeProperties[] = [
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
];

// Calendar Appointment Operations
export const calendarAppointmentOperations: INodeProperties[] = [
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
				name: 'Create',
				value: 'create',
				description: 'Create a calendar appointment',
				action: 'Create a calendar appointment',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update a calendar appointment status',
				action: 'Update a calendar appointment status',
			},
		],
		default: 'create',
	},
];

// Calendar Appointment Fields
export const calendarAppointmentFields: INodeProperties[] = [
	{
		displayName: 'Calendar ID',
		name: 'calendarId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create'],
			},
		},
		default: '',

	},
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create'],
			},
		},
		default: '',

	},
	{
		displayName: 'Selected Timezone Name or ID',
		name: 'selectedTimezone',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Timezone for the appointment. Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getTimezones',
		},
	},
	{
		displayName: 'Selected Slot',
		name: 'selectedSlot',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create'],
			},
		},
		default: '',
		   description: 'ISO 8601 datetime with timezone offset, e.g. 2021-02-05T11:00:00+05:30',
	   },
		// Update fields
		{
			displayName: 'Appointment ID',
			name: 'appointmentId',
			type: 'string',
			required: true,
			displayOptions: {
				show: {
					resource: ['calendarAppointment'],
					operation: ['update'],
				},
			},
			default: '',

		},
		{
			displayName: 'Status',
			name: 'status',
			type: 'options',
			required: true,
			// eslint-disable-next-line n8n-nodes-base/node-param-options-type-unsorted-items
			options: [
				{ name: 'Confirmed', value: 'confirmed' },
				{ name: 'Cancelled', value: 'cancelled' },
				{ name: 'Showed', value: 'showed' },
				{ name: 'No Show', value: 'noshow' },
				{ name: 'Invalid', value: 'invalid' },
			],
			displayOptions: {
				show: {
					resource: ['calendarAppointment'],
					operation: ['update'],
				},
			},
			default: 'confirmed',
			description: 'Status of the appointment',
		},
	];

	// User Operations
	export const userOperations: INodeProperties[] = [
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
				description: 'Create a new GHL user',
				action: 'Create a user',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing GHL user',
				action: 'Update a user',
			},
		],
		default: 'create',
	},
];

// Location Operations
export const locationOperations: INodeProperties[] = [
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
				description: 'Create a new GHL location',
				action: 'Create a location',
			},
			{
				name: 'Update',
				value: 'update',
				description: 'Update an existing GHL location',
				action: 'Update a location',
			},
			{
				name: 'Get',
				value: 'get',
				description: 'Get a GHL location',
				action: 'Get a location',
			},
		],
		default: 'create',
	},
];

// Contact Fields
const contactFields: INodeProperties[] = [
	// Contact ID field
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'update', 'delete'],
			},
		},
		default: '',
		description: 'The ID of the contact',
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
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
			},
		],
	},
];

// Location Fields
const locationFields: INodeProperties[] = [
	// Location ID field for update
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'The ID of the location to update',
	},
	// Location email field for find->get
	{
		displayName: 'Email Address',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['get'],
			},
		},
		default: '',
		description: 'Location email address',
	},
	// Location Settings
	{
		displayName: 'Location Settings',
		name: 'locationSettings',
		type: 'collection',
		placeholder: 'Add Setting',
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Allow Duplicate Contact',
				name: 'allowDuplicateContact',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Allow Duplicate Opportunity',
				name: 'allowDuplicateOpportunity',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Allow Facebook Name Merge',
				name: 'allowFacebookNameMerge',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Disable Contact Timezone',
				name: 'disableContactTimezone',
				type: 'boolean',
				default: false,
			},
		],
	},
	// Business Information (create)
	{
		displayName: 'Business Information',
		name: 'businessInfo',
		type: 'collection',
		placeholder: 'Add Field',
        required: true,
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Address',
				name: 'address',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Business Name',
				name: 'name',
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
				displayName: 'Country',
				name: 'country',
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
				description: 'State in short form (ex: CA, NY, TX)',
			},
			{
				displayName: 'Timezone Name or ID',
				name: 'timezone',
				type: 'options',
				default: '',
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
    // Business Information (update)

    {
        displayName: 'Business Information',
        name: 'businessInfo',
        type: 'collection',
        placeholder: 'Add Field',
        displayOptions: {
            show: {
                resource: ['location'],
                operation: ['update'],
            },
        },
        default: {},
        options: [
            {
                displayName: 'Address',
                name: 'address',
                type: 'string',
                default: '',
            },
            {
                displayName: 'Business Name',
                name: 'name',
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
                displayName: 'Country',
                name: 'country',
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
                description: 'State in short form (ex: CA, NY, TX)',
            },
            {
                displayName: 'Timezone Name or ID',
                name: 'timezone',
                type: 'options',
                default: '',
                description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
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
	// Contact Information
	{
		displayName: 'Contact Information',
		name: 'contactInfo',
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
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
			},
			{
				displayName: 'Phone',
				name: 'phone',
				type: 'string',
				default: '',
			},
		],
	},
	// Additional Options
	{
		displayName: 'Additional Options',
		name: 'additionalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Custom Values',
				name: 'customValues',
				type: 'string',
				default: '',
				description: 'JSON format for custom values',
				placeholder: '{"custom_field": "value"}',
			},
			{
				displayName: 'Snapshot',
				name: 'snapshot',
				type: 'string',
				default: '',
				description: 'Snapshot ID to use for the location',
			},
		],
	},
];

// User Fields
const userFields: INodeProperties[] = [
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
	// Required user information
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
				displayName: 'Campaigns',
				name: 'campaignsEnabled',
				type: 'boolean',
				default: false,
			},
			{
				displayName: 'Campaigns Read Only',
				name: 'campaignsReadOnly',
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
				displayName: 'Workflow',
				name: 'workflowsEnabled',
				type: 'boolean',
				default: false,
			},
		],
	},
];

// Export all fields combined
export const hlautomateFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                contact                                     */
	/* -------------------------------------------------------------------------- */
	...contactFields,

	/* -------------------------------------------------------------------------- */
	/*                                location                                    */
	/* -------------------------------------------------------------------------- */
	...locationFields,

	/* -------------------------------------------------------------------------- */
	/*                                user                                        */
	/* -------------------------------------------------------------------------- */
	...userFields,

	/* -------------------------------------------------------------------------- */
	/*                                calendarAppointment                         */
	/* -------------------------------------------------------------------------- */
	...calendarAppointmentFields,
];