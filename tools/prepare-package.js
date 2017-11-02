process.stdin.setEncoding('utf8');

/**
 * These properties will be removed from the package.json on release.
 * `private` is set on the root package.json to prevent accidental release.
 */
const blacklist = ['private', 'scripts', 'scripts-info', 'devDependencies'];

process.stdin.resume();
process.stdin.setEncoding('utf8');

/**
 * 1) Get and store package.json data
 * 2) When all the data is received, parse json
 * 3) Remove blacklisted keys.
 * 4) Write to stdout
 */
let packageJson = '';

/** 1 */
process.stdin.on('data', chunk => { packageJson += chunk });

process.stdin.on('end', () => {
  /** 2 */
  let parsed;
  try {
    parsed = JSON.parse(packageJson);
  } catch (e) {
    console.error('Cannot parse to JSON');
    process.exit(1);
  }

  /** 3 */
  const result = {};
  Object.keys(parsed).forEach(key => {
    if (blacklist.indexOf(key) < 0) {
      result[key] = parsed[key];
    }
  });

  /** 4 */
  process.stdout.write(JSON.stringify(result, null, 2));
  packageJson = '';
});
