#  Nice Identity and Access Management (IdAM) Hosted Pages
  
> Contains the login/register/password reset etc pages deployed to Auth0. 
> Also blank templates for the configuration of the Auth0 tenants. The actual configuration values are inserted dynamically on deployment via Octopus deploy.
 
<details>
<summary><strong>Table of contents</strong></summary>
<!-- START doctoc -->
<!-- END doctoc -->
</details>
  
## What is it?
Overview

This repo contains a react app, created using create-react-app. It's located in the folder: /custom-pages/universal-login

That react app, builds a login page, password reset page and error page, to the location /custom-pages/pages

The whole custom-pages directory is then deployed to the Auth0 tenant. 

All the other files in this repo are mostly blank configuration templates deployed to Auth0 to configure the tenants. The secure configuration values are stored in Octopus Deploy and are inserted at deployment time.
  
## Stack

- [React](https://reactjs.org/) front-end
    - [Jest](https://facebook.github.io/jest/) for JavaScript tests
  
- [Configuration Deployment Command Line Client](https://auth0.com/docs/extensions/deploy-cli)
  - [Configuration Directory Structure](https://auth0.com/docs/extensions/deploy-cli/guides/import-export-directory-structure)
  
