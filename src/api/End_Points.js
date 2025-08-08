export const BASE_URL = "https://shopping-beck-end.onrender.com";
// export const BASE_URL = "http://localhost:3000"
// https://shopping-beck-end.onrender.com
export default {
    SIGN_UP: BASE_URL + "/register",
    LOG_IN: BASE_URL + "/login",
    GET_STORIES: BASE_URL + "/story/stories",
    GET_POST: BASE_URL + "/api/getAllPost",
    CREATE_POST: BASE_URL + "/api/createPost",
    CREATE_STORY: BASE_URL + "/story/create",
    DISCOVER: BASE_URL + "/searchUsers",
    EDIT_PROFILE: BASE_URL + "/update",
    GET_ALL_POST: BASE_URL + "/api/getAllPost",
    DELETE_POST: BASE_URL + "/api/deletePost",
    SINGLE_POST: BASE_URL + "/api/getPost",
    PROFILE_IMAGE: BASE_URL + "/public/profile",
    PROFILE_UPDATE: BASE_URL + "/profile",


    FOLLOW: BASE_URL + "/follow/",

    UNIQUE_STORY: BASE_URL + "/story/stories/:id",
    SINGLE_STORY: BASE_URL + "/story/stories/"


}