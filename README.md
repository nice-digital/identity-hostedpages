#  Nice Identity and Access Management (IdAM) Hosted Pages
  
> Contains the login/register/password reset etc pages deployed to Auth0. 
> Also contains the email templates users recieve to verify their email address, to reset their password, if their account has been blocked, and if their account has been compromised.
> Also blank templates for the configuration of the Auth0 tenants. The actual configuration values are inserted dynamically on deployment via Octopus deploy.
 
<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->
</details>

- [Stack](#stack)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->
</details>
  
## What is it?

### Pages

This repo contains a react app, created using create-react-app. It's located in the folder: /custom-pages/universal-login

That react app, builds a login page, password reset page and error page, to the location /custom-pages/pages

The whole custom-pages directory is then deployed to the Auth0 tenant.

### Emails

This repo contains email templates. They are located in the folder /custom-pages/emails

You can run npm start in the emails folder to generate the emails as html files with inline css. These get built inside the emails folder but are not tracked. If you want to make changes, change the template or styles files in the src folder, not the built files.

The version of node for the emails is purposefully lower than that for the pages, as it needs to work with gulp. The versions are pinned with volta so you don't need to worry about setting them yourself, and the build steps in team city reflect this.

### Other stuff

All the other files in this repo are mostly blank configuration templates deployed to Auth0 to configure the tenants. The secure configuration values are stored in Octopus Deploy and are inserted at deployment time.
  
## Stack

- [React](https://reactjs.org/) front-end
    - [Jest](https://facebook.github.io/jest/) for JavaScript tests

- [Gulp](https://gulpjs.com/) building emails
  
- [Configuration Deployment Command Line Client](https://auth0.com/docs/extensions/deploy-cli)
  - [Configuration Directory Structure](https://auth0.com/docs/extensions/deploy-cli/guides/import-export-directory-structure)