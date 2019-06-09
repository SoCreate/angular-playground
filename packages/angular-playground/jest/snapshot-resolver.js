// TODO save snapshots to project directory not in the playground module
module.exports = {
  // resolves from test to snapshot path
  resolveSnapshotPath: (testPath, snapshotExtension) => {
    console.log(testPath, snapshotExtension)
    console.log(__dirname)
    return testPath.replace('__tests__', '__snapshots__') + snapshotExtension
  },
   // resolves from snapshot to test path
  resolveTestPath: (snapshotFilePath, snapshotExtension) => {
    console.log(snapshotFilePath, snapshotExtension)
    console.log(__dirname)
    return snapshotFilePath
      .replace('__snapshots__', '__tests__')
      .slice(0, -snapshotExtension.length)
  },
  // Example test path, used for preflight consistency check of the implementation above
  testPathForConsistencyCheck: '__tests__/example.test.js',
};
