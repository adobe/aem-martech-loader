// TODO path to the config file
// TODO we shouldn't need to specify the sheets that we want to retrieve
const FILE_PATH = '/drafts/neutrino/martech.json?sheet=default&sheet=adobe&sheet=consent';

function parseConfig(data, toCamelCase) {
  let env = 'Live';
  if (window.location.hostname === 'localhost') {
    env = 'Dev';
  } else if (window.location.hostname.endsWith('.hlx.page')) {
    env = 'Page';
  }
  const config = {};
  if (data) {
    data.forEach((prop) => {
      config[toCamelCase(prop.Property)] = prop[env];
    });
  }
  return config;
}

// keep the config of neutrino in a var to avoid loading and parsing the info twice
let neutrinoConfig;
async function getNeutrinoConfig(toCamelCase) {
  if (neutrinoConfig) {
    return neutrinoConfig;
  }
  const resp = await fetch(FILE_PATH);
  if (resp.status !== 200) {
    console.error(`Error reading neutrino configuration ${FILE_PATH}`);
    return {};
  }
  const json = await resp.json();
  neutrinoConfig = {};
  json.default.data.forEach((line) => {
    if (window.location.href.match(line.Path)) {
      Object.assign(neutrinoConfig, Object.fromEntries(line['Active Martech'].split(',')
        .map((n) => n.trim())
        .filter((n) => json[n])
        .map((n) => [n, parseConfig(json[n].data, toCamelCase)])));
    }
  });
  return neutrinoConfig;
}

// eslint-disable-next-line no-unused-vars
function loadExternalScript(document, script, config) {
  // TODO replace possible variables in script url
  const scriptElement = document.createElement('script');
  scriptElement.src = script;
  document.head.appendChild(scriptElement);
  return true;
}
async function loadMartech(delayedCondition, document, context) {
  const { sampleRUM, toCamelCase, getPlaceholderOrDefault } = context;
  Object.entries(await getNeutrinoConfig(toCamelCase))
    .filter(([, v]) => delayedCondition(v.delayed) && v.script)
    .forEach(([k, v]) => {
      console.log(`Load martech ${k}`);
      const { script } = v;
      if (script.startsWith('http')) {
        loadExternalScript(document, script, v);
      } else {
        import(script).then((m) => m.default({ sampleRUM, getPlaceholderOrDefault, ...v }));
      }
    });
}

/**
 * Load the martech configured as non-delayed
 * @param {*} context should contain at lease sampleRUM object and toCamelCase function
 */
export async function loadEager(document, pluginOptions, context) {
  getNeutrinoConfig(context.toCamelCase).then((nconfig) => Object.values(nconfig)
    .filter((v) => v.script && !v.script.startsWith('http') && v.earlyInit)
    .forEach((v) => import(v.script).then((m) => m.eagerInit && m.eagerInit())));
}

/**
 * Load the martech configured as non-delayed
 * @param {*} context should contain at lease sampleRUM object and toCamelCase function
 */
export async function loadLazy(document, pluginOptions, context) {
  loadMartech((delayed) => delayed && delayed.toLowerCase() === 'no', document, context);
}

/**
 * Load the martech configured as delayed
 * @param {*} context should contain at lease sampleRUM object and toCamelCase function
 */
export async function loadDelayed(document, pluginOptions, context) {
  loadMartech((delayed) => !delayed || delayed.toLowerCase() !== 'no', document, context);
}
