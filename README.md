Stories experience for Teams Enterprise

Fairly generic implementation that can be ported to other applications. Switch out the Teams & AAD usage for other auth mechanisms.

## Get Started

Uses Next.JS, start by setting up your [env variables](https://nextjs.org/docs/basic-features/environment-variables):

```Note: The following are emulator values, and are not secret leaks```

```
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
AZURE_STORAGE_ACCOUNT_NAME=devstoreaccount1
AZURE_STORAGE_ACCOUNT_KEY=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
```

Then `yarn install` and `yarn teams` (read next for teams use).

If looking to debug in Teams, which you must to do anything useful, follow [this guide](https://docs.microsoft.com/en-us/microsoftteams/platform/build-your-first-app/build-first-app-overview). When you reach the 'sideload' section that requires SSL, you'll need to run NextJS with `https`. Details on how to do this are [here](https://medium.com/responsetap-engineering/nextjs-https-for-a-local-dev-server-98bb441eabd7). To generate pfx on Windows, read [this](https://medium.com/the-new-control-plane/generating-self-signed-certificates-on-windows-7812a600c2d8).

