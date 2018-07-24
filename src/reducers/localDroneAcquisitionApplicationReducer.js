import { CREATE_LOCALDRONEACQUISITIONAPPLICATION_REQUEST } from "../actions/localDroneAcquisitionApplicationCreateActions";
import { CREATE_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_SUCCESS } from "../actions/localDroneAcquisitionApplicationCreateActions";
import { CREATE_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_FAILURE } from "../actions/localDroneAcquisitionApplicationCreateActions";
import {
  EDIT_LOCALDRONEACQUISITIONAPPLICATION_REQUEST,
  EDIT_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_SUCCESS,
  EDIT_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_FAILURE
} from "../actions/localDroneAcquisitionApplicationEditActions";

const initialState = {
  currentApplicationForm: {},
  saving: false,
  saved: false,
  errors: null
};

export function saveLocalDroneAcquisitionApplication(
  state = initialState,
  action
) {
  switch (action.type) {
    case CREATE_LOCALDRONEACQUISITIONAPPLICATION_REQUEST:
    case EDIT_LOCALDRONEACQUISITIONAPPLICATION_REQUEST:
      return { ...state, saving: true, saved: false, errors: null };
    case CREATE_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_SUCCESS:
    case EDIT_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_SUCCESS:
      return {
        ...state,
        saving: false,
        saved: true,
        errors: null,
        currentApplicationForm: action.payload
      };
    case CREATE_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_FAILURE:
    case EDIT_LOCALDRONEACQUISITIONAPPLICATION_REQUEST_FAILURE:
      return {
        ...state,
        saving: false,
        saved: false,
        errors:
          (action.payload ? action.payload : "") +
          (action.payload.message ? "   " + action.payload.message : "")
      };
    default:
      return state;
  }
}