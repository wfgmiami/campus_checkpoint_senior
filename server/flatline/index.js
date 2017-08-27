export const groupBy = (collection, iterator) => {

  let newUser = {over13:[],underOrExactly13: []};

    if(typeof iterator === 'string'){
      return collection.reduce((memo,user)=>{
        (memo[user.state]) ? memo[user.state].push(user) : memo[user.state] = [user]
        return memo;
      },{})

    }else{
      collection.forEach(user=>{
        if(iterator(user) === 'over13'){
          newUser.over13.push(user)
        }else{
          newUser.underOrExactly13.push(user)
        }
      })
      return newUser;
    }
};

export const flowRight = (...args) => {

   return function(...param){
    return args.reverse().reduce( (memo,fn) => {
      if(memo.length === 0){
        memo = fn.apply(null,param);
        //console.log(memo,[memo])
        return memo;
       }else{
         memo = fn.apply(null,[memo])
         return memo;
       }
    },[])
  }

};
