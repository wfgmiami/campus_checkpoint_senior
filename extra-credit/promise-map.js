const resolve = function(value){
  if (value instanceof Promise) return value;
  return new Promise(function(resolve,reject) { resolve(value )})
}

// const reject = function(err){
//   return err;
// }

Promise.map = (collection, iterator) => {
  let arr = [];
  doSomething()
  return new Promise((resolve) => {
    collection.forEach( file => {
      return new Promise((resolve)=>{
        arr.push(iterator(file))
        resolve(arr)
      })
      //arr.push(iterator(file))
    })
    resolve(arr);

  })


};
