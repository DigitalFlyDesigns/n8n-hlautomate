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
import { contactOperations, locationOperations, userOperations, hlautomateFields, calendarAppointmentOperations } from './HlAutomateDescription';

export class HlAutomate implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HL Automate',
		name: 'hlAutomate',
		icon: 'file:hlautomate1.svg',
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

			...contactOperations,
			...locationOperations,
			...userOperations,
			...calendarAppointmentOperations,
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
					const apiVersion = (credentials.apiVersion as string) || 'v1';

					// Use existing authentication method
					const accessToken = await authenticateAndGetToken(this as any, credentials, apiVersion);

					// Fetch timezones from API (V1 endpoint is used for both)
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
		const apiVersion = (credentials.apiVersion as string) || 'v1';

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				// Authenticate and get access token
				const accessToken = await authenticateAndGetToken(this, credentials, apiVersion);

				let responseData: any;

				if (resource === 'contact') {
					responseData = await handleContactOperation(this, operation, i, accessToken, apiVersion);
				} else if (resource === 'location') {
					responseData = await handleLocationOperation(this, operation, i, accessToken, apiVersion);
				} else if (resource === 'user') {
					responseData = await handleUserOperation(this, operation, i, accessToken, apiVersion);
				} else if (resource === 'calendarAppointment') {
					responseData = await handleCalendarAppointmentOperation(this, operation, i, accessToken, apiVersion);
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

async function authenticateAndGetToken(context: IExecuteFunctions | ILoadOptionsFunctions, credentials: any, apiVersion: string): Promise<string> {
	const baseUrl = apiVersion === 'v2' ? 'https://api.hlautomate.com/v2' : 'https://api.hlautomate.com/v1';

	const authOptions: IHttpRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: `${baseUrl}/auth/login`,
		json: true,
		// Body is injected by the Credential's 'authenticate' property because we use requestWithAuthentication
	};

	try {
		// Use requestWithAuthentication to leverage the credential's configuration (automatically injecting email/password from body)
		const authResponse = await (context.helpers as any).requestWithAuthentication('hlautomateApi', authOptions);

		if (authResponse.tokens && authResponse.tokens.access && authResponse.tokens.access.token) {
			return authResponse.tokens.access.token;
		} else {
			throw new NodeOperationError(context.getNode(), 'Authentication failed: No access token received');
		}
	} catch (error) {
		throw new NodeOperationError(context.getNode(), `Authentication failed: ${error.message}`);
	}
}

async function makeAuthenticatedRequest(context: IExecuteFunctions, method: IHttpRequestMethods, endpoint: string, accessToken: string, apiVersion: string, body?: any): Promise<any> {
	const baseUrl = apiVersion === 'v2' ? 'https://api.hlautomate.com/v2' : 'https://api.hlautomate.com/v1';

	// Check if endpoint already includes query parameters and if we are adding more?
	// Not needed usually, but good to be safe.

	const options: IHttpRequestOptions = {
		method,
		url: `${baseUrl}${endpoint}`,
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

async function handleContactOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string, apiVersion: string): Promise<any> {
	const isV2 = apiVersion === 'v2';

	switch (operation) {
		case 'create':
			const createData = context.getNodeParameter('contactData', itemIndex) as any;
			return await makeAuthenticatedRequest(context, 'POST', '/ghlcontact', accessToken, apiVersion, createData);

		case 'get':
			// V1: Get by ID in URL. V2: Search by params.
			if (isV2) {
				// V2 Search
				const email = context.getNodeParameter('email', itemIndex, '') as string;
				const locationId = context.getNodeParameter('locationId', itemIndex, '') as string;
				const phone = context.getNodeParameter('phone', itemIndex, '') as string;

				// Allow fallback to contactId if provided? V2 spec says Get uses params.
				// We'll stick to spec logic.
				const params: string[] = [];
				if (locationId) params.push(`locationId=${encodeURIComponent(locationId)}`);
				if (email) params.push(`email=${encodeURIComponent(email)}`);
				if (phone) params.push(`phone=${encodeURIComponent(phone)}`);

				if (params.length === 0) {
					if (!locationId) throw new NodeOperationError(context.getNode(), 'For V2, Location ID is required to get a contact.');
				}

				const endpoint = `/ghlcontact?${params.join('&')}`;
				return await makeAuthenticatedRequest(context, 'GET', endpoint, accessToken, apiVersion);

			} else {
				// V1
				const getContactId = context.getNodeParameter('contactId', itemIndex) as string;
				return await makeAuthenticatedRequest(context, 'GET', `/ghlcontact/${getContactId}`, accessToken, apiVersion);
			}

		case 'update':
			const updateContactId = context.getNodeParameter('contactId', itemIndex) as string;
			const updateData = context.getNodeParameter('contactData', itemIndex) as any;

			if (isV2) {
				updateData.contact_id = updateContactId;
				return await makeAuthenticatedRequest(context, 'PUT', `/ghlcontact`, accessToken, apiVersion, updateData);
			} else {
				// V1
				return await makeAuthenticatedRequest(context, 'PUT', `/ghlcontact/${updateContactId}`, accessToken, apiVersion, updateData);
			}

		case 'delete':
			const deleteContactId = context.getNodeParameter('contactId', itemIndex) as string;

			if (isV2) {
				const locationId = context.getNodeParameter('locationId', itemIndex) as string;
				const requestBody = {
					contact_id: deleteContactId,
					locationId,
				};
				return await makeAuthenticatedRequest(context, 'DELETE', `/ghlcontact`, accessToken, apiVersion, requestBody);
			} else {
				// V1
				return await makeAuthenticatedRequest(context, 'DELETE', `/ghlcontact/${deleteContactId}`, accessToken, apiVersion);
			}

		case 'list':
			// V1 Only really
			return await makeAuthenticatedRequest(context, 'GET', '/ghlcontact', accessToken, apiVersion);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown contact operation: ${operation}`);
	}
}

async function handleLocationOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string, apiVersion: string): Promise<any> {
	const isV2 = apiVersion === 'v2';

	switch (operation) {
		case 'create':
			if (isV2) {
				const createData = context.getNodeParameter('locationData', itemIndex, {}) as any;
				return await makeAuthenticatedRequest(context, 'POST', '/ghl', accessToken, apiVersion, createData);
			} else {
				// V1
				const locationSettings = context.getNodeParameter('locationSettings', itemIndex, {}) as any;
				const businessInfo = context.getNodeParameter('businessInfo', itemIndex, {}) as any;
				const contactInfo = context.getNodeParameter('contactInfo', itemIndex, {}) as any;
				const additionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as any;
				const credentials = await context.getCredentials('hlautomateApi');

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
				return await makeAuthenticatedRequest(context, 'POST', '/ghl', accessToken, apiVersion, requestBody);
			}

		case 'update':
			// Both use PUT /ghl, but V1 sends ghl_api_key. V2 does not? V2 sends locationData.
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;

			if (isV2) {
				const updateData = context.getNodeParameter('locationData', itemIndex) as any;
				updateData.locationId = locationId;
				return await makeAuthenticatedRequest(context, 'PUT', `/ghl`, accessToken, apiVersion, updateData);
			} else {
				// V1
				const updateLocationSettings = context.getNodeParameter('locationSettings', itemIndex, {}) as any;
				const updateBusinessInfo = context.getNodeParameter('businessInfo', itemIndex, {}) as any;
				const updateContactInfo = context.getNodeParameter('contactInfo', itemIndex, {}) as any;
				const updateAdditionalOptions = context.getNodeParameter('additionalOptions', itemIndex, {}) as any;
				const updateCredentials = await context.getCredentials('hlautomateApi');

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
				return await makeAuthenticatedRequest(context, 'PUT', '/ghl', accessToken, apiVersion, updateRequestBody);
			}

		case 'get':
			// V1: GET /ghl with email in body? No, GET with body is non-standard but in code:
			// return await makeAuthenticatedRequest(context, 'GET', '/ghl', accessToken, reqBody);
			// V2: GET /ghl?locationId=...&email=...
			if (isV2) {
				const email = context.getNodeParameter('email', itemIndex, '') as string;
				const locId = context.getNodeParameter('locationId', itemIndex, '') as string;
				if (!locId) throw new NodeOperationError(context.getNode(), 'Location ID required for V2 Get');
				let params = `locationId=${encodeURIComponent(locId)}`;
				if (email) params += `&email=${encodeURIComponent(email)}`;
				return await makeAuthenticatedRequest(context, 'GET', `/ghl?${params}`, accessToken, apiVersion);
			} else {
				const emailAddress = context.getNodeParameter('email', itemIndex, '') as any;
				const reqBody = { email: emailAddress };
				return await makeAuthenticatedRequest(context, 'GET', '/ghl', accessToken, apiVersion, reqBody);
			}

		case 'delete':
			// V2 Only
			const delLocationId = context.getNodeParameter('locationId', itemIndex) as string;
			return await makeAuthenticatedRequest(context, 'DELETE', `/ghl/${delLocationId}`, accessToken, apiVersion);

		case 'list':
			// V2 Only
			return makeAuthenticatedRequest(context, 'GET', '/ghl', accessToken, apiVersion);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown location operation: ${operation}`);
	}
}

async function handleUserOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string, apiVersion: string): Promise<any> {
	const isV2 = apiVersion === 'v2';

	switch (operation) {
		case 'create':
			// Shared fields
			const firstName = context.getNodeParameter('firstName', itemIndex) as string;
			const lastName = context.getNodeParameter('lastName', itemIndex) as string;
			const email = context.getNodeParameter('email', itemIndex) as string;
			const password = context.getNodeParameter('password', itemIndex) as string;
			const type = context.getNodeParameter('type', itemIndex) as string;
			const role = context.getNodeParameter('role', itemIndex) as string;
			const locationIds = context.getNodeParameter('locationIds', itemIndex, '') as string;
			const phone = context.getNodeParameter('phone', itemIndex, '') as string;
			const permissions = context.getNodeParameter('permissions', itemIndex, {}) as any;
			const locationIdsArray = locationIds ? locationIds.split(',').map(id => id.trim()) : [];

			const requestBody: any = {
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

			if (!isV2) {
				// V1 requires API key
				const credentials = await context.getCredentials('hlautomateApi');
				requestBody.ghl_api_key = credentials.ghl_agency_key;
			}

			return await makeAuthenticatedRequest(context, 'POST', '/ghluser', accessToken, apiVersion, requestBody);

		case 'update':
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
			const updateLocationIdsArray = updateLocationIds ? updateLocationIds.split(',').map(id => id.trim()) : [];

			const updateRequestBody: any = {
				userId: updateUserId,
			};

			if (!isV2) {
				const updateCredentials = await context.getCredentials('hlautomateApi');
				updateRequestBody.ghl_api_key = updateCredentials.ghl_agency_key;
			}

			// (Same update logic for fields)
			if (updateFirstName) updateRequestBody.firstName = updateFirstName;
			if (updateLastName) updateRequestBody.lastName = updateLastName;
			if (updateEmail) updateRequestBody.email = updateEmail;
			if (updatePassword) updateRequestBody.password = updatePassword;
			if (updateType) updateRequestBody.type = updateType;
			if (updateRole) updateRequestBody.role = updateRole;
			if (updateLocationIds) updateRequestBody.locationIds = updateLocationIdsArray;
			if (updatePhone) updateRequestBody.phone = updatePhone;
			if (Object.keys(updatePermissions).length > 0) {
				updateRequestBody.permissions = {
					// ... (Include permissions copy if not already in V2)
					// Just copying V1/V2 shared structure
					adwordsReportingEnabled: updatePermissions.adwordsReportingEnabled || false,
					appointmentsEnabled: updatePermissions.appointmentsEnabled || false,
					assignedDataOnly: updatePermissions.assignedDataOnly || false,
					attributionsReportingEnabled: updatePermissions.attributionsReportingEnabled || false,
					bulkRequestsEnabled: updatePermissions.bulkRequestsEnabled || false,
					campaignsEnabled: updatePermissions.campaignsEnabled || false,
					campaignsReadOnly: updatePermissions.campaignsReadOnly || false,
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
					reviewsEnabled: permissions.reviewsEnabled || false,
					settingsEnabled: updatePermissions.settingsEnabled || false,
					tagsEnabled: updatePermissions.tagsEnabled || false,
					triggersEnabled: updatePermissions.triggersEnabled || false,
					websitesEnabled: updatePermissions.websitesEnabled || false,
					workflowsEnabled: updatePermissions.workflowsEnabled || false,
				};
			}

			return await makeAuthenticatedRequest(context, 'PUT', '/ghluser', accessToken, apiVersion, updateRequestBody);

		case 'get':
			// V2 Only
			const emailFilter = context.getNodeParameter('email', itemIndex, '') as string;
			const endpoint = `/ghluser${emailFilter ? '?email=' + encodeURIComponent(emailFilter) : ''}`;
			return await makeAuthenticatedRequest(context, 'GET', endpoint, accessToken, apiVersion);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown user operation: ${operation}`);
	}
}

async function handleCalendarAppointmentOperation(context: IExecuteFunctions, operation: string, itemIndex: number, accessToken: string, apiVersion: string): Promise<any> {
	const isV2 = apiVersion === 'v2';

	// Switch logic
	switch (operation) {
		case 'calendarBook':
			// V2 Only
			const locationIdBook = context.getNodeParameter('locationId', itemIndex) as string;
			const calendarIdBook = context.getNodeParameter('calendarId', itemIndex) as string;
			const selectedSlotBook = context.getNodeParameter('selectedSlot', itemIndex) as string;
			const endAt = context.getNodeParameter('endAt', itemIndex) as string;
			const titleBook = context.getNodeParameter('title', itemIndex) as string;

			const requestBodyBook = {
				locationId: locationIdBook,
				calendarId: calendarIdBook,
				selectedSlot: selectedSlotBook,
				endAt,
				title: titleBook,
			};
			return await makeAuthenticatedRequest(context, 'POST', '/ghlcalendarteam/appointments_block_date', accessToken, apiVersion, requestBodyBook);

		case 'create':
			if (isV2) {
				// V2 Create
				const title = context.getNodeParameter('title', itemIndex) as string;
				const calendarId = context.getNodeParameter('calendarId', itemIndex) as string;
				const locationId = context.getNodeParameter('locationId', itemIndex) as string;
				const contactId = context.getNodeParameter('contactId', itemIndex) as string;
				const startTime = context.getNodeParameter('startTime', itemIndex) as string;
				const endTime = context.getNodeParameter('endTime', itemIndex) as string;
				const description = context.getNodeParameter('description', itemIndex, '') as string;
				const address = context.getNodeParameter('address', itemIndex, '') as string;
				const appointmentStatus = context.getNodeParameter('appointmentStatus', itemIndex, '') as string;

				const requestBodyV2 = {
					title,
					calendarId,
					locationId,
					contactId,
					startTime,
					endTime,
					description,
					address,
					appointmentStatus
				};
				return await makeAuthenticatedRequest(context, 'POST', '/ghlcalendarteam/appointments', accessToken, apiVersion, requestBodyV2);
			} else {
				// V1 Create
				const calendarId = context.getNodeParameter('calendarId', itemIndex) as string;
				const locationId = context.getNodeParameter('locationId', itemIndex) as string;
				const selectedTimezone = context.getNodeParameter('selectedTimezone', itemIndex) as string;
				const selectedSlot = context.getNodeParameter('selectedSlot', itemIndex) as string;
				const credentials = await context.getCredentials('hlautomateApi');

				const requestBody = {
					ghl_api_key: credentials.ghl_agency_key,
					calendarId,
					locationId,
					selectedTimezone,
					selectedSlot,
				};
				return await makeAuthenticatedRequest(context, 'POST', '/ghlcalendarteam/appointments', accessToken, apiVersion, requestBody);
			}

		case 'update':
			// V1 vs V2 Update
			const locationId = context.getNodeParameter('locationId', itemIndex) as string;

			if (isV2) {
				const eventId = context.getNodeParameter('eventId', itemIndex) as string;
				const title = context.getNodeParameter('title', itemIndex, '') as string;
				const appointmentStatus = context.getNodeParameter('appointmentStatus', itemIndex, '') as string;
				const description = context.getNodeParameter('description', itemIndex, '') as string;
				const address = context.getNodeParameter('address', itemIndex, '') as string;
				const startTime = context.getNodeParameter('startTime', itemIndex, '') as string;
				const endTime = context.getNodeParameter('endTime', itemIndex, '') as string;

				const requestBodyV2: any = {
					eventId,
					locationId,
				};
				if (title) requestBodyV2.title = title;
				if (appointmentStatus) requestBodyV2.appointmentStatus = appointmentStatus;
				if (description) requestBodyV2.description = description;
				if (address) requestBodyV2.address = address;
				if (startTime) requestBodyV2.startTime = startTime;
				if (endTime) requestBodyV2.endTime = endTime;

				return await makeAuthenticatedRequest(context, 'PUT', '/ghlcalendarteam/appointments', accessToken, apiVersion, requestBodyV2);

			} else {
				// V1
				const appointmentId = context.getNodeParameter('appointmentId', itemIndex) as string;
				const status = context.getNodeParameter('status', itemIndex) as string;
				const credentials = await context.getCredentials('hlautomateApi');

				const requestBody = {
					ghl_api_key: credentials.ghl_agency_key,
					locationId,
					appointmentId,
					status,
				};
				return await makeAuthenticatedRequest(context, 'PUT', '/ghlcalendarteam/appointments', accessToken, apiVersion, requestBody);
			}

		case 'list':
			// V2 Only
			const locId = context.getNodeParameter('locationId', itemIndex) as string;
			const startTime = context.getNodeParameter('startTime', itemIndex) as string;
			const endTime = context.getNodeParameter('endTime', itemIndex) as string;
			const queryParams = `locationId=${encodeURIComponent(locId)}&startTime=${encodeURIComponent(startTime)}&endTime=${encodeURIComponent(endTime)}`;
			return await makeAuthenticatedRequest(context, 'GET', `/ghlcalendarteam/appointments?${queryParams}`, accessToken, apiVersion);

		default:
			throw new NodeOperationError(context.getNode(), `Unknown calendarAppointment operation: ${operation}`);
	}
}
