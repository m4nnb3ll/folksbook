import React from 'react';
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import Post from "./Post";
// ACTIONS
import { toggleLike, deletePost } from "../../store/actions/postActions";
import { showModal } from "../../store/actions/modalActions";
// FUNCTIONS
import spreadObj from "../../myPlugins/functions/spreadObj";
import filterAndSortDate from "../../myPlugins/functions/filterAndSortDate";

const OwnPosts = (props) => {

  const {
    deletePost
    , history
    , isMyPost
    , myUid
    , ownPosts
    , toggleLike
    , firstname
    , lastname
    , profileImgURL
    , showModal
  } = props;

  // to sort the array increasingly based on createdAt
  const postsToShow = ownPosts && filterAndSortDate(spreadObj(ownPosts))
   
  return (
    <ul className="posts">
      { 
        isLoaded(postsToShow)
          ? isEmpty(postsToShow)
            ? <div className="txt-center" >{ isMyPost ? "You haven't created a post yet!" : "This user has no posts yet"}</div>
            : postsToShow.map((post) => {

                return (
                  isEmpty(post)
                    ? null
                    : <Post
                        key={ post.id }
                        commentsCount={ post.comments ? post.comments.length : 0 }
                        createdAt={ post.createdAt }
                        deletePost={ 
                          myUid === post.ownerId
                            ? showModal.bind(
                                this
                                , "You are about to delete your post!"
                                , {
                                    sideFunction: deletePost.bind(this, post.id)
                                    , choice: true, danger: true
                                  })
                            : false
                        }
                        history={ history }
                        imgs={ post.imgs }
                        likes={ post.likes ? post.likes : [] }
                        myUid = { myUid }
                        ownerFirstname={ firstname }
                        ownerId={ post.ownerId }
                        ownerLastname={ lastname }
                        ownerLink={ `/profile/${ post.ownerId }` }
                        postId={ post.id }
                        profileImgURL={ profileImgURL }
                        text={ post.text }
                        toggleLike = { toggleLike }
                      />
                );
              })
          : <div className="loading-circle"></div>
      }
    </ul>
  )
}


const mapStateToProps = (state) => ({ ownPosts: state.firestore.data.ownPosts });

const mapDispatchToProps = (dispatch) => ({
  toggleLike: (likeObj) => dispatch(toggleLike(likeObj))
  , deletePost: (postId) => dispatch(deletePost(postId))
  , showModal: (content, params) => dispatch(showModal(content, params))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect(({ profileId }) => {

    return (
      [
        {
          collection: "posts"
          , doc: profileId
          , subcollections: [
            { 
              collection: "docs"
              , sortBy: ["createdAt"]
            }            
          ]
          , storeAs: "ownPosts"
        }
      ]
    );
  })
)(OwnPosts);