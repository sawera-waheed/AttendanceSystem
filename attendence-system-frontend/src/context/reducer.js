const reducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        student: action.payload,
      };
    default:
      return;
  }
};

export default reducer;
