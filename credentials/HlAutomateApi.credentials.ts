import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HlAutomateApi implements ICredentialType {
	name = 'hlautomateApi';
	displayName = 'HL Automate API';
	documentationUrl = 'https://hlautomate.com';
	properties: INodeProperties[] = [
		{
			displayName: 'Email',
			name: 'email',
			type: 'string',
			default: '',
			placeholder: 'user@example.com',
			required: true,
		},
		{
			displayName: 'Password',
			name: 'password',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
		},
		{
			displayName: 'Agency API KEY',
			name: 'ghl_agency_key',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
			required: true,
			description: 'Your GoHighLevel Agency API Key',
		},
	];

	// Nodes will handle the actual authentication by:
	// 1. Making POST request to /auth/login with email/password
	// 2. Extracting tokens.access.token from response
	// 3. Using that token in Authorization header for subsequent requests
	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'Content-Type': 'application/json',
			},
		},
	};

	// Test the credential by attempting to login
	// This will verify email/password work and return the token structure
	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.hlautomate.com/v1',
			url: '/auth/login',
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: {
				email: '={{$credentials.email}}',
				password: '={{$credentials.password}}',
			},
		},
	};
}
