import { INodeProperties } from 'n8n-workflow';

// Contact Operations
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
];

// Contact Fields
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
];