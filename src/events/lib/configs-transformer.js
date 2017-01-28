export default (handle, callback) => {
  let o = {};
  
  handle.split(':').reduce((o, part, index, parts) => {
    let next = parts[index + 1];
    o[part] = next ? {sub: {}} : {};
    return next ? o[part].sub : o[part];
  }, o).callbacks = [callback];
  
  return o;
};
