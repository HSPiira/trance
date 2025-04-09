// This is a test script to help debug the registration process
// You can run this with: npx ts-node src/app/api/auth/register/test.ts

import fetch from 'node-fetch';

async function testRegistration() {
    try {
        console.log('Testing user registration...');

        // Test case 1: Valid registration
        const validData = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            role: 'COUNSELOR'
        };

        console.log('Test case 1: Valid registration');
        // Log data without sensitive information
        console.log('Request data:', JSON.stringify({ ...validData, password: '***REDACTED***' }, null, 2));

        const response = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(validData),
        });

        const result = await response.json();
        console.log('Response status:', response.status);
        console.log('Response data:', JSON.stringify(result, null, 2));
        
        // Add assertions
        if (response.status !== 201 && response.status !== 200) {
            console.error('❌ Test case 1 failed: Expected status 201 or 200, got', response.status);
        } else {
            console.log('✅ Test case 1 passed!');
        }

        // Test case 2: Missing name field
        const invalidData = {
            email: 'test2@example.com',
            password: 'password123',
            role: 'COUNSELOR'
        };

        console.log('\nTest case 2: Missing name field');
        console.log('Request data:', JSON.stringify({ ...invalidData, password: '***REDACTED***' }, null, 2));

        const response2 = await fetch('http://localhost:3000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(invalidData),
        });

        const result2 = await response2.json();
        console.log('Response status:', response2.status);
        console.log('Response data:', JSON.stringify(result2, null, 2));
        
        // Add assertions for invalid test case
        if (response2.status !== 400) {
            console.error('❌ Test case 2 failed: Expected status 400, got', response2.status);
        } else {
            console.log('✅ Test case 2 passed!');
        }
 
    } catch (error) {
        console.error('Error testing registration:', error instanceof Error ? error.message : error);
        process.exit(1);
    }
}

testRegistration(); 