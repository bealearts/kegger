export default function backgroundTask(func) {
  return new Promise((resolve, reject) => {
    try {
      const result = func();

      if (result.then) {
        result.then(resolve);
        if (result.catch) result.catch(reject);
      } else {
        resolve(result);
      }
    } catch (error) {
      reject(error);
    }
  });
}
