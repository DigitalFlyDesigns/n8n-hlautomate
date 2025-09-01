import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
	IHttpRequestOptions,
	IHttpRequestMethods,
} from 'n8n-workflow';
import { contactOperations, locationOperations, hlautomateFields } from './HlAutomateDescription';

export class HlAutomate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HL Automate',
		name: 'hlAutomate',
		icon: 'file:hlautomate.svg',
		group: ['automation'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HL Automate API',
		defaults: {
			name: 'HL Automate',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'hlautomateApi',
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
					{
						name: 'Location',
						value: 'location',
					},
				],
				default: 'contact',
			},

			...contactOperations,
			...locationOperations,
			...hlautomateFields,
		],
	};

	methods = {
		loadOptions: {
			// Method to dynamically load available timezones
			async getTimezones(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Get credentials for authentication
					const credentials = await this.getCredentials('hlautomateApi');
					
					// Use existing authentication method
					const accessToken = await authenticateAndGetToken(this as any, credentials);
					
					// Fetch timezones from API
					const timezonesResponse = await this.helpers.httpRequest({
						method: 'GET',
						url: 'https://api.hlautomate.com/v1/ghl/timezones',
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
		const credentials = await this.getCredentials('hlautomateApi');
		
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

// Helper functions moved outside the class
async function authenticateAndGetToken(context: IExecuteFunctions, credentials: any): Promise<string> {
	const authOptions: IHttpRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: 'https://api.hlautomate.com/v1/auth/login',
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
		url: `https://api.hlautomate.com/v1${endpoint}`,
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

async function handleContactOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {
	switch (operation) {
		case 'create':
			const createData = context.getNodeParameter('contactData', itemIndex) as any;
			return await makeAuthenticatedRequest(context, 'POST', '/contacts', accessToken, createData);

		case 'get':
			const getContactId = context.getNodeParameter('contactId', itemIndex) as string;
			return await makeAuthenticatedRequest(context, 'GET', `/contacts/${getContactId}`, accessToken);

		case 'update':
			const updateContactId = context.getNodeParameter('contactId', itemIndex) as string;
			const updateData = context.getNodeParameter('contactData', itemIndex) as any;
			return await makeAuthenticatedRequest(context, 'PUT', `/contacts/${updateContactId}`, accessToken, updateData);

		case 'delete':
			const deleteContactId = context.getNodeParameter('contactId', itemIndex) as string;
			return await makeAuthenticatedRequest(context, 'DELETE', `/contacts/${deleteContactId}`, accessToken);

		case 'list':
			return await makeAuthenticatedRequest(context, 'GET', '/contacts', accessToken);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown contact operation: ${operation}`);
	}
}

async function handleLocationOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {
	switch (operation) {
		case 'create':
			// Get all the form data
			const locationSettings = context.getNodeParameter('locationSettings', itemIndex, {}) as any;
			const businessInfo = context.getNodeParameter('businessInfo', itemIndex, {}) as any;
			const contactInfo = context.getNodeParameter('contactInfo', itemIndex, {}) as any;
			const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as any;

			// Get credentials for GHL API key
			const credentials = await context.getCredentials('hlautomateApi');

			// Prepare the request body matching the Zapier format
			const requestBody = {
				ghl_api_key: credentials.ghl_agency_key,
				loc_setting_allowDuplicateContact: locationSettings.allowDuplicateContact || false,
				loc_setting_allowDuplicateOpportunity: locationSettings.allowDuplicateOpportunity || false,
				loc_setting_allowFacebookNameMerge: locationSettings.allowFacebookNameMerge || false,
				loc_setting_disableContactTimezone: locationSettings.disableContactTimezone || false,
				loc_bname: businessInfo.name,
				loc_address: businessInfo.address,
				loc_city: businessInfo.city,
				loc_country: businessInfo.country,
				loc_state: businessInfo.state,
				loc_postalCode: businessInfo.postalCode,
				loc_website: businessInfo.website || '',
				loc_timezone: businessInfo.timezone,
				loc_firstName: contactInfo.firstName,
				loc_lastName: contactInfo.lastName,
				loc_email: contactInfo.email,
				loc_phone: contactInfo.phone,
				snapshot: additionalOptions.snapshot || '',
				customValues: additionalOptions.customValues ? JSON.parse(additionalOptions.customValues) : {}
			};

			return await makeAuthenticatedRequest(context, 'POST', '/ghl', accessToken, requestBody);

		case 'update':
			// Get all the form data for update
			const updateLocationSettings = context.getNodeParameter('locationSettings', itemIndex, {}) as any;
			const updateBusinessInfo = context.getNodeParameter('businessInfo', itemIndex, {}) as any;
			const updateContactInfo = context.getNodeParameter('contactInfo', itemIndex, {}) as any;
			const updateAdditionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as any;
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;

			// Get credentials for GHL API key
			const updateCredentials = await context.getCredentials('hlautomateApi');

			// Prepare the request body for update matching the create format
			const updateRequestBody = {
				ghl_api_key: updateCredentials.ghl_agency_key,
				loc_setting_allowDuplicateContact: updateLocationSettings.allowDuplicateContact || false,
				loc_setting_allowDuplicateOpportunity: updateLocationSettings.allowDuplicateOpportunity || false,
				loc_setting_allowFacebookNameMerge: updateLocationSettings.allowFacebookNameMerge || false,
				loc_setting_disableContactTimezone: updateLocationSettings.disableContactTimezone || false,
				loc_bname: updateBusinessInfo.name,
				locationId: locationId,
				loc_address: updateBusinessInfo.address,
				loc_city: updateBusinessInfo.city,
				loc_country: updateBusinessInfo.country,
				loc_state: updateBusinessInfo.state,
				loc_postalCode: updateBusinessInfo.postalCode,
				loc_website: updateBusinessInfo.website || '',
				loc_timezone: updateBusinessInfo.timezone,
				loc_firstName: updateContactInfo.firstName,
				loc_lastName: updateContactInfo.lastName,
				loc_email: updateContactInfo.email,
				loc_phone: updateContactInfo.phone,
				snapshot: updateAdditionalOptions.snapshot || '',
				customValues: updateAdditionalOptions.customValues ? JSON.parse(updateAdditionalOptions.customValues) : {}
			};

			return await makeAuthenticatedRequest(context, 'PUT', '/ghl', accessToken, updateRequestBody);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown location operation: ${operation}`);
	}
}

