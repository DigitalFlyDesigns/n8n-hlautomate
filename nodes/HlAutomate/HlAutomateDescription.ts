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
		default: 'create',
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
		default: 'create',
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
				name: 'Get Many',
				value: 'list',
				description: 'List calendar appointments',
				action: 'List calendar appointments',
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

// Contact Fields
const contactFields: INodeProperties[] = [
	// Contact ID (V1 and V2)
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
	// V2 Get Filters
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
		description: 'Email to search for (V2)',
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
		description: 'Phone number to search for (V2)',
	},
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		// Make optional in UI because V1 doesn't need it for 'get'
		displayOptions: {
			show: {
				resource: ['contact'],
				operation: ['get', 'delete'],
			},
		},
		default: '',
		description: 'Location ID (Required for V2 Get/Delete search)',
	},
	// V1 Contact Data (Simple)
	// We can merge this into V2's richer contact data if the names match.
	// V1 name: 'contactData', V2 name: 'contactData'.
	// We will use V2's definition as it is a superset.
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
				description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
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
];

// Location Fields
const locationFields: INodeProperties[] = [
	// V1 & V2 Update ID
	{
		displayName: 'Location ID',
		name: 'locationId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['update', 'delete', 'get'],
			},
		},
		default: '',
		description: 'The ID of the location',
	},
	// V1 Get by Email
	{
		displayName: 'Email Address',
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
		description: 'Location email address (V1 Only, or V2 Filter)',
	},

	// V1 Create/Update Collections (Structured)
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
	{
		displayName: 'Business Information (V1)',
		name: 'businessInfo',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['location'],
				operation: ['create', 'update'],
			},
		},
		default: {},
		description: 'Business Information (Standard for V1)',
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
	{
		displayName: 'Contact Information (V1)',
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
		description: 'Contact Information (Standard for V1)',
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
	{
		displayName: 'Additional Options (V1)',
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
		description: 'Additional Options (Standard for V1)',
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

	// V2 Flat Data
	{
		displayName: 'Location Data (V2)',
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
		description: 'Location Data (Standard for V2)',
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
];

// User Fields
const userFields: INodeProperties[] = [
	// User ID
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
	// Search Fields (V2)
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
		description: 'Email to search for (V2)',
	},
	// User Properties (Create/Update) - Merging V1 and V2
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
	// Account type update etc...
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
			// ... (rest of permissions are fine to assume same)
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

// Calendar Appointment Fields
const calendarAppointmentFields: INodeProperties[] = [
	// Shared Fields
	{
		displayName: 'Calendar ID',
		name: 'calendarId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'calendarBook'],
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
				operation: ['create', 'calendarBook', 'list', 'update'],
			},
		},
		default: '',
	},
	// V1 Create Fields
	{
		displayName: 'Selected Timezone Name or ID',
		name: 'selectedTimezone',
		type: 'options',
		// Make optional as V2 doesn't use it
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Timezone for the appointment (V1 Only). Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>.',
		typeOptions: {
			loadOptionsMethod: 'getTimezones',
		},
	},
	{
		displayName: 'Selected Slot',
		name: 'selectedSlot',
		type: 'string',
		// Used by V1 Create and V2 Book
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'calendarBook'],
			},
		},
		default: '',
		description: 'ISO 8601 datetime (V1 Create or V2 Book)',
	},
	// V2 Create Fields
	{
		displayName: 'Title',
		name: 'title',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'calendarBook', 'update'],
			},
		},
		default: '',
		description: 'Title of the appointment',
	},
	{
		displayName: 'Contact ID',
		name: 'contactId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Contact ID (V2)',
	},
	{
		displayName: 'Start Time',
		name: 'startTime',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'update', 'list'],
			},
		},
		default: '',
		description: 'Start time (V2)',
	},
	{
		displayName: 'End Time',
		name: 'endTime',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'update', 'list'],
			},
		},
		default: '',
		description: 'End time (V2)',
	},
	// V2 Book Fields
	{
		displayName: 'End At',
		name: 'endAt',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['calendarBook'],
			},
		},
		default: '',
		description: 'End Time (V2 Book)',
	},
	// V1/V2 Update Fields
	{
		displayName: 'Appointment ID',
		name: 'appointmentId',
		type: 'string',
		// required: true, // V2 uses 'eventId', V1 'appointmentId'.
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Appointment ID (V1)',
	},
	{
		displayName: 'Event ID',
		name: 'eventId',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['update'],
			},
		},
		default: '',
		description: 'Event ID (V2)',
	},
	{
		displayName: 'Status',
		name: 'status',
		type: 'options',
		// V1 required, V2 optional? V2 has 'appointmentStatus'
		options: [
			{ name: 'Confirmed', value: 'confirmed' },
			{ name: 'Cancelled', value: 'cancelled' },
			{ name: 'Showed', value: 'showed' },
			{ name: 'No Show', value: 'noshow' },
			{ name: 'Invalid', value: 'invalid' },
			// V2 statuses are likely similar but strings
		],
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['update'],
			},
		},
		default: 'confirmed',
		description: 'Status of the appointment (V1)',
	},
	{
		displayName: 'Appointment Status',
		name: 'appointmentStatus',
		type: 'string', // V2 uses string
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'update'],
			},
		},
		default: '',
		description: 'Status (V2)',
	},
	// Other V2 Create fields
	{
		displayName: 'Description',
		name: 'description',
		type: 'string',
		displayOptions: {
			show: {
				resource: ['calendarAppointment'],
				operation: ['create', 'update'],
			},
		},
		default: '',
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