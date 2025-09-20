module.exports = async () => {
  console.log('\nStopping MySQL container...');
  const db = (global as any).__MYSQL_CONTAINER__;
  if (db) {
    await db.stop();
    console.log('MySQL container stopped.');
  }
};
