import { INodeProperties } from 'n8n-workflow';

// When the resource `httpVerb` is selected, this `operation` parameter will be shown.
export const httpVerbOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,

		displayOptions: {
			show: {
				resource: ['httpVerb'],
			},
		},
		options: [
			{
				name: 'GET',
				value: 'get',
				description: 'Perform a GET request',
				action: 'Perform a GET request',
				routing: {
					request: {
						method: 'GET',
						url: '/get',
					},
				},
			},
			{
				name: 'DELETE',
				value: 'delete',
				description: 'Perform a DELETE request',
				action: 'Perform a DELETE request',
				routing: {
					request: {
						method: 'DELETE',
						url: '/delete',
					},
				},
			},
			{
				name: 'Test Trigger',
				value: 'testTrigger',
				description: 'Trigger a test execution with pre-execution API call',
				action: 'Execute a test trigger with API call',
				routing: {
					request: {
						method: 'GET',
						url: '/uuid',
					},
				},
			},
		],
		default: 'get',
	},
];

// Here we define what to show when the `get` operation is selected.
// We do that by adding `operation: ["get"]` to `displayOptions.show`
const getOperation: INodeProperties[] = [
	{
		displayName: 'Type of Data',
		name: 'typeofData',
		default: 'queryParameter',
		description: 'Select type of data to send [Query Parameters]',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['get'],
			},
		},
		type: 'options',
		options: [
			{
				name: 'Query',
				value: 'queryParameter',
			},
		],
		required: true,
	},
	{
		displayName: 'Query Parameters',
		name: 'arguments',
		default: {},
		description: "The request's query parameters",
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['get'],
			},
		},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Key of query parameter',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '={{$parent.key}}',
								type: 'query',
							},
						},
						required: true,
						description: 'Value of query parameter',
					},
				],
			},
		],
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
	},
];

// Here we define what to show when the DELETE Operation is selected.
// We do that by adding `operation: ["delete"]` to `displayOptions.show`
const deleteOperation: INodeProperties[] = [
	{
		displayName: 'Type of Data',
		name: 'typeofData',
		default: 'queryParameter',
		description: 'Select type of data to send [Query Parameter Arguments, JSON-Body]',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['delete'],
			},
		},
		options: [
			{
				name: 'Query',
				value: 'queryParameter',
			},
			{
				name: 'JSON',
				value: 'jsonData',
			},
		],
		required: true,
		type: 'options',
	},
	{
		displayName: 'Query Parameters',
		name: 'arguments',
		default: {},
		description: "The request's query parameters",
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['delete'],
				typeofData: ['queryParameter'],
			},
		},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Key of query parameter',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '={{$parent.key}}',
								type: 'query',
							},
						},
						required: true,
						description: 'Value of query parameter',
					},
				],
			},
		],
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
	},
	{
		displayName: 'JSON Object',
		name: 'arguments',
		default: {},
		description: "The request's JSON properties",
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['delete'],
				typeofData: ['jsonData'],
			},
		},
		options: [
			{
				name: 'keyvalue',
				displayName: 'Key:Value',
				values: [
					{
						displayName: 'Key',
						name: 'key',
						type: 'string',
						default: '',
						required: true,
						description: 'Key of JSON property',
					},
					{
						displayName: 'Value',
						name: 'value',
						type: 'string',
						default: '',
						routing: {
							send: {
								property: '={{$parent.key}}',
								type: 'body',
							},
						},
						required: true,
						description: 'Value of JSON property',
					},
				],
			},
		],
		type: 'fixedCollection',
		typeOptions: {
			multipleValues: true,
		},
	},
];

// Here we define what to show when the Test Trigger Operation is selected.
// We do that by adding `operation: ["testTrigger"]` to `displayOptions.show`
const testTriggerOperation: INodeProperties[] = [
	{
		displayName: 'Test Message',
		name: 'testMessage',
		type: 'string',
		default: 'This is a test execution with API call',
		description: 'Custom message to include in the test output',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['testTrigger'],
			},
		},
	},
	{
		displayName: 'Include Timestamp',
		name: 'includeTimestamp',
		type: 'boolean',
		default: true,
		description: 'Whether to include a timestamp in the test output',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['testTrigger'],
			},
		},
	},
	{
		displayName: 'Sample Data Count',
		name: 'sampleDataCount',
		type: 'number',
		default: 1,
		typeOptions: {
			minValue: 1,
			maxValue: 10,
		},
		description: 'Number of sample data items to generate (1-10)',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['testTrigger'],
			},
		},
	},
	{
		displayName: 'Pre-Execution API Endpoint Name or ID',
		name: 'preExecutionEndpoint',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAvailableTriggers',
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['testTrigger'],
			},
		},
	},
	{
		displayName: 'HTTP Method Name or ID',
		name: 'httpMethodTest',
		type: 'options',
		default: '',
		typeOptions: {
			loadOptionsMethod: 'getAvailableHttpMethods',
		},
		description: 'Choose from the list, or specify an ID using an <a href="https://docs.n8n.io/code/expressions/">expression</a>',
		displayOptions: {
			show: {
				resource: ['httpVerb'],
				operation: ['testTrigger'],
			},
		},
	},
];

export const httpVerbFields: INodeProperties[] = [
	/* -------------------------------------------------------------------------- */
	/*                                httpVerb:get                                */
	/* -------------------------------------------------------------------------- */
	...getOperation,

	/* -------------------------------------------------------------------------- */
	/*                              httpVerb:delete                               */
	/* -------------------------------------------------------------------------- */
	...deleteOperation,

	/* -------------------------------------------------------------------------- */
	/*                           httpVerb:testTrigger                             */
	/* -------------------------------------------------------------------------- */
	...testTriggerOperation,
];
