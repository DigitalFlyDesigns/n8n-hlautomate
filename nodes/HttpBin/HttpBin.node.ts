import {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	INodeExecutionData,
	INodePropertyOptions,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';
import { httpVerbFields, httpVerbOperations } from './HttpVerbDescription';

export class HttpBin implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'HttpBin',
		name: 'httpBin',
		icon: { light: 'file:httpbin.svg', dark: 'file:httpbin.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Interact with HttpBin API',
		defaults: {
			name: 'HttpBin',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		usableAsTool: true,
		credentials: [
			{
				name: 'httpbinApi',
				required: false,
			},
		],
		requestDefaults: {
			baseURL: 'https://httpbin.org',
			url: '',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		},
		/**
		 * In the properties array we have two mandatory options objects required
		 *
		 * [Resource & Operation]
		 *
		 * https://docs.n8n.io/integrations/creating-nodes/code/create-first-node/#resources-and-operations
		 *
		 * In our example, the operations are separated into their own file (HTTPVerbDescription.ts)
		 * to keep this class easy to read.
		 *
		 */
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'HTTP Verb',
						value: 'httpVerb',
					},
				],
				default: 'httpVerb',
			},

			...httpVerbOperations,
			...httpVerbFields,
		],
	};

	methods = {
		loadOptions: {
			// Method to dynamically load available triggers/endpoints
			async getAvailableTriggers(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// Fetch available endpoints from HttpBin API
					const response = await this.helpers.request({
						method: 'GET',
						url: 'https://httpbin.org/json',
						headers: {
							'Accept': 'application/json',
							'User-Agent': 'n8n-dynamic-options/1.0',
						},
					});

					// Create a base set of available endpoints
					const baseEndpoints = [
						{
							name: 'Status Check',
							value: 'status',
							description: 'Call /status/200 to check API availability',
						},
						{
							name: 'IP Information',
							value: 'ip',
							description: 'Call /ip to get current IP information',
						},
						{
							name: 'User Agent',
							value: 'user-agent',
							description: 'Call /user-agent to get user agent information',
						},
						{
							name: 'Headers Info',
							value: 'headers',
							description: 'Call /headers to get request headers',
						},
					];

					// Add dynamic endpoints based on API response (if available)
					if (response) {
						// Add timestamp-based dynamic option
						baseEndpoints.push({
							name: `Dynamic JSON (Updated: ${new Date().toLocaleTimeString()})`,
							value: 'json-dynamic',
							description: 'Call /JSON endpoint with dynamic timestamp',
						});

						// Add UUID-based dynamic option
						baseEndpoints.push({
							name: 'UUID Generator',
							value: 'uuid',
							description: 'Call /uuid to generate unique identifier',
						});

						// Add Base64 encoding option
						baseEndpoints.push({
							name: 'Base64 Encoder',
							value: 'base64',
							description: 'Call /base64 endpoint for encoding tests',
						});
					}

					// Sort options alphabetically by name
					return baseEndpoints.sort((a, b) => a.name.localeCompare(b.name));

				} catch (error) {
					// Fallback options if API call fails
					return [
						{
							name: 'Status Check (Fallback)',
							value: 'status',
							description: 'Call /status/200 to check API availability',
						},
						{
							name: 'Basic IP Info (Fallback)',
							value: 'ip',
							description: 'Call /ip endpoint (fallback mode)',
						},
					];
				}
			},

			// Method to dynamically load available HTTP methods
			async getAvailableHttpMethods(this: ILoadOptionsFunctions): Promise<INodePropertyOptions[]> {
				try {
					// You could fetch this from an API or configuration service
					// For demonstration, we'll create a dynamic list
					const currentTime = new Date();
					const hour = currentTime.getHours();

					// Base HTTP methods always available
					const methods: INodePropertyOptions[] = [
						{
							name: 'GET',
							value: 'GET',
							description: 'Standard GET request',
						},
						{
							name: 'POST',
							value: 'POST',
							description: 'Standard POST request',
						},
					];

					// Add time-based dynamic options (business hours)
					if (hour >= 9 && hour <= 17) {
						methods.push({
							name: 'PUT (Business Hours)',
							value: 'PUT',
							description: 'PUT request available during business hours',
						});
						methods.push({
							name: 'PATCH (Business Hours)',
							value: 'PATCH',
							description: 'PATCH request available during business hours',
						});
					} else {
						// After hours - add DELETE for cleanup tasks
						methods.push({
							name: 'DELETE (After Hours)',
							value: 'DELETE',
							description: 'DELETE request for after-hours cleanup',
						});
					}

					// Add a dynamic option with timestamp
					methods.push({
						name: `OPTIONS (Last updated: ${currentTime.toLocaleTimeString()})`,
						value: 'OPTIONS',
						description: 'OPTIONS request with dynamic timestamp',
					});

					return methods;

				} catch (error) {
					// Fallback methods if loading fails
					return [
						{
							name: 'GET (Fallback)',
							value: 'GET',
							description: 'GET request (fallback)',
						},
						{
							name: 'POST (Fallback)',
							value: 'POST',
							description: 'POST request (fallback)',
						},
					];
				}
			},
		},
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const operation = this.getNodeParameter('operation', 0) as string;

		// Handle test trigger operation with pre-execution API call
		if (operation === 'testTrigger') {
			const testMessage = this.getNodeParameter('testMessage', 0, 'This is a test execution with API call') as string;
			const includeTimestamp = this.getNodeParameter('includeTimestamp', 0, true) as boolean;
			const sampleDataCount = this.getNodeParameter('sampleDataCount', 0, 1) as number;
			const preExecutionEndpoint = this.getNodeParameter('preExecutionEndpoint', 0, 'status') as string;
			const httpMethodTest = this.getNodeParameter('httpMethodTest', 0, 'GET') as string;

			const returnData: INodeExecutionData[] = [];

			try {
				// Pre-execution API call based on user configuration
				this.logger.info(`Test Trigger: Making pre-execution API call to ${preExecutionEndpoint}...`);
				
				// Map endpoint selection to actual URLs
				const endpointMap: Record<string, string> = {
					status: '/status/200',
					ip: '/ip',
					'user-agent': '/user-agent',
					headers: '/headers',
					'json-dynamic': '/json',
					uuid: '/uuid',
					base64: '/base64/bzhiLW5vZGVzLXN0YXJ0ZXI=', // 'n8n-nodes-starter' encoded
				};

				const preExecutionResponse = await this.helpers.request({
					method: 'GET',
					url: `https://httpbin.org${endpointMap[preExecutionEndpoint]}`,
					headers: {
						'Accept': 'application/json',
						'User-Agent': 'n8n-test-trigger/1.0',
					},
				});

				// Secondary API call to get UUID for tracking
				const trackingResponse = await this.helpers.request({
					method: 'GET',
					url: 'https://httpbin.org/uuid',
					headers: {
						'Accept': 'application/json',
					},
				});

				this.logger.info('Test Trigger: Pre-execution API calls completed successfully');

				// Generate sample data based on count, incorporating API responses
				for (let i = 0; i < sampleDataCount; i++) {
					const sampleData: any = {
						testMessage,
						itemIndex: i + 1,
						totalItems: sampleDataCount,
						sampleId: Math.random().toString(36).substring(2, 15),
						status: 'success',
						triggerType: 'test-with-dynamic-options',
						dynamicConfiguration: {
							selectedEndpoint: preExecutionEndpoint,
							selectedHttpMethod: httpMethodTest,
							loadedDynamically: true,
							loadTimestamp: new Date().toISOString(),
						},
						preExecutionApi: {
							endpoint: preExecutionEndpoint,
							endpointUrl: endpointMap[preExecutionEndpoint],
							status: 'completed',
							response: preExecutionResponse,
							trackingId: trackingResponse?.uuid || 'tracking-unavailable',
							callSequence: [preExecutionEndpoint, 'uuid-generation'],
							proposedTestMethod: httpMethodTest,
						},
					};

					if (includeTimestamp) {
						sampleData.timestamp = new Date().toISOString();
						sampleData.unixTimestamp = Date.now();
						sampleData.preExecutionTimestamp = new Date(Date.now() - 2000).toISOString(); // 2 seconds before
					}

					// Add enhanced metadata including dynamic options info
					sampleData.metadata = {
						nodeType: 'HttpBin',
						version: '1.0',
						executionId: Math.random().toString(36).substring(2, 10),
						apiCallsPerformed: 2,
						executionFlow: `dynamic-options-load -> pre-api-call(${preExecutionEndpoint}) -> tracking-call -> data-generation`,
						selectedEndpoint: preExecutionEndpoint,
						selectedHttpMethod: httpMethodTest,
						dynamicOptionsEnabled: true,
						optionsLoadedAt: new Date().toISOString(),
					};

					// Process and enhance the API response data
					sampleData.processedData = {
						originalApiResponse: preExecutionResponse,
						trackingResponse: trackingResponse,
						enhancedWithTestData: true,
						processingNote: `Data enhanced after ${preExecutionEndpoint} API call`,
						apiCallTimestamp: new Date().toISOString(),
					};

					returnData.push({
						json: sampleData,
						pairedItem: i < items.length ? i : 0,
					});
				}

				this.logger.info(`Test Trigger: Generated ${sampleDataCount} items with ${preExecutionEndpoint} API data`);
				return [returnData];

			} catch (error) {
				this.logger.error('Test Trigger: Pre-execution API call failed', { error: error.message });
				
				// Generate fallback data if API calls fail
				const fallbackData: INodeExecutionData[] = [];
				for (let i = 0; i < sampleDataCount; i++) {
					const fallbackItem = {
						json: {
							testMessage,
							itemIndex: i + 1,
							totalItems: sampleDataCount,
							status: 'fallback',
							triggerType: 'test-with-dynamic-options-failed',
							dynamicConfiguration: {
								selectedEndpoint: preExecutionEndpoint,
								selectedHttpMethod: httpMethodTest,
								loadedDynamically: true,
								fallbackActivated: true,
							},
							error: {
								message: 'Pre-execution API call failed',
								details: error.message,
								fallbackGenerated: true,
								targetEndpoint: preExecutionEndpoint,
								targetMethod: httpMethodTest,
							},
							timestamp: includeTimestamp ? new Date().toISOString() : undefined,
						},
						pairedItem: i < items.length ? i : 0,
					};
					fallbackData.push(fallbackItem);
				}
				
				if (this.continueOnFail()) {
					return [fallbackData];
				} else {
					throw new NodeOperationError(this.getNode(), error, {
						message: 'Test trigger pre-execution API call failed',
					});
				}
			}
		}

		// For other operations, use the default routing behavior
		// This allows the existing GET and DELETE operations to work as before
		return [];
	}
}
