export default {
  clone: o => JSON.parse(JSON.stringify(o)),
  
  waterfall: (funcs, callback) => 
    !function waterfall(index = 0, ...rest) {
      funcs[index](...[(error, ...rest) => 
        error ? callback(error) : 
        ++index < funcs.length ? waterfall(...[index, ...rest]) :
        callback(...[null, ...rest]), ...rest]);
    }()
};
