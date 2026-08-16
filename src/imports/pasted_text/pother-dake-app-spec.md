Act as a Senior Software Architect, Senior UI/UX Designer, Product Manager, Cybersecurity Expert, and Full Stack Engineer to build my app

I want you to design and build a modern, production-ready ride-sharing platform similar to BlaBlaCar but focused on intercity bike and private vehicle ride sharing in Bangladesh.

Project Name: "Pother Dake"

Tagline: "where every journey find a friend"

The primary goal is:

If someone is already traveling from one city to another using their own bike or personal vehicle, they can post their trip. Other users traveling to the same destination can join that ride by paying a small contribution. This saves fuel cost for the driver and transportation cost for passengers.

The application must be scalable, secure, modern, and ready for commercial deployment.

===================================== TECH STACK
Frontend:

Next.js
React
TypeScript
Tailwind CSS
ShadCN UI
Framer Motion
Backend:

Node.js
Express.js
TypeScript
Database:

PostgreSQL
ORM:

Prisma
Authentication:

JWT
Refresh Token
Storage:

Cloudinary (photos)
AWS S3 (documents)
Maps:

Google Maps API
Google Directions API
Google Distance Matrix API
Live GPS Tracking
Notifications:

Firebase Cloud Messaging
Payment:

SSLCommerz
bKash
Nagad
Rocket
Realtime:

Socket.io
Deployment:

Docker
Nginx
CI/CD
===================================== APP TYPES
Passenger App

Driver App

Admin Dashboard

Moderator Dashboard

===================================== LOGIN & AUTHENTICATION
Users can register using:

• Mobile Number • Email

Verification: OTP Verification

User Verification:

Step 1 Upload National ID Card (Front & Back)

Step 2 Record a live face verification video

The system should compare:

NID Photo vs Live Face Video

using AI Face Matching.

Driver Verification:

Driver must submit:

• Driving License • National ID • Selfie Video • Vehicle Registration • Vehicle Photo

Admin manually approves drivers after verification.

Verification Status:

Pending

Approved

Rejected

Need More Information

===================================== USER ROLES
Passenger

Driver

Moderator

Manager

Admin

Super Admin

===================================== HOME SCREEN
Premium modern UI.

Search:

From

To

Date

Passengers

Search Button

Quick Options:

Tomorrow

This Weekend

Return Trip

Recent Searches

Popular Routes

===================================== TRIP POSTING (Driver)
Driver can create trip.

Required Fields:

Starting Point

Destination

Multiple Stop Points

Departure Date

Departure Time

Estimated Arrival Time

Vehicle Type

Bike

Car

Microbus

Seats Available

Helmet Available (Bike)

Luggage Allowed

Maximum Bag Weight

Smoking Allowed

Pets Allowed

Music Preference

AC / Non AC

Women Only Option

Price Per Seat

Pickup Radius

Drop Radius

Description

Cancellation Policy

Instant Booking

Manual Approval

Recurring Trip Option

===================================== PASSENGER SIDE
Passenger can see:

Driver Photo

Driver Name

Verified Badge

Rating

Reviews

Vehicle

Trip Route

Price

Available Seats

Departure Time

Estimated Arrival

Trip Duration

Pickup Point

Google Map Preview

Live Route

Passenger can:

Book Seat

Chat

Call Driver

Share Trip

Save Trip

Report Driver

Cancel Booking

===================================== REAL-TIME MAP
Google Maps Integration

Live GPS

Current Driver Location

ETA

Traffic

Navigation

Route Optimization

Location Sharing

===================================== BOOKING FLOW
Passenger requests booking

Driver receives notification

Driver accepts/rejects

Passenger pays

Booking confirmed

QR Code generated

Trip starts

Live Tracking

Trip ends

Both give ratings

===================================== PAYMENT SYSTEM
Support:

SSLCommerz

bKash

Nagad

Rocket

Wallet

Coupon

Promo Code

Referral Bonus

Driver Earnings

Platform Commission

Refund System

Partial Refund

Full Refund

===================================== RATINGS
5 Star Rating

Review

Safety Score

Cleanliness

Driving Skill

Communication

Punctuality

===================================== IN-APP CHAT
Realtime Messaging

Image Sharing

Location Sharing

Read Receipt

Typing Indicator

===================================== NOTIFICATIONS
Push Notification

SMS

Email

Trip Reminder

Payment Success

Booking Confirmation

Trip Cancelled

===================================== SAFETY FEATURES
Emergency SOS

Share Live Location

Emergency Contact

Trip Monitoring

Fake Account Detection

Duplicate Account Detection

AI Fraud Detection

Blacklist Users

Report User

Block User

Face Verification Before Ride

Device Fingerprinting

Login History

Suspicious Activity Detection

===================================== ADMIN DASHBOARD
Modern Analytics Dashboard.

Statistics:

Total Users

Verified Users

Drivers

Trips

Bookings

Cancelled Trips

Today's Revenue

Monthly Revenue

Net Profit

Commission

Active Drivers

Online Users

Charts

Heat Maps

Growth Graphs

===================================== USER MANAGEMENT
View Users

Suspend

Ban

Delete

Verify

Reset Password

View Documents

View Login History

View Ride History

===================================== DRIVER MANAGEMENT
Approve Drivers

Reject Drivers

Suspend Drivers

Vehicle Verification

License Verification

NID Verification

Documents

Ratings

Complaints

Blacklist

===================================== BOOKING MANAGEMENT
View All Bookings

Cancel Booking

Refund

Dispute Resolution

===================================== PAYMENT MANAGEMENT
Revenue

Commission

Withdraw Requests

Transaction History

Refunds

Wallet Management

===================================== REPORTS
Daily Report

Weekly Report

Monthly Report

Yearly Report

Revenue Report

Driver Performance

Trip Analytics

User Growth

Booking Analytics

===================================== COMPLAINT MANAGEMENT
User Complaints

Driver Complaints

Evidence Upload

Moderator Actions

Resolution Status

===================================== MODERATOR PANEL
Limited Permissions

Review Reports

Approve Posts

Suspend Accounts

Handle Complaints

Review Fraud

===================================== MANAGER PANEL
Manage Moderators

Manage Drivers

Business Reports

Financial Reports

Analytics

===================================== SUPER ADMIN
Everything

Role Management

Permission Management

System Settings

API Keys

Platform Commission

Feature Flags

Maintenance Mode

===================================== SETTINGS
Dark Mode

Light Mode

Language

Bangla

English

Notification Settings

Privacy Settings

===================================== AI FEATURES
AI Fake Account Detection

AI Face Matching

Spam Detection

Route Recommendation

Dynamic Pricing Suggestion

Demand Prediction

Fraud Detection

Driver Risk Score

Passenger Trust Score

===================================== EXTRA FEATURES
Referral Program

Promo Codes

Wallet

Ride History

Favorite Drivers

Favorite Routes

Ride Sharing Link

Trip Calendar

Invoice Download

PDF Receipt

Support Ticket

FAQ

Blog

Terms & Conditions

Privacy Policy

About

Contact

===================================== SECURITY
Rate Limiting

CSRF Protection

XSS Protection

SQL Injection Protection

Encrypted Documents

HTTPS

JWT Refresh

Audit Logs

Role Based Access

===================================== UI/UX
The application should look like a premium startup product.

Use modern glassmorphism.

Beautiful gradients.

Rounded corners.

Smooth animations.

Professional typography.

Responsive.

Dark Mode.

Minimal.

Apple-level UI quality.

===================================== DELIVERABLES
Generate the complete production-ready project including:

• Full UI Design • Responsive Design • Database Schema • ER Diagram • Prisma Models • API Structure • Authentication Flow • Folder Structure • Backend APIs • Frontend Pages • Admin Dashboard • Moderator Dashboard • Driver Dashboard • Passenger Dashboard • Complete source code • Documentation • Environment Variables • Docker Setup • Deployment Guide

Follow software engineering best practices, clean architecture, SOLID principles, reusable components, scalable code, and enterprise-level security.
add manager and moderator add or remove feature in admin panel ,who can approve or reject driver , handle chating or other thing but finalcial part is only for super admin. maybe add some finantial manager