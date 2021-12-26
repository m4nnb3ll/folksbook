const initState = {
  imgsUploading: []
  , imgUploadErr: null
};

const imgReducer = (state=initState, action) => {
  switch(action.type) {
    case "CLEAR_IMG_STATE":
    case "ROUTE_CHANGE_INTERRUPTION"
    : return ({ ...state, imgsUploading: [] });
    case "IMG_UPLOADING_INIT"
    : {
      const updatedImgsUploading = [...state.imgsUploading];

      updatedImgsUploading[action.imgOrder] = ({
        name: action.imgName
        , order: action.imgOrder
        , percent: 0
        , complete: false
        , url: ""
        , id: action.imgId
        , type: action.imgType
      });

      return ({
        ...state
        , imgsUploading: updatedImgsUploading
      });
    }
    case "IMG_UPLOADING_UPDATE"
    : {
      const updatedImgsUploading = [...state.imgsUploading];

      updatedImgsUploading[action.imgOrder].percent = action.percent;

      return ({
        ...state
        , imgsUploading: [...updatedImgsUploading]
      });
    }
    case "IMG_UPLOADING_COMPLETE"
    : {
      const updatedImgsUploading = [...state.imgsUploading]; 
      
      updatedImgsUploading[action.imgOrder].complete = true;
      updatedImgsUploading[action.imgOrder].url = action.url;

      return ({
        ...state
        , imgsUploading: [...updatedImgsUploading]
      });
    }
    case "IMG_UPLOADING_ERROR"
    : return ({ ...state, imgUploadErr: action.err.message });
    default
    : return state;
  }
}

export default imgReducer;