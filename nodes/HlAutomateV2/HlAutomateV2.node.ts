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

// Set the API base URL once and use everywhere
const HLAUTOMATE_API_BASE_URL = 'https://api.hlautomate.com/v2';
const HLAUTOMATE_API_BASE_URL_V1 = 'https://api.hlautomate.com/v1';

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
					{
						name: 'Location',
						value: 'location',
					},
					{
						name: 'User',
						value: 'user',
					},
					{
						name: 'Calendar Appointment',
						value: 'calendarAppointment',
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
						   url: `${HLAUTOMATE_API_BASE_URL_V1}/ghl/timezones`,
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
		   url: `${HLAUTOMATE_API_BASE_URL}/auth/login`,
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
		   url: `${HLAUTOMATE_API_BASE_URL}${endpoint}`,
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
	switch (operation) {
		case 'calendarBook': {
			// Get all the form data
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			const calendarId = context.getNodeParameter('calendarId', itemIndex) as string;
			const selectedSlot = context.getNodeParameter('selectedSlot', itemIndex) as string;
			const endAt = context.getNodeParameter('endAt', itemIndex) as string;
			const title = context.getNodeParameter('title', itemIndex) as string;

			// Prepare the request body
			const requestBody = {
				locationId,
				calendarId,
				selectedSlot,
				endAt,
				title,
			};

			// According to the memory, calendar operations use the '/ghlcalendarteam/' endpoint prefix
			return await makeAuthenticatedRequest(context, 'POST', '/ghlcalendarteam/appointments_block_date', accessToken, requestBody);
		}
		
		case 'create': {
			// Get all the form data for create
			const title = context.getNodeParameter('title', itemIndex) as string;
			const meetingLocationType = context.getNodeParameter('meetingLocationType', itemIndex, '') as string;
			const meetingLocationId = context.getNodeParameter('meetingLocationId', itemIndex, '') as string;
			const overrideLocationConfig = context.getNodeParameter('overrideLocationConfig', itemIndex, false) as boolean;
			const appointmentStatus = context.getNodeParameter('appointmentStatus', itemIndex, '') as string;
			const assignedUserId = context.getNodeParameter('assignedUserId', itemIndex, '') as string;
			const description = context.getNodeParameter('description', itemIndex, '') as string;
			const address = context.getNodeParameter('address', itemIndex, '') as string;
			const ignoreDateRange = context.getNodeParameter('ignoreDateRange', itemIndex, false) as boolean;
			const toNotify = context.getNodeParameter('toNotify', itemIndex, false) as boolean;
			const ignoreFreeSlotValidation = context.getNodeParameter('ignoreFreeSlotValidation', itemIndex, false) as boolean;
			const rrule = context.getNodeParameter('rrule', itemIndex, '') as string;
			const calendarId = context.getNodeParameter('calendarId', itemIndex) as string;
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			const contactId = context.getNodeParameter('contactId', itemIndex) as string;
			const startTime = context.getNodeParameter('startTime', itemIndex) as string;
			const endTime = context.getNodeParameter('endTime', itemIndex) as string;

			// Prepare the request body
			const requestBody: any = {
				title,
				calendarId,
				locationId,
				contactId,
				startTime,
				endTime,
			};

			// Add optional fields if they have values
			if (meetingLocationType) requestBody.meetingLocationType = meetingLocationType;
			if (meetingLocationId) requestBody.meetingLocationId = meetingLocationId;
			if (overrideLocationConfig) requestBody.overrideLocationConfig = overrideLocationConfig;
			if (appointmentStatus) requestBody.appointmentStatus = appointmentStatus;
			if (assignedUserId) requestBody.assignedUserId = assignedUserId;
			if (description) requestBody.description = description;
			if (address) requestBody.address = address;
			if (ignoreDateRange) requestBody.ignoreDateRange = ignoreDateRange;
			if (toNotify) requestBody.toNotify = toNotify;
			if (ignoreFreeSlotValidation) requestBody.ignoreFreeSlotValidation = ignoreFreeSlotValidation;
			if (rrule) requestBody.rrule = rrule;

			// According to the memory, calendar operations use the '/ghlcalendarteam/' endpoint prefix
			return await makeAuthenticatedRequest(context, 'POST', '/ghlcalendarteam/appointments', accessToken, requestBody);
		}
		
		case 'update': {
			// Get all the form data for update
			const eventId = context.getNodeParameter('eventId', itemIndex) as string;
			const title = context.getNodeParameter('title', itemIndex, '') as string;
			const meetingLocationType = context.getNodeParameter('meetingLocationType', itemIndex, '') as string;
			const meetingLocationId = context.getNodeParameter('meetingLocationId', itemIndex, '') as string;
			const overrideLocationConfig = context.getNodeParameter('overrideLocationConfig', itemIndex, false) as boolean;
			const appointmentStatus = context.getNodeParameter('appointmentStatus', itemIndex, '') as string;
			const assignedUserId = context.getNodeParameter('assignedUserId', itemIndex, '') as string;
			const description = context.getNodeParameter('description', itemIndex, '') as string;
			const address = context.getNodeParameter('address', itemIndex, '') as string;
			const ignoreDateRange = context.getNodeParameter('ignoreDateRange', itemIndex, false) as boolean;
			const toNotify = context.getNodeParameter('toNotify', itemIndex, false) as boolean;
			const ignoreFreeSlotValidation = context.getNodeParameter('ignoreFreeSlotValidation', itemIndex, false) as boolean;
			const rrule = context.getNodeParameter('rrule', itemIndex, '') as string;
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			const startTime = context.getNodeParameter('startTime', itemIndex, '') as string;
			const endTime = context.getNodeParameter('endTime', itemIndex, '') as string;

			// Prepare the request body
			const requestBody: any = {
				eventId,
				locationId,
			};

			// Add optional fields if they have values
			if (title) requestBody.title = title;
			if (meetingLocationType) requestBody.meetingLocationType = meetingLocationType;
			if (meetingLocationId) requestBody.meetingLocationId = meetingLocationId;
			if (overrideLocationConfig) requestBody.overrideLocationConfig = overrideLocationConfig;
			if (appointmentStatus) requestBody.appointmentStatus = appointmentStatus;
			if (assignedUserId) requestBody.assignedUserId = assignedUserId;
			if (description) requestBody.description = description;
			if (address) requestBody.address = address;
			if (ignoreDateRange) requestBody.ignoreDateRange = ignoreDateRange;
			if (toNotify) requestBody.toNotify = toNotify;
			if (ignoreFreeSlotValidation) requestBody.ignoreFreeSlotValidation = ignoreFreeSlotValidation;
			if (rrule) requestBody.rrule = rrule;
			if (startTime) requestBody.startTime = startTime;
			if (endTime) requestBody.endTime = endTime;

			// According to the memory, calendar operations use the '/ghlcalendarteam/' endpoint prefix
			return await makeAuthenticatedRequest(context, 'PUT', '/ghlcalendarteam/appointments', accessToken, requestBody);
		}
		
		case 'list': {
			// Get the required parameters for list operation
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			const startTime = context.getNodeParameter('startTime', itemIndex) as string;
			const endTime = context.getNodeParameter('endTime', itemIndex) as string;

			// Build query parameters
			const queryParams = `locationId=${encodeURIComponent(locationId)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;

			// According to the memory, calendar operations use the '/ghlcalendarteam/' endpoint prefix
			const endpoint = `/ghlcalendarteam/appointments?${queryParams}`;
			return await makeAuthenticatedRequest(context, 'GET', endpoint, accessToken);
		}

		default:
			throw new NodeOperationError(context.getNode(), `Unknown calendar appointment operation: ${operation}`);
	}
};

async function handleUserOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {
    switch (operation) {
        case 'create':
            // Get all the form data
            const firstName = context.getNodeParameter('firstName', itemIndex) as string;
            const lastName = context.getNodeParameter('lastName', itemIndex) as string;
            const email = context.getNodeParameter('email', itemIndex) as string;
            const password = context.getNodeParameter('password', itemIndex) as string;
            const type = context.getNodeParameter('type', itemIndex) as string;
            const role = context.getNodeParameter('role', itemIndex) as string;
            const locationIds = context.getNodeParameter('locationIds', itemIndex, '') as string;
            const phone = context.getNodeParameter('phone', itemIndex, '') as string;
            const permissions = context.getNodeParameter('permissions', itemIndex, {}) as any;

            // Convert locationIds from comma-separated string to array
            const locationIdsArray = locationIds ? locationIds.split(',').map(id => id.trim()) : [];

            // Prepare the request body
            const requestBody = {
                firstName,
                lastName,
                email,
                password,
                type,
                role,
                locationIds: locationIdsArray,
                phone,
                permissions: {
                    adwordsReportingEnabled: permissions.adwordsReportingEnabled || false,
                    appointmentsEnabled: permissions.appointmentsEnabled || false,
                    assignedDataOnly: permissions.assignedDataOnly || false,
                    attributionsReportingEnabled: permissions.attributionsReportingEnabled || false,
                    bulkRequestsEnabled: permissions.bulkRequestsEnabled || false,
                    phoneCallEnabled: permissions.phoneCallEnabled || false,
                    contactsEnabled: permissions.contactsEnabled || false,
                    conversationsEnabled: permissions.conversationsEnabled || false,
                    dashboardStatsEnabled: permissions.dashboardStatsEnabled || false,
                    facebookAdsReportingEnabled: permissions.facebookAdsReportingEnabled || false,
                    funnelsEnabled: permissions.funnelsEnabled || false,
                    leadValueEnabled: permissions.leadValueEnabled || false,
                    marketingEnabled: permissions.marketingEnabled || false,
                    membershipEnabled: permissions.membershipEnabled || false,
                    onlineListingsEnabled: permissions.onlineListingsEnabled || false,
                    opportunitiesEnabled: permissions.opportunitiesEnabled || false,
                    reviewsEnabled: permissions.reviewsEnabled || false,
                    settingsEnabled: permissions.settingsEnabled || false,
                    tagsEnabled: permissions.tagsEnabled || false,
                    triggersEnabled: permissions.triggersEnabled || false,
                    websitesEnabled: permissions.websitesEnabled || false,
                    workflowsEnabled: permissions.workflowsEnabled || false,
                }
            };

            return await makeAuthenticatedRequest(context, 'POST', '/ghluser', accessToken, requestBody);

        case 'get': {
            // For get we allow email as optional filter
            const email = context.getNodeParameter('email', itemIndex, '') as string;

            const params: string[] = [];
            if (email) params.push(`email=${encodeURIComponent(email)}`);

            const endpoint = `/ghluser${params.length > 0 ? '?' + params.join('&') : ''}`;
            return await makeAuthenticatedRequest(context, 'GET', endpoint, accessToken);
        }

        case 'update':
            // Get all the form data for update
            const updateUserId = context.getNodeParameter('userId', itemIndex) as string;
            const updateFirstName = context.getNodeParameter('firstName', itemIndex, '') as string;
            const updateLastName = context.getNodeParameter('lastName', itemIndex, '') as string;
            const updateEmail = context.getNodeParameter('email', itemIndex, '') as string;
            const updatePassword = context.getNodeParameter('password', itemIndex, '') as string;
            const updateType = context.getNodeParameter('type', itemIndex, '') as string;
            const updateRole = context.getNodeParameter('role', itemIndex, '') as string;
            const updateLocationIds = context.getNodeParameter('locationIds', itemIndex, '') as string;
            const updatePhone = context.getNodeParameter('phone', itemIndex, '') as string;
            const updatePermissions = context.getNodeParameter('permissions', itemIndex, {}) as any;

            // Convert locationIds from comma-separated string to array
            const updateLocationIdsArray = updateLocationIds ? updateLocationIds.split(',').map(id => id.trim()) : [];

            // Prepare the request body for update
            const updateRequestBody: any = {
                userId: updateUserId,
            };

            // Only include fields that have values (for partial updates)
            if (updateFirstName) updateRequestBody.firstName = updateFirstName;
            if (updateLastName) updateRequestBody.lastName = updateLastName;
            if (updateEmail) updateRequestBody.email = updateEmail;
            if (updatePassword) updateRequestBody.password = updatePassword;
            if (updateType) updateRequestBody.type = updateType;
            if (updateRole) updateRequestBody.role = updateRole;
            if (updateLocationIds) updateRequestBody.locationIds = updateLocationIdsArray;
            if (updatePhone) updateRequestBody.phone = updatePhone;

            // Add permissions if any are provided
            if (Object.keys(updatePermissions).length > 0) {
                updateRequestBody.permissions = {
                    adwordsReportingEnabled: updatePermissions.adwordsReportingEnabled || false,
                    appointmentsEnabled: updatePermissions.appointmentsEnabled || false,
                    assignedDataOnly: updatePermissions.assignedDataOnly || false,
                    attributionsReportingEnabled: updatePermissions.attributionsReportingEnabled || false,
                    bulkRequestsEnabled: updatePermissions.bulkRequestsEnabled || false,
                    phoneCallEnabled: updatePermissions.phoneCallEnabled || false,
                    contactsEnabled: updatePermissions.contactsEnabled || false,
                    conversationsEnabled: updatePermissions.conversationsEnabled || false,
                    dashboardStatsEnabled: updatePermissions.dashboardStatsEnabled || false,
                    facebookAdsReportingEnabled: updatePermissions.facebookAdsReportingEnabled || false,
                    funnelsEnabled: updatePermissions.funnelsEnabled || false,
                    leadValueEnabled: updatePermissions.leadValueEnabled || false,
                    marketingEnabled: updatePermissions.marketingEnabled || false,
                    membershipEnabled: updatePermissions.membershipEnabled || false,
                    onlineListingsEnabled: updatePermissions.onlineListingsEnabled || false,
                    opportunitiesEnabled: updatePermissions.opportunitiesEnabled || false,
                    reviewsEnabled: updatePermissions.reviewsEnabled || false,
                    settingsEnabled: updatePermissions.settingsEnabled || false,
                    tagsEnabled: updatePermissions.tagsEnabled || false,
                    triggersEnabled: updatePermissions.triggersEnabled || false,
                    websitesEnabled: updatePermissions.websitesEnabled || false,
                    workflowsEnabled: updatePermissions.workflowsEnabled || false,
                };
            }

            return await makeAuthenticatedRequest(context, 'PUT', '/ghluser', accessToken, updateRequestBody);

        default:
            throw new NodeOperationError(context.getNode(), `Unknown user operation: ${operation}`);
    }
};

async function handleLocationOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string): Promise<any> {
	switch (operation) {
		case 'create':
			const createData = context.getNodeParameter('locationData', itemIndex) as any;
			return await makeAuthenticatedRequest(context, 'POST', '/ghl', accessToken, createData);

		case 'get': {
			// For get we require locationId and allow email as optional filter
			const email = context.getNodeParameter('email', itemIndex, '') as string;
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;

			if (!locationId) {
				throw new NodeOperationError(context.getNode(), 'locationId is required for get location');
			}

			const params: string[] = [];
			if (email) params.push(`email=${encodeURIComponent(email)}`);
			params.push(`locationId=${encodeURIComponent(locationId)}`);

			const endpoint = `/ghl?${params.join('&')}`;
			return await makeAuthenticatedRequest(context, 'GET', endpoint, accessToken);
		}

		case 'update': {
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			const updateData = context.getNodeParameter('locationData', itemIndex) as any;
			updateData.locationId = locationId;
			return await makeAuthenticatedRequest(context, 'PUT', `/ghl`, accessToken, updateData);
		}

		case 'delete': {
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;
			return await makeAuthenticatedRequest(context, 'DELETE', `/ghl/${locationId}`, accessToken);
		}

		case 'list':
			return await makeAuthenticatedRequest(context, 'GET', '/ghl', accessToken);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown location operation: ${operation}`);
	}
}

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

		// case 'list':
		// 	return await makeAuthenticatedRequest(context, 'GET', '/ghlcontact', accessToken);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown contact operation: ${operation}`);
	}
};