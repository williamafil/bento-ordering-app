import React, { createContext, useReducer } from "react";

const initialState = {
  notices: [],
};

const noticeReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTICE":
      const currentTimestamp = Date.now();
      const createdAt = action.payload.createdAt;

      if (createdAt <= currentTimestamp - 20000) return state;

      return {
        notices: [
          {
            type: action.payload.type,
            id: action.payload.id,
            name: action.payload.name,
            createdAt: action.payload.createdAt,
          },
          ...state.notices,
        ],
      };
    case "REMOVE_NOTICE":
      const rest = state.notices.filter((n) => n.id !== action.payload);
      return {
        notices: [...rest],
      };
    default:
      return state;
  }
};

export const NoticeContext = createContext({
  state: initialState,
  dispatch: () => {},
});

export const NotificationProvider = ({ children }) => {
  const [state, dispatch] = useReducer(noticeReducer, initialState);

  return (
    <NoticeContext.Provider value={{ state, dispatch }}>
      {children}
    </NoticeContext.Provider>
  );
};
