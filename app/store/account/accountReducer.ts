import { AccountAction, AccountDetailsDto, AccountState } from "../../models/user";

export const accountReducer = (state: AccountState, action: AccountAction): AccountState => {
  switch (action.type) 
  {
    case "FETCH_START":
      return { ...state, loading: true, error: null };

    case "FETCH_SUCCESS":
      return { ...state, accountDetails: action.payload, loading: false, error: null };

    case "FETCH_ERROR":
      return { ...state, accountDetails: null, loading: false, error: action.payload };

    case "LOGOUT":
      return { ...state, accountDetails: null, loading: false, error: null };

    case "APPEND_USER":
      return { 
        ...state, 
        accountDetails: { 
          ...state.accountDetails, 
          token: action.payload 
        }  as AccountDetailsDto
      };
    case "ADD_OUTGOING_URL":
      return { 
        ...state, 
        outGoingUrl : action.outGoingUrl
      };

    case "APPEND_JWT":
      return { 
        ...state, 
        accountDetails: { 
          ...state.accountDetails, 
          token : action.payload 
        }  as AccountDetailsDto
      };
    
    default:
      return state;
  }
};