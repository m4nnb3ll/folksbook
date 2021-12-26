import React from 'react';
// CONSTANTS
import imgBgURL from "../../myPlugins/constants/imgBgURL";

const WallpaperImgWrapper = (props) => {

  const {
    profileImgURL
    , profileImgPercent
    , wallpaperImgURL
    , wallpaperPercent
    , profileImgUpload
  } = props;

  // if the function is undefined, then it is not "EditMyProfile"
  return profileImgUpload
    ? (() => {
      return (
        <div
          className="wallpaper-img-wrapper"
          style={{
            "--progress": `${wallpaperPercent}%`
            , backgroundImage: imgBgURL(wallpaperImgURL, false)
          }}
        >
          <label htmlFor="edit-wallpaper" className="edit-wallpaper"><i className="fas fa-pen"></i>Edit wallpaper
            <input
              type="file"
              accept="image/*"
              id="edit-wallpaper"
              onChange={ profileImgUpload.bind(this, "wallpaper") }
            />
          </label>
          <div className="profile-img-loader-wrapper">
            <div
              className="profile-img"
              style={{ backgroundImage: imgBgURL(profileImgURL) }}
            >
              <label htmlFor="edit-profile-img" className="edit-profile-img"><i className="fas fa-pen"></i>
                <input
                  type="file"
                  accept="image/*"
                  id="edit-profile-img"
                  onChange={ profileImgUpload.bind(this, "profile") }
                />
              </label>
            </div>
            {/* put 99.99999 instead of 100, because animation resets at 100 */}
            <div className="pie" style={{ animationDelay: `-${profileImgPercent===100 ? 99.99999 : profileImgPercent }s` }}/>
          </div>
        </div>
      )
    })()
    : (
        <div
          className="wallpaper-img-wrapper"
          style={{ backgroundImage: imgBgURL(wallpaperImgURL, false) }}
        >
          <div className="profile-img-loader-wrapper">
            <div
              className="profile-img"
              style={{ backgroundImage: imgBgURL(profileImgURL) }}
            ></div>
            <div className="pie" style={{ animationDelay: `0` }}/>
          </div>
        </div>
      );
}

export default WallpaperImgWrapper;