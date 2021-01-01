Stories experience for Teams Enterprise

Works off a fairly generic implementation that can be ported to other applications. Switch out the Teams & AAD usage for other auth mechanisms.

## Get Started

Uses Next.JS, start by setting up your [env variables](https://nextjs.org/docs/basic-features/environment-variables):

```Note: The following are emulator values, and are not secret leaks```

```
AZURE_STORAGE_CONNECTION_STRING=UseDevelopmentStorage=true
AZURE_STORAGE_ACCOUNT_NAME=devstoreaccount1
AZURE_STORAGE_ACCOUNT_KEY=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==
AZURE_APPLICATION_ID=<AppRegistrationId>
AZURE_APPLICATION_SECRET=<AppSecretId>
```

Then `yarn install` and `yarn teams` (read next for teams use).

If looking to debug in Teams, which you must to do anything useful, follow [this guide](https://docs.microsoft.com/en-us/microsoftteams/platform/build-your-first-app/build-first-app-overview). Teams will host our site in an iframe, but it requires `https` to function. To support `https` and AAD's annoying restriction to not support localhost, we need to use a custom domain. Easiest path forward is to run fiddler with a redirection.

Redirect calls targeting 'dev.clippy.team' to localhost using Fiddler:

```
if (oSession.HostnameIs("dev.clippy.team")){
    oSession.host="localhost:3000";
}
```

Generate certificates for NextJS to run as https:

```
$cert = New-SelfSignedCertificate -certstorelocation cert:\localmachine\my -dnsname dev.clippy.team
$path = `cert:\localMachine\my\' + $cert.thumbprint
$pwd = ConvertTo-SecureString -String `password123' -Force -AsPlainTex
Export-PfxCertificate -cert $path -FilePath c:\certs\devcert.pfx -Password $pwd
```

