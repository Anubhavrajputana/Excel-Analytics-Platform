import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const requiredEnvVars = [
  'PORT',
  'MONGODB_URI',
  'JWT_SECRET',
  'OPENAI_API_KEY'
];

const optionalEnvVars = [
  'NODE_ENV',
  'EMAIL_HOST',
  'EMAIL_PORT',
  'EMAIL_USER',
  'EMAIL_PASS',
  'EMAIL_FROM',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'FRONTEND_URL'
];

export const validateEnv = () => {
  const missing = [];
  
  // Check required variables
  requiredEnvVars.forEach(envVar => {
    if (!process.env[envVar]) {
      missing.push(envVar);
    }
  });
  
  if (missing.length > 0) {
    console.error('❌ Missing required environment variables:');
    missing.forEach(envVar => {
      console.error(`   - ${envVar}`);
    });
    console.error('\nPlease check your .env file and ensure all required variables are set.');
    console.error('Copy .env.example to .env and fill in your values:');
    console.error('   cp .env.example .env');
    process.exit(1);
  }
  
  // Log configuration status
  console.log('✅ Environment variables validated');
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   Port: ${process.env.PORT || 5000}`);
  console.log(`   MongoDB: ${process.env.MONGODB_URI ? 'Configured' : 'Not configured'}`);
  console.log(`   Email: ${process.env.EMAIL_USER ? 'Configured' : 'Not configured'}`);
  console.log(`   OpenAI: ${process.env.OPENAI_API_KEY ? 'Configured' : 'Not configured'}`);
};

export default validateEnv;
