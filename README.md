# concourse-multibranch

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjjghali%2Fconcourse-multibranch.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjjghali%2Fconcourse-multibranch?ref=badge_small)

## Introduction
Concourse resource allowing mutliple branch to run on a specific pipeline. The application is made in TypeScript.

## Setup 

### Build the app
```bash
$ npm install
$ npm run build
```

### Install the CLI locally
```bash
$ npm install-cli
```
> Note: In linux you will need to run the command in sudo if you wish to be able to run it from anywhere

## Using it
### Help
```bash
$ cmbranch help
```
### Branches available in Bitbucket
```bash
$ cmbranch branch-available -u <username> -p <password> --project <project-name> -r <repo-slug>
```
or
```bash
$ cmbranch ba -u <username> -p <password> --project <project-name> -r <repo-slug>
```

### Generate a new pipeline with a job per branch
```bash
$ cmbranch generate-pipeline -u <username> -p <password> --project <project-name> --repo-slug <repo-slug> --pipeline-file <pipeline-file> --output-filename <output-filename>
```
Other options exists and you can look at them by using the following command.

```bash
$ cmbranch generate-pipeline --help
```

### Using the Docker image with Docker compose
```yaml
version: '3.3'

services: 
    concourse-multibranch:
        build: 
            context: .
            dockerfile: Dockerfile
        
        environment:
            cmbCommand: gp --help           
                
```



## Used packages

- https://www.npmjs.com/package/commander
- https://www.npmjs.com/package/inquirer
- https://www.npmjs.com/package/core-js
- https://www.npmjs.com/package/ora
- https://www.npmjs.com/package/axios


## References

- https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
- https://codeburst.io/how-to-build-a-command-line-app-in-node-js-using-typescript-google-cloud-functions-and-firebase-4c13b1699a27
- https://docs.atlassian.com/bitbucket-server/rest/6.9.1/bitbucket-branch-rest.html