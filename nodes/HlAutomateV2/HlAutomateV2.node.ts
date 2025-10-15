/* eslint-disable n8n-nodes-base/node-filename-against-convention */
/* eslint-disable n8n-nodes-base/node-class-description-credentials-name-unsuffixed */
/* eslint-disable n8n-nodes-base/node-filename-against-convention */
import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodePropertyOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { hlAutomateV2Operations, hlAutomateV2Fields } from './HlAutomateV2Description';

export class HlAutomateV2 implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HL Automate V2',
		name: 'hlAutomateV2',
		icon: 'file:hlautomate.svg',
		group: ['automation'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HL Automate API V2',
		defaults: {
			name: 'HL Automate V2',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'hlautomateApiV2',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Contact',
						value: 'contact',
					},
				],
				default: 'contact',
			},
            ...hlAutomateV2Operations,
            ...hlAutomateV2Fields,
		],
	};

	methods = {
		loadOptions: {
			// Method to dynamically load available timezones
						async getTimezones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
							try {
								// Get credentials for authentication
								const credentials = await this.getCredentials('hlautomateApiV2');
								
								// Use existing authentication method
								const accessToken = await authenticateAndGetToken(this as any, credentials);
								
								// Fetch timezones from API
								const timezonesResponse = await this.helpers.httpRequest({
									method: 'GET',
									url: 'https://api.hlautomate.com/v2/ghl/timezones',
									headers: {
										'Accept': 'application/json',
										'Authorization': `Bearer ${accessToken}`,
									},
									json: true,
								});
								
								// Process the response and return options
								if (Array.isArray(timezonesResponse)) {
									return timezonesResponse.map((timezone: any) => ({
										name: timezone.displayName || timezone.name || timezone.id,
										value: timezone.id || timezone.value,
									}));
								} else if (timezonesResponse && typeof timezonesResponse === 'object') {
									// Handle case where response is an object with timezone data
									const timezones = timezonesResponse.timezones || timezonesResponse.data || timezonesResponse;
									if (Array.isArray(timezones)) {
										return timezones.map((timezone: any) => ({
											name: timezone.displayName || timezone.name || timezone.id,
											value: timezone.id || timezone.value,
										}));
									}
								}
								
								// Fallback to basic timezones if response format is unexpected
								return [
									{ name: 'US/Central', value: 'US/Central' },
									{ name: 'US/Eastern', value: 'US/Eastern' },
									{ name: 'US/Pacific', value: 'US/Pacific' },
									{ name: 'US/Mountain', value: 'US/Mountain' },
								];
								
							} catch (error) {
								// Fallback to basic timezones if API call fails
								return [
									{ name: 'US/Central', value: 'US/Central' },
									{ name: 'US/Eastern', value: 'US/Eastern' },
									{ name: 'US/Pacific', value: 'US/Pacific' },
									{ name: 'US/Mountain', value: 'US/Mountain' },
								];
							}
						},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Get credentials
		const credentials = await this.getCredentials('hlautomateApiV2');
		
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Authenticate and get access token
				const accessToken = await authenticateAndGetToken(this, credentials);

				let responseData: any;

				if (resource === 'contact') {
					responseData = await handleContactOperation(this, operation, i, accessToken);
				} else if (resource === 'location') {
					responseData = await handleLocationOperation(this, operation, i, accessToken);
				} else if (resource === 'user') {
					responseData = await handleUserOperation(this, operation, i, accessToken);
				} else if (resource === 'calendarAppointment') {
					responseData = await handleCalendarAppointmentOperation(this, operation, i, accessToken);
				}

				returnData.push({
					json: responseData,
					pairedItem: {
						item: i,
					},
				});

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

// Helper functions
async function authenticateAndGetToken(context: IExecuteFunctions, credentials: any): Promise<string> {
	const authOptions: IHttpRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: 'https://api.hlautomate.com/v2/auth/login',
		headers: {
			'Content-Type': 'application/json',
		},
		body: {
			email: credentials.email,
			password: credentials.password,
		},
		json: true,
	};

	try {
		const authResponse = await context.helpers.httpRequest(authOptions);
		
		if (authResponse.tokens && authResponse.tokens.access && authResponse.tokens.access.token) {
			return authResponse.tokens.access.token;
		} else {
			throw new NodeOperationError(context.getNode(), 'Authentication failed: No access token received');
		}
	} catch (error) {
		throw new NodeOperationError(context.getNode(), `Authentication failed: ${error.message}`);
	}
}

async function makeAuthenticatedRequest(context: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, accessToken: string, body?: any): Promise<any> {
	const options: IHttpRequestOptions = {
		method,
		url: `https://api.hlautomate.com/v2${endpoint}`,
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`,
		},
		json: true,
	};

	if (body) {
		options.body = body;
	}

	return await context.helpers.httpRequest(options);
}

async function handleCalendarAppointmentOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {

};

async function handleUserOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {
	
};

async function handleLocationOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {

};

async function handleContactOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {
    switch (operation) {
        case 'create':
            const createData = context.getNodeParameter('contactData', itemIndex) as any;
			return await makeAuthenticatedRequest(context, 'POST', '/ghlcontact', accessToken, createData);

		case 'get': {
			// For get we require locationId and allow email and phone as optional filters
			const email = context.getNodeParameter('email', itemIndex, '') as string;
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			const phone = context.getNodeParameter('phone', itemIndex, '') as string;

			if (!locationId) {
				throw new NodeOperationError(context.getNode(), 'locationId is required for get contact');
			}

			const params: string[] = [];
			if (email) params.push(`email=${encodeURIComponent(email)}`);
			params.push(`locationId=${encodeURIComponent(locationId)}`);
			if (phone) params.push(`phone=${encodeURIComponent(phone)}`);

			const endpoint = `/ghlcontact?${params.join('&')}`;
			return await makeAuthenticatedRequest(context, 'GET', endpoint, accessToken);
		}

        case 'update':
            const updateContactId = context.getNodeParameter('contactId', itemIndex) as string;
            const updateData = context.getNodeParameter('contactData', itemIndex) as any;
			updateData.contact_id = updateContactId;
            return await makeAuthenticatedRequest(context, 'PUT', `/ghlcontact`, accessToken, updateData);

		case 'delete': {
			// For delete, send contact_id and locationId in the body
			const deleteContactId = context.getNodeParameter('contactId', itemIndex) as string;
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;

			const requestBody = {
				contact_id: deleteContactId,
				locationId,
			};

			return await makeAuthenticatedRequest(context, 'DELETE', `/ghlcontact`, accessToken, requestBody);
		}

        case 'list':
			return await makeAuthenticatedRequest(context, 'GET', '/ghlcontact', accessToken);

        default:
            throw new NodeOperationError(context.getNode(), `Unknown contact operation: ${operation}`);
    }
};