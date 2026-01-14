# Supabase Email Confirmation Setup Guide

## Current Status

The authentication system is now fully implemented for both web and mobile apps. However, Supabase requires email confirmation by default, which means users must verify their email before they can sign in.

## Option 1: Disable Email Confirmation (Development/Testing)

For development and testing purposes, you can disable email confirmation:

1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `xvtjcpwkrsoyrhhptdmc`
3. Navigate to **Authentication** → **Providers** → **Email**
4. Scroll down to **Confirm email** and toggle it **OFF**
5. Click **Save**

After this change, users can sign up and immediately sign in without email verification.

## Option 2: Enable Email Confirmation (Production)

For production, you should keep email confirmation enabled for security. Here's how to configure it properly:

### Step 1: Configure Email Templates

1. Go to **Authentication** → **Email Templates**
2. Customize the following templates:
   - **Confirm signup**: Sent when users sign up
   - **Magic Link**: For passwordless login (optional)
   - **Change Email Address**: When users update their email
   - **Reset Password**: For password recovery

### Step 2: Configure SMTP (Optional but Recommended)

By default, Supabase uses their email service, which has rate limits. For production, configure your own SMTP:

1. Go to **Project Settings** → **Auth**
2. Scroll to **SMTP Settings**
3. Enable **Custom SMTP**
4. Configure your SMTP provider (Gmail, SendGrid, AWS SES, etc.):
   - Host: e.g., `smtp.gmail.com`
   - Port: `587` (TLS) or `465` (SSL)
   - Username: Your email or API username
   - Password: Your email password or API key
   - Sender email: The "from" address
   - Sender name: Your app name (e.g., "Gidi Vibe Connect")

### Step 3: Update Email Templates

Customize the confirmation email template to match your brand:

```html
<h2>Welcome to Gidi Vibe Connect!</h2>
<p>Thanks for signing up! Click the link below to confirm your email address:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
<p>If you didn't create an account, you can safely ignore this email.</p>
```

## Testing Email Confirmation

### Web App
1. Go to http://localhost:8080
2. Click on the Profile tab
3. Click "Sign Up"
4. Enter your details
5. Check your email for the confirmation link
6. Click the confirmation link
7. Sign in with your credentials

### Mobile App
1. Launch the app in Expo
2. Navigate to the Profile screen
3. Tap "Sign Up"
4. Enter your details
5. Check your email for the confirmation link
6. Click the confirmation link (opens in browser)
7. Return to the app and sign in

## Current Implementation Details

### Web App (Profile.tsx)
- Sign up creates account with `full_name` in user metadata
- Toast notification prompts user to check email
- Sign in validates credentials
- Auth state managed with `onAuthStateChange` listener

### Mobile App (ProfileScreen.tsx)
- Sign up creates account with `full_name` in user metadata
- Alert prompts user to check email
- Sign in validates credentials
- Auth state managed with `onAuthStateChange` listener

## Environment Variables

Your Supabase configuration is in:
- Web: `src/lib/supabase.ts`
- Mobile: `apps/consumer-app/config/supabase.ts`

Both use:
- URL: `https://xvtjcpwkrsoyrhhptdmc.supabase.co`
- Anon Key: (configured in the files)

## Next Steps

1. Choose your email confirmation strategy (Option 1 or 2)
2. Configure the settings in Supabase Dashboard
3. Test the full signup flow
4. If using email confirmation, customize the email templates
5. Consider setting up custom SMTP for production

## Troubleshooting

### Users can't sign in after signing up
- Check if email confirmation is enabled
- Verify the user confirmed their email
- Check Supabase Dashboard → Authentication → Users to see user status

### Not receiving confirmation emails
- Check spam folder
- Verify SMTP settings if using custom SMTP
- Check Supabase email rate limits
- Test with a different email address

### Confirmation link doesn't work
- Check that the redirect URL is configured correctly
- Verify SSL certificates are valid
- Check browser console for errors
