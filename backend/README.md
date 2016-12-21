# rabblerouser-core-frontend

Backend for Rabble Rouser - A pluggable, extensible membership database for community organising

*Note: All commands mentioned below should be run from within this directory.*

## Automated testing workflow:

1. Make your changes
2. From the backend directory: `npm test`
3. Goto #1

## Manual testing workflow:

1. From the root directory: `npm run build && npm start`
2. Make your changes
3. Point your browser at `http://localhost:3000`
4. Goto #2

Note: Some specific files, such as the routes, require a full restart. In this case, start from step 1 again. This is
also the case if you happen to change any frontend code during this process.

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

## Docker

Docker is currently a work in progress. There is a Dockerfile here, which simply copies in all the files in this
directory, exposes a port, and starts the app when a container is run. It does not do any installing or compiling at the
moment - it assumes that this has already been done before the image is built.

Right now it's only for building production artefacts - there isn't a Dockerised development environment yet. That said,
there is a docker-compose file, which will run the app locally in a Docker container, and link it to a local Postgres
container. This is purely for sanity checking of the docker build process.

You can try it with `docker-compose up`.
