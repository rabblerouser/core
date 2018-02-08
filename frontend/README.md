# Rabble Rouser Core Frontend

Frontend for Rabble Rouser - A pluggable, extensible membership database for community organising

## Read this first
Rabble Rouser has a microservice architecture, so we provide a fully [Dockerised](https://www.docker.com/) development
environment. If you have no idea what that means, that's ok, just know that before running any of the commands in this
readme, you should first have run the `./go.sh` script from the root of this repository, as described in the top-level
README for this project.

## Automated testing workflow:

 1. `yarn test`
 2. Make your changes

The tests will re-run whenever you make a change.

### Manual testing workflow:

 1. Start the backend (see its README for how to do that)
 2. Open up a second terminal tab, run `./go.sh`, `cd frontend` again
 3. `yarn start`
 4. Make your changes
 5. Point your browser at `http://localhost:8000`

The page will auto-refresh whenever you make changes.

## Customising the look and feel

At the moment, this is done using environment variables when the assets are compiled. The table below describes the
available variables. At the moment, everything is optional, and a default theme will be provided if none is given.

| Variable                 | Description                                                           | Used in  |
|--------------------------|-----------------------------------------------------------------------|----------|
| `SIGNUP_TITLE`           | The title on the signup page                                          | frontend |
| `SIGNUP_SUBTITLE`        | The sub-title on the signup page                                      | frontend |
| `SIGNUP_FINISHED_MESSAGE`| The message shown after signing up                                    | frontend |
| `SIGNUP_HOME_PAGE_LINK`  | A link to your organisation's home page                               | frontend |
| `SIGNUP_STYLESHEETS`     | Custom stylesheet URLs for the signup page. (See below)               | frontend |
| `ADDRESS_ENABLED`        | If set, shows address fields in signup and admin page                 | frontend |

Stylesheets should be specified like a JSON array, e.g.:

`SIGNUP_STYLESHEETS='["/styles/signup.css", "https://example.com/custom-style.css", "https://fonts.com/my-font"]'`

If you do not specify any stylesheets, default ones are provided. If you do specify stylesheets, then the default ones
will not be present. So if you want the default ones *plus* a custom one, then you must list all of them.
