// FUNCTIONS
import stripFB from "../../myPlugins/functions/stripFB";

const initState = {
  editProfileErr: null
  , deleteUserErr: null
  , imgsUploading: {
    profile: { complete: true }
    , wallpaper: { complete: true }
  }
  , imgUploadErr: null
};

const editProfileReducer = (state=initState, action) => {
  switch(action.type) {
    case "CLEAR_PROFILE_IMG_STATE":
    case "ROUTE_CHANGE_INTERRUPTION"
      : return ({ ...state, imgsUploading: { profile: { complete: true }, wallpaper: { complete: true } } });
    case "PROFILE_IMG_UPLOADING_INIT"
      : return ({
          ...state
          , imgsUploading: ({
              ...state.imgsUploading
              , [action.imgType]: ({
                  name: action.imgName
                  , percent: 0
                  , complete: false
                  , url: ""
                  , id: action.imgId
                  , type: action.imgType
            })
          })
        });
    case "PROFILE_IMG_UPLOADING_UPDATE"
      : return ({
          ...state
          , imgsUploading: ({
              ...state.imgsUploading
              , [action.imgType]: ({ ...state.imgsUploading[action.imgType], percent: action.percent })
          })
        });
    case "PROFILE_IMG_UPLOADING_COMPLETE"
      : return ({
          ...state
          , imgsUploading: ({
              ...state.imgsUploading
              , [action.imgType]: ({
                ...state.imgsUploading[action.imgType]
                  , complete: true
                  , url: action.url
                })
          })
        });
    case "PROFILE_IMG_UPLOADING_ERROR"
      : return ({ ...state, imgUploadErr: action.err.message });
    case "CLEAR_DELETE_USER_ERROR"
      : return ({ ...state, deleteUserErr: null })
    case "DELETE_USER_ERROR"
      : return ({ ...state, deleteUserErr: stripFB(action.err.message) })
    case "PROFILE_DETAILS_UPDATE_SUCCESS"
      : return ({ ...state, editProfileErr: null });
    case "PROFILE_DETAILS_UPDATE_ERROR"
      : return ({ ...state, editProfileErr: stripFB(action.err.message) });
    default
      : return state;
  }
}

export default editProfileReducer;