const catchAsync = (asyncFn) => {
  return async (...args) => {
    try {
      return await asyncFn(...args);
    } catch (error) {
      console.log(error.response.data);
      throw error.response.data;
    }
  };
};

export default catchAsync;
