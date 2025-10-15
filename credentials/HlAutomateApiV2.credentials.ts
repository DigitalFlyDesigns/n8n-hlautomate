/* eslint-disable n8n-nodes-base/cred-filename-against-convention */
import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class HlAutomateApiV2Api implements ICredentialType {
	name = 'hlautomateApiV2Api';
	displayName = 'HL Automate API V2 API';
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
				'Accept': 'application/json',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: 'https://api.hlautomate.com/v2',
			url: '/auth/login',
			method: 'POST',
			body: {
				email: '={{$credentials.email}}',
				password: '={{$credentials.password}}',
			},
		},
	};
}