
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fjjghali%2Fconcourse-multibranch.svg?type=small)](https://app.fossa.com/projects/git%2Bgithub.com%2Fjjghali%2Fconcourse-multibranch?ref=badge_small)

# concourse-multibranch

Concourse resource allowing mutliple branch to run on a specific pipeline

## used packages

- https://www.npmjs.com/package/commander
- https://www.npmjs.com/package/inquirer
- https://www.npmjs.com/package/core-js
- https://www.npmjs.com/package/ora
- https://www.npmjs.com/package/axios

## to fix

Verify and change all the variables that contains the reference to the resource used to the correct one. See example below. github-sourcecode should be set to the name of the corresponding branch.
``` yaml
- put: cloud-foundry
        params:
          manifest: github-sourcecode/manifest.yml
          path: github-sourcecode
```

## References

- https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
- https://codeburst.io/how-to-build-a-command-line-app-in-node-js-using-typescript-google-cloud-functions-and-firebase-4c13b1699a27
- https://docs.atlassian.com/bitbucket-server/rest/6.9.1/bitbucket-branch-rest.html