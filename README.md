# MarTech Loader Optimization plug-in
Martech Loader for AEM Edge Delivery Services.
Requires that project is instrumented with the [aem plugin system]

## Installation
Add it to your project via `git subtree`

###### SSH

```bash
git subtree add --squash --prefix plugins/martech-loader git@github.com:chicharr/aem-martech-loader-plugin.git main
```

###### HTTPS

```bash
git subtree add --squash --prefix plugins/martech-loader git@github.com:chicharr/aem-martech-loader-plugin.git main
```

You can then later update it from the source again via:

###### SSH

```bash
git subtree pull --squash --prefix plugins/martech-loader git@github.com:chicharr/aem-martech-loader-plugin.git main
```

###### HTTPS

```bash
git subtree pull --squash --prefix plugins/martech-loader git@github.com:chicharr/aem-martech-loader-plugin.git main
```

## Usage
Following the AEM plugin system API this plugin should be initialized in the project's `scripts.js`

```
window.hlx.plugins.add('martech-loader', '/plugins/martech-loader/src/index.js');
```

## Configuring Martech loader
Currently the configuration is done in an Excel file.
The format of the configuration file is still evolving, and continuously changing. For more information reach out to @grumaz @reiss @chicharr on Slack


## Which Martech stacks are supported
At the moment this plugin supports:
* Adobe Analytics / Customer Journey Optimizer via WebSDK
* Cookie Consent: Using OOTB an opensource cookie consent tool https://github.com/sandstreamdev/cookieconsent
* Google Analytics
* Google Tag Manager