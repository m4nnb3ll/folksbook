import React from 'react';
import { compose } from "redux";
import { connect } from 'react-redux';
import { firestoreConnect, isLoaded, isEmpty } from "react-redux-firebase";
// COMPONENTS
import Post from "./Post";
// ACTIONS
import { toggleLike, deletePost } from "../../store/actions/postActions";
import { showModal } from "../../store/actions/modalActions";
// FUNCTIONS
import spreadObj from "../../myPlugins/functions/spreadObj";
import filterAndSortDate from "../../myPlugins/functions/filterAndSortDate";

const HomePosts = (props) => {

  if(!props.firebaseAuth.uid) return <Redirect to="/"/>;

  const {
    firebaseAuth
    , users
    , posts: postsCollection
    , showModal
    , deletePost
  } = props;
  
  const myUid = firebaseAuth.uid;

  return isLoaded(postsCollection)
    ? isEmpty(postsCollection)
      ? <div>No posts yet...</div>
      : (
        <ul className="posts">
          {
            filterAndSortDate 
            (/* "filterAndSortDate" is operating on the result of "spreadObj" and "reduce" */
              spreadObj(postsCollection)
              .reduce((acc, curr) => {
                return [...acc, ...spreadObj(curr.docs)]
              }, [])
            )
            .map((post) => {
              // if a user got deleted
              if(!users[post.ownerId] || isEmpty(post)) return null;
    
              const {
                firstname
                , lastname
                , profileImgURL
              }=users[post.ownerId];
              
              return (
                <Post
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
                              , choice: true
                              , danger: true
                            }
                        )
                      : false
                  }
                  history={ props.history }
                  imgs={ post.imgs }
                  likes={ post.likes ? post.likes : [] }
                  myUid = { myUid }
                  ownerFirstname={ firstname }
                  ownerId={ post.ownerId }
                  ownerLastname={ lastname }
                  ownerLink={ `/profile/${post.ownerId}` }
                  postId={ post.id }
                  profileImgURL={ profileImgURL }
                  text={ post.text }
                  toggleLike = { props.toggleLike }
                />
              );
            })
          }
        </ul>
      )
    : <div className="loading-circle"></div>
}

const mapStateToProps = (state) => {

  const { auth, profile } = state.firebase;
  const { posts, users } = state.firestore.data;

  return ({
    firebaseAuth: auth
    , firebaseProfile: profile
    , posts
    , users
  });
}

const mapDispatchToProps = (dispatch) => ({
  toggleLike: (likeObj) => dispatch(toggleLike(likeObj))
  , deletePost: (postId) => dispatch(deletePost(postId))
  , showModal: (content, params) => dispatch(showModal(content, params))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps)
  , firestoreConnect((props) => {

    const { uid: myUid } = props.firebaseAuth;
    
    return myUid
      ? (() => {
        {
          const postsToFetch = [
            { 
              collection: "posts"
              , doc: myUid
              , subcollections: [
                { collection: "docs" }
              ]
            },
            { collection: "users" }
          ]

          const { friends: myFriendsIds } = props.firebaseProfile;
    
          if(myFriendsIds) {
            
            postsToFetch
            .push(...myFriendsIds.map((friendId) => { // used "..." to not have a nested array (which causes an error)
                return ({ 
                  collection: "posts"
                  , doc: friendId
                  , subcollections: [
                    { collection: "docs" }
                  ]
                })
              })
            )
          }
          
          return postsToFetch;
        }
      })()
      : []

  })
)(HomePosts);