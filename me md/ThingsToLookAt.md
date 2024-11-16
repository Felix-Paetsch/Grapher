```js
    console.assert(bool, variable) 
    //entspricht: 
    //if (!bool) console.log(variable)
    console.table(obj);
        //nice obj / array display
    console.count()
        //look how often smth repeats

    void function(){
        console.log('this f is executed, then deleted? or there does not exist a return value');
    }

    //komma opperator
    //returns last of its values
    const type = 'man';
    const isMale = type === 'man' ? (
        console.log('Hi Man!'),
        true
    ) : (
        console.log('Hi Lady!'),
        false
    );

    console.log(`isMale is "${isMale}"`);

    //call function ! 
    //call the function in scope (same vars as) first param
    var animal = 'dog';
    function getAnimal(adjective) { alert(adjective+' '+this.animal); };
    var myObj = {animal: 'camel'};
    getAnimal.call(myObj, 'lovely'); //alerts 'lovely camel'
```
- Block naming
    -> for loops