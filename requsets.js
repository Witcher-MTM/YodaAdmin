const getData = async (url) =>{
    console.log(url)
    console.log('getData')
    try{
        const result = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
              },
            method: 'GET',
        })
        if(result.status == 200){
            const data = await result.json();
            return data;
        }
        return null;
    }
    catch(err){
        console.error(err);
        return null;
    }
}
const addData = async (url,object)=>{
    console.log("addData")
    result = await(await fetch(url,{
        method:"POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(object)
      })).json()
      return result
}
const removeData = async (url) =>{
    console.log('removeData')
    try{
        const result = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
        })
        return true;
        
    }
    catch(err){
        console.error(err);
        return null;
    }
}
const updateData = async (url, object) =>{
    try{
        const result = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
              },
            body: await JSON.stringify(object)
        })
        return await (result).json();
    }
    catch(err){
        console.error(err);
        return null;
    }
}
module.exports={
    getData,
    addData,
    removeData,
    updateData
}