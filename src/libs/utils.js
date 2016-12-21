export default {
  waterfall: (funcs, callback) => 
    !function waterfall(index = 0, ...rest) {
      funcs[index](...[(error, ...rest) => 
        error ? callback(error) : 
        ++index < funcs.length ? waterfall(...[index, ...rest]) :
        callback(...[null, ...rest]), ...rest]);
    }()
};
