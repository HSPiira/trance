// This is a test script to help debug the registration process
// You can run this with: npx ts-node src/app/api/auth/register/test-client.ts

// This script simulates a client-side registration request
// It logs the request data that would be sent to the server

function simulateRegistrationRequest() {
    console.log('Simulating registration request...');

    // Test case 1: Valid registration
    const validData = {
        email: 'test@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        firstName: 'Test',
        lastName: 'User',
        phoneNumber: '1234567890',
        role: 'COUNSELOR',
        clientType: 'PRIMARY'
    };

    console.log('Test case 1: Valid registration');
    console.log('Request data:', JSON.stringify(validData, null, 2));
    console.log('This data should be sent to: POST /api/auth/register');

    // Test case 2: Missing firstName field
    const invalidData = {
        email: 'test2@example.com',
        password: 'password123',
        confirmPassword: 'password123',
        lastName: 'User',
        phoneNumber: '1234567890',
        role: 'COUNSELOR',
        clientType: 'PRIMARY'
    };

    console.log('\nTest case 2: Missing firstName field');
    console.log('Request data:', JSON.stringify(invalidData, null, 2));
    console.log('This data should be sent to: POST /api/auth/register');
    console.log('Expected validation error: [ { "code": "invalid_type", "expected": "string", "received": "undefined", "path": [ "firstName" ], "message": "Required" } ]');
}

simulateRegistrationRequest(); 