# Rabble Rouser Core Backend

Backend for Rabble Rouser - A pluggable, extensible membership database for community organising

## Read this first
Rabble Rouser has a microservice architecture, so we provide a fully [Dockerised](https://www.docker.com/) development
environment. If you have no idea what that means, that's ok, just know that before running any of the commands in this
readme, you should first have run the `./go.sh` script from the root of this repository, as described in the top-level
README for this project.

## Automated testing workflow:

1. **From the backend directory**: `npm test -- --watch`
2. Make your changes

The tests will re-run whenever you make a change.

## Manual testing workflow:

1. **From the root directory**: `npm run build`
2. **From the backend directory**: `npm run dev`
3. Make your changes
4. Point your browser at `http://localhost:3000`

The server will auto-restart whenever you make backend changes. If you change any frontend code during this process,
you'll need to `npm run build` again.

## Email configuration

By default emails are turned off. You can turn it on and configure it using these environment variables:

| Variable                | Description                                    |
|-------------------------|------------------------------------------------|
| `SEND_EMAILS`           | Set to 'true' to turn emails on                |
| `EMAIL_TRANSPORTER`     | Either 'gmail' or 'mailgun'                    |
| `EMAIL_USERNAME`        | See below                                      |
| `EMAIL_PASSWORD`        | See below                                      |
| `EMAIL_FROM`            | The 'from' field of emails that are sent       |
| `EMAIL_REPLY_TO`        | The 'reply to' field of emails that are sent   |
| `EMAIL_WELCOME_SUBJECT` | The subject line of the initial welcome emails |
| `EMAIL_WELCOME_BODY`    | The body of initial welcome emails             |

### Gmail

1. Create an [Application Password](https://www.google.com/settings/security/lesssecureapps) through your Google Account
(Go [here](https://security.google.com/settings/security/apppasswords) if you have 2 factor Authentication enabled)
2. Set `EMAIL_USERNAME` to your email address
3. Set `EMAIL_PASSWORD` to the password generated in the step 1

### MailGun

1. Go to your [control panel](https://mailgun.com/cp)
2. Set `EMAIL_USERNAME` to the Default SMTP login from the link above
3. Set `EMAIL_PASSWORD` to the Default Password from the link above
