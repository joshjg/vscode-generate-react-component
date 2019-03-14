const vscode = require('vscode');
const path = require('path');
const fs = require('fs-plus');

const replacePlaceholders = (templateString, componentName) => (
  templateString.replace(/__ComponentName__/g, componentName)
);

const computeConditionals = (templateString, options) => (
  Object.keys(options).reduce((prev, curr) => (
    options[curr]
      ? prev.replace(new RegExp('\\/\\* ?IF ?!'+curr+'[\\s\\S]*?ENDIF ?\\*\\/', 'g'), '')
      : prev.replace(new RegExp(`\\/\\* ?IF ?`+curr+'[\\s\\S]*?ENDIF ?\\*\\/', 'g'), '')
  ), templateString).replace(/\/\* ?(END)?IF.*?\*\/\n?/g, '')
);

const validateName = (value, basePath) => {
  if (value === undefined || value.trim() === '') {
    return 'Invalid name';
  }
  if (fs.existsSync(path.join(basePath, value.trim()))) {
    return 'Path already exists';
  }
  return null;
}

const validateYN = (value) => {
  if (value !== undefined && value.toLowerCase() !== 'y' && value.toLowerCase() !== 'n') {
    return 'Type "y" or "n"';
  }
  return null;
}

const generate = (componentName, inputPath, mode, enabledOptions) => {
  const basePath = fs.isDirectorySync(inputPath)
    ? inputPath
    : path.join(inputPath, '..');
  const newPath = path.join(basePath, componentName);

  console.log(`Generating ${newPath}`);
  fs.mkdir(newPath, err => {
    if (err) throw err;
    // use included templates if user-defined path is empty
    const templatePath =
      vscode.workspace.getConfiguration('generate-react-component').get(`${mode}TemplatePath`).trim()
      || path.resolve(__dirname, `${mode}_template`);

    fs.readdir(templatePath, (err, files) => {
      if (err) throw err;
      files.map(filename => {
        const newFilename = replacePlaceholders(filename, componentName);
        const filePath = path.resolve(templatePath, filename);
        fs.readFile(filePath, (err, data) => {
          if (err) throw err;
					const newFilePath = path.join(newPath, newFilename);
          fs.appendFile(newFilePath, replacePlaceholders(
            computeConditionals(data.toString(), enabledOptions),
            componentName
          ), ()=>{});
        });
      });
    });
  });
}

const createDisposable = (type) => (
  vscode.commands.registerCommand(`extension.gen_${type}`, (target) => {
    // Display input box prompting for component name
    vscode.window.showInputBox({
      prompt: `Enter ${type} name`,
      validateInput: name => validateName(name, target.path),
    }).then((name) => {
      if (name === undefined) return undefined;

      const options = vscode.workspace
        .getConfiguration('generate-react-component')
        .get('conditionals');

      // Display a new input box for every conditional, resolve all in series
      let p = Promise.resolve({ name, enabledOptions: {} });
      return options.reduce((pc, opt) => {
        return pc = pc.then((prev) => (vscode.window.showInputBox({
          prompt: `Enable ${opt}? y/N`,
          validateInput: value => validateYN(value),
        }).then(value => {
          if (value === undefined || prev === undefined) return undefined;

          return {
            name,
            enabledOptions: Object.assign(
              {},
              prev.enabledOptions,
              { [opt]: (value.toLowerCase() === 'y') }
            ),
          };
        })));
      }, p);
    }).then((params) => {
      if (params === undefined) return;

      const { name, enabledOptions } = params;
      generate(name.trim(), target.fsPath, type, enabledOptions);
    });
  })
)

const activate = (context) => {
  context.subscriptions.push(
    createDisposable('component'),
    createDisposable('container')
  );  
}

exports.activate = activate;
