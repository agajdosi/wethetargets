# We the Targets - browser extension

We the Users are being analyzed, targeted and manipulated.
We know about it, but it is hard to get insight into those processes.
This browser extenstion is an experimental attempt to understand it in more detail.
It is an attempt in Applied Platform Psychology.

## Build locally

1. Run `npm install` to install all required dependencies
2. Run `npm run build`

The build step will create the distribution folder, this folder will contain the generated extension.


## Run the extension

Using web-ext is recommened for automatic reloading and running in a dedicated browser instance.

1. Run `npm run watch` to watch for file changes and build continuously
2. Run `npm install --global web-ext` (only only for the first time)
3. In another terminal, run `web-ext run` for Firefox or `web-ext run -t chromium`
4. Check that the extension is loaded by opening the extension options (in Firefox or in Chrome).

### CONSOLE

Check the console at: about:debugging#/runtime/this-firefox, click on explore.


## Signing

1. have or create account on AMO https://addons.mozilla.org
2. have or create api-key (aka JWT-issuer) and api-secret (aka JWT-secret) on https://addons.mozilla.org/en-US/developers/addon/api/key/
3. make sure
4. run `web-ext sign --api-key <JWT-issuer> --api-secret <JWT-secret>`


## Thanks

Thanks to Fregante and other contributors of https://github.com/fregante/browser-extension-template for a nice starting template.

