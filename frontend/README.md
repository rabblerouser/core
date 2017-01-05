# rabblerouser-core-frontend

Frontend for Rabble Rouser - A pluggable, extensible membership database for community organising

*Note: All commands mentioned below should be run from within this directory.*

## Standard setup, using the Vagrant VM

This is recommended for beginners. First follow the setup instructions in the root README, then use one of the
workflows below, depending on what you want to do:

### Automated testing workflow:

 1. Make your changes
 2. `npm run test-single`
 3. Goto #1

### Manual testing workflow:

 1. Start the backend (see its README for how to do that)
 2. Make your frontend changes
 3. `npm start`
 4. Point your browser at `http://localhost:8080`
 5. Kill the development server and goto #2

## Advanced setup for a faster development experience

File watching in a VM doesn't work very well with webpack or karma, so if you'd like a better dev experience, you can
try working on your host machine instead (i.e. not in a VM).

## Setup
 1. Install node
 2. `npm install` - Do this again, even if you already did it in the VM
 3. Add `--port 8000` to the end of the `start` command in the frontend `package.json` - the VM reserves port 8080

### Automated testing workflow:

 1. `npm run test`
 2. Make your changes

The tests will automatically re-run!

### Manual testing workflow:

 1. Start the backend (see its README for how to do that)
 2. `npm start`
 3. Point your browser at `http://localhost:8000`
 4. Make your changes

The page will automatically re-load with your changes!

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
