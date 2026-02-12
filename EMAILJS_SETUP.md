# EmailJS Setup Guide for Ace of Braids

This guide will help you set up EmailJS to send booking confirmation emails automatically.

## Step 1: Create EmailJS Account

1. Go to https://www.emailjs.com
2. Sign up for a free account
3. Verify your email

## Step 2: Create Email Service

1. In EmailJS dashboard, go to **Email Services**
2. Click **Add Service**
3. Choose your email provider:
   - **Gmail** (recommended - easiest)
   - **Outlook**
   - **Yahoo**
   - **Custom SMTP**

### For Gmail:
- Select "Gmail"
- Click "Connect Account"
- Sign in with your email
- Allow access
- Copy the **Service ID** (looks like `service_xxxxxxx`)

## Step 3: Create Email Templates

1. Go to **Email Templates**
2. Click **Create New Template**

### Template 1: Admin Notification (New Booking Alert)

**Template Name:** `booking_admin_notification`

**Template ID:** `booking_admin_notification`

**Subject:** `New Booking Request - {{client_name}}`

**Body:**
```
Hello,

You have received a new booking request!

CLIENT DETAILS:
Name: {{client_name}}
Email: {{client_email}}
Phone: {{client_phone}}

APPOINTMENT DETAILS:
Service: {{service}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Deposit: {{deposit}}

NOTES:
{{notes}}

Please confirm this booking as soon as possible.

Best regards,
Ace of Braids Booking System
```

### Template 2: Customer Confirmation

**Template Name:** `booking_customer_confirmation`

**Template ID:** `booking_customer_confirmation`

**Subject:** `Booking Confirmation - Ace of Braids`

**Body:**
```
Hi {{client_name}},

Thank you for booking with Ace of Braids! Your appointment has been confirmed.

APPOINTMENT DETAILS:
Service: {{service}}
Date: {{appointment_date}}
Time: {{appointment_time}}
Deposit: £{{deposit}}

WHAT TO EXPECT:
- Please arrive 10 minutes early
- Bring your hair freshly washed and product-free
- Hair must be at least 4 inches long
- Extensions are not included (check service description)

IMPORTANT POLICIES:
- You may cancel or reschedule up to 48 hours before your appointment
- If you're 15 minutes late without notice, a £10 charge applies
- The deposit (£25) is non-refundable

LOCATION:
GracedBeauty
Adelaide Terrace
Benwell, NE4 9JN

If you have any questions, please don't hesitate to contact us!

Best regards,
Ace of Braids
```

## Step 4: Get Your Credentials

1. Go to **Account > API Keys**
2. Copy your **Public Key** (starts with `...`)

## Step 5: Update script.js

Open `script.js` and update these lines (at the top):

```javascript
const EMAILJS_PUBLIC_KEY = 'YOUR_PUBLIC_KEY'; // Paste your public key here
const EMAILJS_SERVICE_ID = 'service_xxxxxxx'; // Paste your service ID here
const EMAILJS_TEMPLATE_ID = 'booking_admin_notification'; // Or use a single template
```

**Example:**
```javascript
const EMAILJS_PUBLIC_KEY = 'pk_b8e9f3d4c5e6a7f8g9h0i1j2k3l4m5n6';
const EMAILJS_SERVICE_ID = 'service_abc123def456';
const EMAILJS_TEMPLATE_ID = 'booking_admin_notification';
```

## Step 6: Update Email Addresses

In `script.js`, find the `sendBookingEmails()` function and replace:
- `'aceofbraids@example.com'` with your actual business email address

Example:
```javascript
to_email: 'hello@aceofbraids.com', // Your business email
```

## Step 7: Test It!

1. Refresh your website
2. Fill out the booking form
3. Submit
4. Check your email inbox for the confirmation

## Troubleshooting

### Emails not sending?

1. **Check the browser Console** (F12 > Console tab)
   - Look for error messages
   - They'll tell you what's wrong

2. **Verify API credentials**
   - Make sure Public Key, Service ID, and Template ID are correct
   - No spaces or typos

3. **Check Gmail/Outlook**
   - If using Gmail, make sure you allowed access
   - Check spam/junk folder

4. **EmailJS Free Tier Limits**
   - Free plan: 200 emails/month
   - Upgrade if needed

### Still having issues?

Check EmailJS documentation: https://www.emailjs.com/docs/

## Upgrading EmailJS

- **Free Plan:** 200 emails/month
- **Pro Plan:** Unlimited emails

Upgrade in your EmailJS account settings when needed.

---

**Need help?** Check your browser console (F12) for error messages!
