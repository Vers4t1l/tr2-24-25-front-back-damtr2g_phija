import express from 'express'
import cors from 'cors'
import nodemailer from 'nodemailer'
import bcryptjs from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

//  IN-MEMORY STORAGE (Remplazar con base de datos)
const users = []
const verificationCodes = {}

//  EMAIL CONFIGURATION (Nodemailer)


// For Gmail: Use App Password (not your regular password)
// Enable 2FA: https://myaccount.google.com/security
// Create App Password: https://myaccount.google.com/apppasswords

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'pariskarr3@gmail.com',
    pass: process.env.EMAIL_PASS || 'clwl yhhy yjea yptl',
  },
})

// Test email connection
transporter.verify((error, success) => {
  if (error) {
    console.log('⚠️  Email service not configured. Using console logs instead.')
  } else {
    console.log('✅ Email service ready')
  }
})

//FUNCTIONS

/*
  Generate a 6-digit verification code
 */
function generateVerificationCode() {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

/**
 * Generate JWT token
 */
function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  )
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email, code) {
  const mailOptions = {
    from: `"ENGINY" <${process.env.EMAIL_USER || 'noreply@enginy.com'}>`,
    to: email,
    subject: '🔐 Verifica el teu correu electrònic - ENGINY',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #C41E3A 0%, #8B0000 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
          <h1 style="margin: 0; font-size: 32px;">ENGINY</h1>
          <p style="margin: 10px 0 0 0; font-size: 14px;">Gestió de Tallers Educatius</p>
        </div>
        
        <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
          <h2 style="color: #333; margin-top: 0;">Verifica el teu correu electrònic</h2>
          
          <p style="color: #666; line-height: 1.6;">
            Hola! Hem rebut una sol·licitud de registre amb aquest correu electrònic. 
            Per completar el teu registre, utilitza el codi de verificació següent:
          </p>
          
          <div style="background: white; border: 2px solid #C41E3A; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; color: #999; font-size: 12px;">Codi de verificació</p>
            <h1 style="margin: 10px 0 0 0; color: #C41E3A; font-size: 48px; letter-spacing: 5px; font-weight: bold;">
              ${code}
            </h1>
          </div>
          
          <p style="color: #999; font-size: 12px;">
            ⏰ Aquest codi expira en 15 minuts.
          </p>
          
          <p style="color: #999; font-size: 12px; margin-top: 20px;">
            Si no has sol·licitat aquest registre, ignora aquest missatge.
          </p>
        </div>
        
        <div style="background: #f0f0f0; padding: 20px; text-align: center; border-radius: 0 0 10px 10px; font-size: 12px; color: #999;">
          <p style="margin: 0;">© 2024 ENGINY - Consorci d'Educació</p>
        </div>
      </div>
    `,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`✅ Verification email sent to ${email}`)
    return true
  } catch (error) {
    console.error(`❌ Error sending email to ${email}:`, error.message)
    return false
  }
}

// ROUTES

/*
 POST /register
  Register a new user and send verification email
 */
app.post('/register', async (req, res) => {
  try {
    const { email, password, fullName, role, organizationName } = req.body

    // Validation
    if (!email || !password || !fullName || !role) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: email, password, fullName, role',
      })
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email)
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      })
    }

    // Generate verification code
    const verificationCode = generateVerificationCode()

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10)

    // Create user object
    const newUser = {
      id: `user-${Date.now()}`,
      email,
      password: hashedPassword,
      fullName,
      role,
      organizationName: organizationName || '',
      verified: false,
      createdAt: new Date().toISOString(),
    }

    // Store user
    users.push(newUser)

    // Store verification code
    verificationCodes[email] = {
      code: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    }

    // Send verification email
    await sendVerificationEmail(email, verificationCode)

    res.status(201).json({
      success: true,
      message: 'Registration successful. Verification email sent.',
      email,
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during registration',
    })
  }
})

/*
 POST /verify
  Verify email with code
 */
app.post('/verify', (req, res) => {
  try {
    const { email, code } = req.body

    // Validation
    if (!email || !code) {
      return res.status(400).json({
        success: false,
        message: 'Missing email or code',
      })
    }

    // Check if verification code exists
    const codeData = verificationCodes[email]
    if (!codeData) {
      return res.status(400).json({
        success: false,
        message: 'No verification code found for this email',
      })
    }

    // Check if code is expired
    if (new Date() > codeData.expiresAt) {
      delete verificationCodes[email]
      return res.status(400).json({
        success: false,
        message: 'Verification code expired',
      })
    }

    // Check if code is correct
    if (codeData.code !== code) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      })
    }

    // Mark user as verified
    const user = users.find(u => u.email === email)
    if (user) {
      user.verified = true
    }

    // Delete verification code
    delete verificationCodes[email]

    res.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    console.error('Verify error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during verification',
    })
  }
})
/*
  POST /resend-code
 Resend verification code
 */
app.post('/resend-code', async (req, res) => {
  try {
    const { email } = req.body

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required',
      })
    }

    // Check if user exists
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'User not found',
      })
    }

    // Generate new verification code
    const verificationCode = generateVerificationCode()

    // Store verification code
    verificationCodes[email] = {
      code: verificationCode,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000),
    }

    // Send verification email
    await sendVerificationEmail(email, verificationCode)

    res.json({
      success: true,
      message: 'Verification code resent',
    })
  } catch (error) {
    console.error('Resend code error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error while resending code',
    })
  }
})

/*
 POST /login
 Login user
 */
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Missing email or password',
      })
    }

    // Find user
    const user = users.find(u => u.email === email)
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Check if email is verified
    if (!user.verified) {
      return res.status(401).json({
        success: false,
        message: 'Email not verified. Please verify your email first.',
      })
    }

    // Check password
    const passwordMatch = await bcryptjs.compare(password, user.password)
    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      })
    }

    // Generate JWT token
    const token = generateToken(user)

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        organizationName: user.organizationName,
      },
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({
      success: false,
      message: 'Server error during login',
    })
  }
})

/*
 GET /health
 Health check endpoint
 */
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
  })
})

//ERROR HANDLING

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  })
})

//START SERVER

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`🚀 ENGINY Backend running on http://localhost:${PORT}`)
  console.log(`📧 Email service: ${process.env.EMAIL_USER ? '✅ Configured' : '⚠️  Not configured (using console logs)'}`)
  console.log(`🔐 JWT Secret: ${process.env.JWT_SECRET ? '✅ Configured' : '⚠️  Using default'}`)
})
