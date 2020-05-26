# README

Thin version of https://github.com/yldio/asap-hub to replicate an error packaging serverless functions.

Reproduce the issue:

```
$ yarn
$ yarn package
$ unzip -p .serverless/asap-hub-development-create-user.zip apps/user-service/build/handlers/create.js | grep "eval(\"require"
```

**The last command shouldn't return results**
